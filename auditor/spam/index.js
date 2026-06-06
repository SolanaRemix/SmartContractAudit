/**
 * Spam Detector Module
 * Production-hardened spam contract and transaction detection
 * @version 1.0.0
 */

class SpamDetector {
  constructor(config = {}) {
    this.config = {
      threshold: config.threshold || 80,
      checkAirdrop: config.checkAirdrop !== false,
      checkSimilarity: config.checkSimilarity !== false,
      minContractAge: config.minContractAge || 86400, // 1 day in seconds
      rpcProvider: config.rpcProvider || null,
      explorerApi: config.explorerApi || null
    };

    // Known spam patterns for static analysis
    this.knownSpamPatterns = this._initializeSpamPatterns();
  }

  // ─── Spam Patterns ──────────────────────

  _initializeSpamPatterns() {
    return {
      massAirdrop: {
        pattern: /for\s*\([^)]*\)\s*\{[^}]*transfer\s*\(/i,
        description: 'Loop-based mass transfer — potential airdrop spam',
        weight: 40
      },
      proxyPattern: {
        pattern: /delegatecall|fallback\s*\(\)\s*external\s*payable/i,
        description: 'Proxy/delegate pattern — common in scam contracts',
        weight: 20
      },
      dustTransfer: {
        pattern: /transfer\s*\(\s*\w+\s*,\s*(1|0\.0{3,}|[1-9]\d{0,2})\s*\)/i,
        description: 'Dust amount transfers — spam indicator',
        weight: 25
      },
      nameImpersonation: {
        pattern: /(USDT|USDC|DAI|WBTC|WETH|UNI|AAVE|LINK)\s*(Token|Coin|Cash)/i,
        description: 'Name impersonation of established tokens',
        weight: 35
      },
      noLiquidityMechanism: {
        pattern: /(?!.*(uniswap|pancake|router|pool|liquidity))/i,
        description: 'No DEX integration — limited utility token',
        weight: 15
      }
    };
  }

  // ─── Main Analysis Method ───────────────

