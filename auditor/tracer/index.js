/**
 * Wallet Tracer Module
 * Production-hardened wallet transaction tracing and fund flow analysis
 * @version 1.0.0
 */

class WalletTracer {
  constructor(config = {}) {
    this.config = {
      maxDepth: config.maxDepth || 5,
      minAmount: config.minAmount || '0.01',
      includeTokens: config.includeTokens !== false,
      includeNFTs: config.includeNFTs || false,
      timeout: config.timeout || 120_000,
      maxTotalTransactions: config.maxTotalTransactions || 10_000,
      maxCounterparties: config.maxCounterparties || 1_000,
      concurrencyLimit: config.concurrencyLimit || 10,
      rpcProvider: config.rpcProvider || null
    };
  }

  // ─── Main Tracing Method ────────────────

  /**
   * Trace deposits to their origin wallets
   * @param {string} address - Wallet address
   * @param {string} chain - Blockchain network
   * @param {number} [depth] - Max recursion depth
   * @returns {Promise<Object>} Trace results
   */
  async traceDeposits(address, chain, depth = null) {
    this._validateInputs(address, chain);
    const maxDepth = Math.min(depth || this.config.maxDepth, 50);
    const startTime = Date.now();

    const deposits = [];
    const origins = new Map();
    const visited = new Set();
    const errors = [];
    let transactionCount = 0;

    try {
      await this._traceRecursive(
        address, chain, 0, maxDepth, deposits, origins, visited, errors,
        { transactionCount: 0, startTime }
      );
    } catch (error) {
      errors.push({ level: 'trace', error: error.message });
    }

    // Build origin summary
    const originSummary = Array.from(origins.entries())
      .sort((a, b) => b[1].totalAmount - a[1].totalAmount)
      .slice(0, 100) // Top 100 origins
      .map(([addr, data]) => ({
        address: addr,
        totalAmount: data.totalAmount.toString(),
        firstSeen: data.firstSeen,
        transactionCount: data.count
      }));

    // Build graph (with size limits)
    const graph = this._buildTransactionGraph(deposits.slice(0, 1000));

    const duration = Date.now() - startTime;

    return {
      address,
      chain,
      deposits: deposits.slice(0, 5000),
      depositCount: deposits.length,
      origins: originSummary,
      graph,
      depth: maxDepth,
      visitedWallets: visited.size,
      errors: errors.length > 0 ? errors : undefined,
      duration,
      timestamp: Date.now(),
      scanType: 'trace-deposits'
    };
  }

  // ─── Recursive Trace ────────────────────

  async _traceRecursive(address, chain, currentDepth, maxDepth, deposits, origins, visited, errors, state) {
    // Circuit breakers
    if (currentDepth >= maxDepth) return;
    if (visited.has(address)) return;
    if (deposits.length >= this.config.maxTotalTransactions) return;
    if (state.transactionCount >= this.config.maxTotalTransactions) return;
    if (Date.now() - state.startTime > this.config.timeout) {
      errors.push({ level: 'timeout', error: `Timeout at depth ${currentDepth}` });
      return;
    }

    visited.add(address);

    // Get incoming transactions with error handling
    let incomingTxs = [];
    try {
      incomingTxs = await this._getIncomingTransactions(address, chain);
    } catch (error) {
      errors.push({ level: currentDepth, address, error: error.message });
      return;
    }

    // Process transactions (with concurrency limit)
    const minAmount = parseFloat(this.config.minAmount) || 0;
    const batchSize = Math.min(this.config.concurrencyLimit, incomingTxs.length);

    for (let i = 0; i < incomingTxs.length; i += batchSize) {
      if (deposits.length >= this.config.maxTotalTransactions) break;

      const batch = incomingTxs.slice(i, i + batchSize);
      const tasks = [];

      for (const tx of batch) {
        const txValue = parseFloat(tx.value || '0');
        if (isNaN(txValue) || txValue < minAmount) continue;

        state.transactionCount++;
        deposits.push({
          from: tx.from,
          to: address,
          amount: tx.value,
          token: tx.token || 'native',
          timestamp: tx.timestamp,
          txHash: tx.hash,
          depth: currentDepth
        });

        // Track origin
        if (!origins.has(tx.from)) {
          origins.set(tx.from, { totalAmount: 0, firstSeen: tx.timestamp, count: 0 });
        }
        const originData = origins.get(tx.from);
        originData.totalAmount += txValue;
        originData.count += 1;

        // Schedule deeper trace
        tasks.push(
          this._traceRecursive(tx.from, chain, currentDepth + 1, maxDepth, deposits, origins, visited, errors, state)
            .catch(err => errors.push({ level: currentDepth + 1, from: tx.from, error: err.message }))
        );
      }

      // Execute batch concurrently (with limit)
      await Promise.all(tasks);
    }
  }

