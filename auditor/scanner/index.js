/**
 * Deep Scanner Module
 * Production-hardened multi-module scan orchestrator
 * @version 1.0.0
 */

const crypto = require('crypto');
const AntivirusScanner = require('../antivirus');
const SpamDetector = require('../spam');
const HoneypotDetector = require('../honeypot');
const WalletTracer = require('../tracer');

// ─── Constants ───────────────────────────────────
const VALID_MODULES = ['antivirus', 'spam', 'honeypot', 'tracer'];
const DEFAULT_MODULES = ['antivirus', 'spam', 'honeypot', 'tracer'];
const DEFAULT_TIMEOUT_PER_MODULE = 120_000; // 2 minutes
const VALID_CHAINS = ['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'solana'];

// ─── Deep Scanner Class ──────────────────────────

class DeepScanner {
  constructor(config = {}) {
    this.config = {
      timeoutPerModule: config.timeoutPerModule || DEFAULT_TIMEOUT_PER_MODULE,
      defaultModules: config.defaultModules || DEFAULT_MODULES,
      ...config
    };
    
    // Initialize all scanner modules
    this.antivirus = new AntivirusScanner(config.antivirus || {});
    this.spam = new SpamDetector(config.spam || {});
    this.honeypot = new HoneypotDetector(config.honeypot || {});
    this.tracer = new WalletTracer(config.tracer || {});
    
    this._moduleMap = {
      antivirus: this.antivirus,
      spam: this.spam,
      honeypot: this.honeypot,
      tracer: this.tracer
    };
  }

  /**
   * Perform comprehensive scan using specified modules
   * @param {string} target - Address or transaction hash
   * @param {string} chain - Blockchain network
   * @param {string[]} [modules] - Modules to use (default: all)
   * @returns {Promise<Object>} Comprehensive scan results
   */
  async scan(target, chain, modules = null) {
    // ─── Input Validation ──────────────────
    this._validateInputs(target, chain);
    
    const activeModules = this._validateModules(modules || this.config.defaultModules);
    const scanId = this._generateScanId();
    const startTime = Date.now();
    
    console.log(
      `[DeepScanner:${scanId}] Starting scan of ${target} on ${chain}\n` +
      `  Modules: ${activeModules.join(', ')}`
    );

    // ─── Module Execution Plan ─────────────
    const moduleTasks = this._buildModuleTasks(target, chain, activeModules, scanId);
    
    // ─── Execute All Modules in Parallel ───
    const moduleResults = await Promise.allSettled(moduleTasks);
    
    // ─── Process Results ───────────────────
    const results = this._processModuleResults(moduleResults, activeModules);
    const summary = this._generateSummary(results, activeModules);
    const duration = Date.now() - startTime;

    const scanResult = {
      target,
      chain,
      scanId,
      timestamp: Date.now(),
      duration,
      modules: activeModules,
      results,
      summary,
      status: summary.overallRisk === 'error' ? 'failed' : 'completed'
    };

    console.log(
      `[DeepScanner:${scanId}] Scan completed in ${duration}ms\n` +
      `  Risk: ${summary.overallRisk.toUpperCase()}\n` +
      `  Issues: ${summary.totalIssues}\n` +
      `  Modules succeeded: ${summary.modulesSucceeded}/${summary.modulesTotal}`
    );

    return scanResult;
  }

  // ─── Module Task Builder ─────────────────

  _buildModuleTasks(target, chain, modules, scanId) {
    const taskMap = {
      antivirus: () => this._runModuleWithTimeout(
        'antivirus',
        () => this.antivirus.scanContract(target, chain),
        scanId
      ),
      spam: () => this._runModuleWithTimeout(
        'spam',
        () => this.spam.analyzeContract(target, chain),
        scanId
      ),
      honeypot: () => this._runModuleWithTimeout(
        'honeypot',
        () => this.honeypot.checkHoneypot(target, chain),
        scanId
      ),
      tracer: () => this._runModuleWithTimeout(
        'tracer',
        () => this.tracer.deepScan(target, chain),
        scanId
      )
    };

    return modules.map(moduleName => taskMap[moduleName]());
  }

  /**
   * Run a module with timeout protection
   */
  async _runModuleWithTimeout(moduleName, fn, scanId) {
    const timeout = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Module "${moduleName}" timed out after ${this.config.timeoutPerModule}ms`)),
        this.config.timeoutPerModule
      )
    );

    try {
      const result = await Promise.race([fn(), timeout]);
      return { module: moduleName, status: 'success', data: result };
    } catch (error) {
      console.warn(`[DeepScanner:${scanId}] Module "${moduleName}" failed: ${error.message}`);
      return { module: moduleName, status: 'error', error: error.message };
    }
  }

  // ─── Result Processing ───────────────────

  _processModuleResults(settledResults, activeModules) {
    const results = {};
    const moduleMap = {};

    // Build lookup for active modules
    for (const moduleName of activeModules) {
      moduleMap[moduleName] = true;
    }

    for (const settled of settledResults) {
      if (settled.status === 'fulfilled') {
        const { module, status, data, error } = settled.value;
        
        if (status === 'success') {
          results[module] = data;
        } else {
          results[module] = { error: error || 'Unknown error', status: 'failed' };
        }
      } else {
        // Promise itself rejected (should not happen with our wrapper, but defensive)
        const reason = settled.reason?.message || 'Unknown rejection';
        results.unknown = { error: reason, status: 'rejected' };
      }
    }

    // Mark modules that weren't requested as 'skipped'
    for (const moduleName of VALID_MODULES) {
      if (!results[moduleName]) {
        results[moduleName] = { status: 'skipped', reason: 'Module not requested' };
      }
    }

    return results;
  }

  // ─── Summary Generation ──────────────────

  _generateSummary(results, activeModules) {
    const severityOrder = ['critical', 'high', 'medium', 'low', 'safe', 'error'];
    const riskScores = [];
    let totalIssues = 0;
    const recommendations = [];
    let modulesSucceeded = 0;
    let modulesFailed = 0;
    let modulesSkipped = 0;

    // ─── Process Antivirus ────────────────
    if (results.antivirus && !results.antivirus.error && results.antivirus.status !== 'skipped') {
      modulesSucceeded++;
      const vulns = results.antivirus.vulnerabilities || [];
      totalIssues += vulns.length;
      riskScores.push(results.antivirus.riskScore || 0);
      
      if (vulns.length > 0) {
        recommendations.push(`Fix ${vulns.length} detected vulnerability(s)`);
      }
    } else if (results.antivirus?.error) {
      modulesFailed++;
      recommendations.push('Antivirus scan failed — review manually');
    } else if (results.antivirus?.status === 'skipped') {
      modulesSkipped++;
    }

    // ─── Process Spam ─────────────────────
    if (results.spam && !results.spam.error && results.spam.status !== 'skipped') {
      modulesSucceeded++;
      if (results.spam.isSpam) {
        totalIssues += 1;
        riskScores.push(60); // Spam = high risk equivalent
        recommendations.push('Contract identified as potential spam');
      }
    } else if (results.spam?.error) {
      modulesFailed++;
    } else if (results.spam?.status === 'skipped') {
      modulesSkipped++;
    }

    // ─── Process Honeypot ─────────────────
    if (results.honeypot && !results.honeypot.error && results.honeypot.status !== 'skipped') {
      modulesSucceeded++;
      if (results.honeypot.isHoneypot) {
        totalIssues += 1;
        riskScores.push(100); // Honeypot = maximum risk
        recommendations.push('🚨 CRITICAL: Contract is a HONEYPOT — DO NOT INTERACT');
        
        if (results.honeypot.honeypotTypes?.length > 0) {
          recommendations.push(
            `Honeypot indicators: ${results.honeypot.honeypotTypes.join(', ')}`
          );
        }
      }
    } else if (results.honeypot?.error) {
      modulesFailed++;
    } else if (results.honeypot?.status === 'skipped') {
      modulesSkipped++;
    }

    // ─── Process Tracer ───────────────────
    if (results.tracer && !results.tracer.error && results.tracer.status !== 'skipped') {
      modulesSucceeded++;
      const riskFactors = results.tracer.riskFactors || [];
      totalIssues += riskFactors.length;
      
      if (riskFactors.length > 0) {
        riskScores.push(50); // Risk factors = medium risk equivalent
        recommendations.push(`${riskFactors.length} wallet risk factor(s) identified`);
      }
    } else if (results.tracer?.error) {
      modulesFailed++;
    } else if (results.tracer?.status === 'skipped') {
      modulesSkipped++;
    }

    // ─── Calculate Overall Risk ───────────
    let overallRisk = 'safe';
    
    if (modulesFailed === activeModules.length && activeModules.length > 0) {
      overallRisk = 'error';
    } else if (riskScores.length > 0) {
      const maxScore = Math.max(...riskScores);
      const avgScore = riskScores.reduce((a, b) => a + b, 0) / riskScores.length;
      
      // Weight: 70% max score + 30% average
      const weightedScore = (maxScore * 0.7) + (avgScore * 0.3);
      
      if (weightedScore >= 80) overallRisk = 'critical';
      else if (weightedScore >= 60) overallRisk = 'high';
      else if (weightedScore >= 30) overallRisk = 'medium';
      else if (weightedScore >= 10) overallRisk = 'low';
    }

    return {
      overallRisk,
      totalIssues,
      recommendations,
      modulesTotal: activeModules.length,
      modulesSucceeded,
      modulesFailed,
      modulesSkipped,
      riskBreakdown: {
        antivirusScore: results.antivirus?.riskScore || 0,
        spamDetected: results.spam?.isSpam || false,
        honeypotDetected: results.honeypot?.isHoneypot || false,
        tracerRisks: results.tracer?.riskFactors?.length || 0
      }
    };
  }

  // ─── Validation ──────────────────────────

  _validateInputs(target, chain) {
    if (!target || typeof target !== 'string' || target.trim().length === 0) {
      throw new Error('Target address is required and must be a non-empty string');
    }
    
    const normalizedChain = chain?.toLowerCase()?.trim();
    if (!VALID_CHAINS.includes(normalizedChain)) {
      throw new Error(
        `Invalid chain: "${chain}". Supported chains: ${VALID_CHAINS.join(', ')}`
      );
    }
  }

  _validateModules(modules) {
    if (!Array.isArray(modules) || modules.length === 0) {
      throw new Error('At least one module must be specified');
    }
    
    const normalized = modules.map(m => m.toLowerCase().trim());
    const invalidModules = normalized.filter(m => !VALID_MODULES.includes(m));
    
    if (invalidModules.length > 0) {
      throw new Error(
        `Invalid module(s): ${invalidModules.join(', ')}. ` +
        `Valid modules: ${VALID_MODULES.join(', ')}`
      );
    }
    
    return [...new Set(normalized)]; // Deduplicate
  }

  // ─── ID Generation ──────────────────────

  /**
   * Generate a cryptographically unique scan ID
   * Format: scan_<timestamp>_<random-hex>
   */
  _generateScanId() {
    const timestamp = Date.now().toString(36);
    const random = crypto.randomBytes(8).toString('hex');
    return `scan_${timestamp}_${random}`;
  }

  // ─── Public API ──────────────────────────

  /**
   * Get available modules and their status
   */
  getAvailableModules() {
    return {
      modules: VALID_MODULES,
      defaultModules: this.config.defaultModules,
      timeoutPerModule: this.config.timeoutPerModule
    };
  }

  /**
   * Run a single module scan (convenience method)
   */
  async scanWithModule(target, chain, module) {
    const validatedModule = this._validateModules([module])[0];
    return this.scan(target, chain, [validatedModule]);
  }
}

module.exports = DeepScanner;