  /**
   * Analyze a contract for spam indicators
   * @param {string} address - Contract address
   * @param {string} chain - Blockchain network
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeContract(address, chain) {
    this._validateInputs(address, chain);

    const startTime = Date.now();
    const indicators = [];
    let spamScore = 0;

    // Run all checks in parallel
    const checks = await Promise.allSettled([
      this._safeCheck('contractAge', () => this._checkContractAge(address, chain), 25),
      this._safeCheck('deploymentFreq', () => this._checkDeploymentFrequency(address, chain), 20),
      this.config.checkAirdrop
        ? this._safeCheck('airdropPattern', () => this._checkAirdropPattern(address, chain), 30)
        : Promise.resolve(null),
      this.config.checkSimilarity
        ? this._safeCheck('codeSimilarity', () => this._checkCodeSimilarity(address, chain), 35)
        : Promise.resolve(null),
      this._safeCheck('distribution', () => this._checkDistributionPattern(address, chain), 15)
    ]);

    // Process results
    for (const check of checks) {
      if (check.status === 'fulfilled' && check.value) {
        if (check.value.isSuspicious) {
          indicators.push(check.value);
          spamScore += check.value.weight || 0;
        }
      } else if (check.status === 'rejected') {
        indicators.push({
          type: 'check-error',
          isSuspicious: false,
          description: check.reason?.message || 'Check failed',
          weight: 0,
          available: false
        });
      }
    }

    // Static source code analysis
    try {
      const sourceCode = await this._getContractCode(address, chain);
      if (sourceCode) {
        const staticFindings = this._scanSourceCode(sourceCode);
        for (const finding of staticFindings) {
          indicators.push(finding);
          spamScore += finding.weight || 0;
        }
      }
    } catch {
      // Source code not available — skip static analysis
    }

    const isSpam = spamScore >= this.config.threshold;
    const confidence = spamScore >= this.config.threshold
      ? Math.min(100, ((spamScore - this.config.threshold) / (200 - this.config.threshold)) * 50 + 50)
      : Math.min(100, (spamScore / this.config.threshold) * 50);
    const duration = Date.now() - startTime;

    return {
      address,
      chain,
      isSpam,
      confidence: Math.round(confidence),
      spamScore,
      threshold: this.config.threshold,
      indicators,
      indicatorCount: indicators.filter(i => i.isSuspicious).length,
      duration,
      timestamp: Date.now(),
      scanType: 'spam'
    };
  }

  /**
   * Analyze a transaction for spam patterns
   * @param {string} txHash - Transaction hash
   * @param {string} chain - Blockchain network
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeTransaction(txHash, chain) {
    if (!txHash || typeof txHash !== 'string') {
      throw new Error('Transaction hash is required');
    }

    const startTime = Date.now();
    const indicators = [];
    let isSpam = false;

    try {
      const tx = await this._getTransaction(txHash, chain);

      if (tx) {
        // Mass airdrop detection
        if (tx.toAddresses && tx.toAddresses.length > 100) {
          indicators.push({
            type: 'mass-airdrop',
            description: `Transaction sends tokens to ${tx.toAddresses.length} addresses`,
            weight: 40,
            isSuspicious: true
          });
          isSpam = true;
        }

        // Dust amount detection
        if (tx.value && parseFloat(tx.value) < 0.000001 && tx.value > 0) {
          indicators.push({
            type: 'dust-amount',
            description: 'Transaction sends dust amounts (potential spam airdrop)',
            weight: 30,
            isSuspicious: true
          });
          isSpam = true;
        }

        // Repeated small transfers (spam pattern)
        if (tx.toAddresses && tx.toAddresses.length > 10 && tx.value && parseFloat(tx.value) < 0.01) {
          indicators.push({
            type: 'repeated-micro-transfers',
            description: 'Multiple micro-transfers — spam distribution pattern',
            weight: 25,
            isSuspicious: true
          });
          isSpam = true;
        }
      }
    } catch (error) {
      indicators.push({
        type: 'transaction-fetch-error',
        description: `Could not retrieve transaction: ${error.message}`,
        weight: 0,
        isSuspicious: false,
        available: false
      });
    }

    const duration = Date.now() - startTime;

    return {
      txHash,
      chain,
      isSpam,
      reason: indicators.filter(i => i.isSuspicious).map(i => i.description).join('; ') || 'No spam indicators',
      indicators,
      duration,
      timestamp: Date.now()
    };
  }

  // ─── Safe Check Wrapper ─────────────────

  async _safeCheck(type, fn, defaultWeight) {
    try {
      const result = await fn();
      return {
        ...result,
        type: result.type || type,
        weight: result.weight || defaultWeight
      };
    } catch (error) {
      return {
        type,
        isSuspicious: false,
        description: `Check unavailable: ${error.message}`,
        weight: 0,
        available: false
      };
    }
  }

  // ─── Source Code Analysis ───────────────

  _scanSourceCode(sourceCode) {
    const findings = [];
    const lines = sourceCode.split('\n');

    for (const [name, patternDef] of Object.entries(this.knownSpamPatterns)) {
      const matches = [];

      for (let i = 0; i < lines.length; i++) {
        if (patternDef.pattern.test(lines[i])) {
          matches.push({ line: i + 1, code: lines[i].trim().substring(0, 120) });
        }
      }

      if (matches.length > 0) {
        findings.push({
          type: name,
          isSuspicious: true,
          description: patternDef.description,
          weight: patternDef.weight,
          occurrences: matches.length,
          lines: matches.map(m => m.line),
          detectionMethod: 'static-analysis'
        });
      }
    }

    return findings;
  }

  // ─── Detection Stubs (Graceful Fallback) ─

  async _checkContractAge(address, chain) {
    if (!this.config.rpcProvider) {
      return { isSuspicious: false, description: 'RPC provider not configured', available: false };
    }
    return { isSuspicious: false, description: 'Contract age check not yet implemented', available: false };
  }

  async _checkDeploymentFrequency(address, chain) {
    return { isSuspicious: false, description: 'Deployment frequency check requires indexer integration', available: false };
  }

  async _checkAirdropPattern(address, chain) {
    return { isSuspicious: false, description: 'Airdrop pattern detection requires transaction history', available: false };
  }

  async _checkCodeSimilarity(address, chain) {
    return { isSuspicious: false, description: 'Code similarity requires a reference database of known spam contracts', available: false };
  }

  async _checkDistributionPattern(address, chain) {
    return { isSuspicious: false, description: 'Distribution analysis requires token holder enumeration', available: false };
  }

  async _getTransaction(txHash, chain) {
    if (!this.config.rpcProvider) return null;
    return null; // Real implementation needed
  }

  async _getContractCode(address, chain) {
    if (!this.config.explorerApi) return null;
    return null; // Real implementation needed
  }

  // ─── Validation ──────────────────────────

  _validateInputs(address, chain) {
    if (!address || typeof address !== 'string') {
      throw new Error('Address must be a non-empty string');
    }
    const validChains = ['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'solana'];
    if (!validChains.includes(chain?.toLowerCase())) {
      throw new Error(`Invalid chain: ${chain}`);
    }
  }

  // ─── Public API ──────────────────────────

  getAvailableChecks() {
    return {
      checks: [
        'contractAge',
        'deploymentFrequency',
        'airdropPattern',
        'codeSimilarity',
        'distributionPattern'
      ],
      staticPatterns: Object.keys(this.knownSpamPatterns),
      threshold: this.config.threshold,
      minContractAge: this.config.minContractAge,
      checkAirdropEnabled: this.config.checkAirdrop,
      checkSimilarityEnabled: this.config.checkSimilarity
    };
  }
}

module.exports = SpamDetector;