  // ─── Deep Scan ──────────────────────────

  /**
   * Perform deep analysis of wallet activity
   * @param {string} address - Wallet address
   * @param {string} chain - Blockchain network
   * @param {Object} [options] - Scan options
   * @returns {Promise<Object>} Deep scan results
   */
  async deepScan(address, chain, options = {}) {
    this._validateInputs(address, chain);

    const includeTokens = options.includeTokens !== false;
    const includeNFTs = options.includeNFTs || false;
    const timeRange = options.timeRange || { start: 0, end: Date.now() };
    const startTime = Date.now();

    let allTxs = [];
    let tokens = [];
    let nfts = [];
    const errors = [];

    // Fetch transactions
    try {
      allTxs = await this._getAllTransactions(address, chain, timeRange);
      if (allTxs.length > this.config.maxTotalTransactions) {
        allTxs = allTxs.slice(0, this.config.maxTotalTransactions);
      }
    } catch (error) {
      errors.push({ source: 'transactions', error: error.message });
      allTxs = [];
    }

    // Analyze transactions
    const analysis = this._analyzeTransactions(address, allTxs);

    // Get token holdings (graceful degradation)
    if (includeTokens) {
      try {
        tokens = await this._getTokenHoldings(address, chain);
      } catch (error) {
        errors.push({ source: 'tokens', error: error.message });
      }
    }

    // Get NFT holdings (graceful degradation)
    if (includeNFTs) {
      try {
        nfts = await this._getNFTHoldings(address, chain);
      } catch (error) {
        errors.push({ source: 'nfts', error: error.message });
      }
    }

    // Identify risk factors
    const riskFactors = this._identifyRiskFactors(analysis, allTxs);

    const duration = Date.now() - startTime;

    return {
      address,
      chain,
      ...analysis,
      tokens,
      nfts,
      riskFactors,
      errors: errors.length > 0 ? errors : undefined,
      duration,
      timestamp: Date.now(),
      scanType: 'deep-scan'
    };
  }

  /**
   * Analyze transactions for patterns
   */
  _analyzeTransactions(address, transactions) {
    if (transactions.length === 0) {
      return {
        totalTransactions: 0,
        totalVolume: '0',
        firstActivity: null,
        lastActivity: null,
        counterparties: [],
        counterpartyCount: 0
      };
    }

    const counterparties = new Set();
    let totalVolume = 0;
    let firstActivity = transactions[0].timestamp;
    let lastActivity = transactions[0].timestamp;

    for (const tx of transactions) {
      const txValue = parseFloat(tx.value || '0');
      if (!isNaN(txValue)) {
        totalVolume += txValue;
      }

      if (tx.timestamp) {
        if (tx.timestamp < firstActivity) firstActivity = tx.timestamp;
        if (tx.timestamp > lastActivity) lastActivity = tx.timestamp;
      }

      if (tx.from && tx.from !== address) counterparties.add(tx.from);
      if (tx.to && tx.to !== address) counterparties.add(tx.to);

      // Stop tracking if too many counterparties
      if (counterparties.size >= this.config.maxCounterparties) break;
    }

    return {
      totalTransactions: transactions.length,
      totalVolume: totalVolume.toString(),
      firstActivity,
      lastActivity,
      counterparties: Array.from(counterparties).slice(0, this.config.maxCounterparties),
      counterpartyCount: counterparties.size
    };
  }

  // ─── Transaction Graph ──────────────────

  _buildTransactionGraph(deposits) {
    const nodes = new Set();
    const edges = [];
    const MAX_GRAPH_NODES = 500;
    const MAX_GRAPH_EDGES = 1000;

    for (const deposit of deposits) {
      if (nodes.size >= MAX_GRAPH_NODES) break;
      if (edges.length >= MAX_GRAPH_EDGES) break;

      nodes.add(deposit.from);
      nodes.add(deposit.to);
      edges.push({
        from: deposit.from,
        to: deposit.to,
        amount: deposit.amount,
        depth: deposit.depth
      });
    }

    return {
      nodeCount: nodes.size,
      edgeCount: edges.length,
      nodes: Array.from(nodes).slice(0, MAX_GRAPH_NODES),
      edges: edges.slice(0, MAX_GRAPH_EDGES),
      truncated: deposits.length > MAX_GRAPH_EDGES
    };
  }

  // ─── Risk Factor Identification ─────────

  _identifyRiskFactors(analysis, transactions) {
    const riskFactors = [];

    // Skip if no transaction data
    if (transactions.length === 0) {
      return riskFactors;
    }

    // High frequency trading (>1000 tx in 24 hours)
    if (analysis.firstActivity && analysis.lastActivity) {
      const timeWindow = analysis.lastActivity - analysis.firstActivity;
      if (transactions.length > 1000 && timeWindow > 0 && timeWindow < 86_400_000) {
        riskFactors.push({
          type: 'high-frequency',
          description: `High frequency trading: ${transactions.length} transactions in ${(timeWindow / 3600000).toFixed(1)} hours`,
          severity: 'medium'
        });
      }
    }

    // Many counterparties (mixer/tumbler indicator)
    if (analysis.counterpartyCount > 100) {
      riskFactors.push({
        type: 'many-counterparties',
        description: `${analysis.counterpartyCount} unique counterparties — possible mixer/tumbler usage`,
        severity: 'medium'
      });
    }

    // New wallet with high volume
    if (analysis.firstActivity) {
      const walletAge = Date.now() - analysis.firstActivity;
      const volume = parseFloat(analysis.totalVolume || '0');
      if (walletAge < 86_400_000 && volume > 100) {
        riskFactors.push({
          type: 'new-wallet-high-volume',
          description: `New wallet (<24h) with high volume (${volume.toFixed(2)})`,
          severity: 'high'
        });
      }
    }

    // Zero transaction activity
    if (transactions.length === 0) {
      riskFactors.push({
        type: 'no-activity',
        description: 'No transaction activity found',
        severity: 'low'
      });
    }

    return riskFactors;
  }

  // ─── Data Methods (Stubs with Graceful Degradation) ─

  async _getIncomingTransactions(address, chain) {
    if (!this.config.rpcProvider) return [];
    // Stub: Return empty array until RPC integration is implemented
    return [];
  }

  async _getAllTransactions(address, chain, timeRange) {
    if (!this.config.rpcProvider) return [];
    return [];
  }

  async _getTokenHoldings(address, chain) {
    if (!this.config.rpcProvider) return [];
    return [];
  }

  async _getNFTHoldings(address, chain) {
    if (!this.config.rpcProvider) return [];
    return [];
  }

  // ─── Validation ──────────────────────────

  _validateInputs(address, chain) {
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      throw new Error('Wallet address is required');
    }
    const validChains = ['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'solana'];
    if (!validChains.includes(chain?.toLowerCase())) {
      throw new Error(`Invalid chain: ${chain}`);
    }
  }

  // ─── Public API ──────────────────────────

  getConfig() {
    return { ...this.config };
  }
}

module.exports = WalletTracer;