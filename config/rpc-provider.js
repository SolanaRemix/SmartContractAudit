/**
 * RPC Provider with Dynamic Failover
 * Tries primary RPC first, then cycles through fallbacks on failure.
 * All public fallbacks are rate-limited public endpoints — no keys required.
 */

const { ethers } = require('ethers');
const chains = require('./chains.json');

const REQUEST_TIMEOUT = 10_000; // 10 seconds per attempt
const CACHE_TTL = 60_000;       // 1 minute cache for healthy provider

class FailoverProvider {
  constructor() {
    this.providers = new Map();  // chain -> current provider
    this.healthCache = new Map(); // chain -> { provider, timestamp }
    this.failureCounts = new Map(); // chain -> { url: failureCount }
  }

  /**
   * Get a working provider for the given chain with automatic failover.
   * @param {string} chain - Chain name (ethereum, bsc, polygon, etc.)
   * @returns {ethers.providers.JsonRpcProvider}
   */
  async getProvider(chain) {
    const chainConfig = chains[chain];
    if (!chainConfig) throw new Error(`Unknown chain: ${chain}`);

    // Check cache first
    const cached = this.healthCache.get(chain);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      try {
        await cached.provider.getBlockNumber();
        return cached.provider;
      } catch {
        this.healthCache.delete(chain);
      }
    }

    // Build URL list: primary first, then fallbacks
    const urls = [];
    const primary = this._resolveEnvVar(chainConfig.rpc.primary);
    if (primary && !primary.includes('YOUR_') && !primary.includes('${')) {
      urls.push(primary);
    }
    urls.push(...(chainConfig.rpc.fallbacks || []));

    if (urls.length === 0) {
      throw new Error(`No RPC URLs configured for ${chain}`);
    }

    // Try each URL in order
    const failures = this.failureCounts.get(chain) || new Map();
    
    for (const url of urls) {
      const failCount = failures.get(url) || 0;
      if (failCount >= 3) continue; // Skip consistently failing URLs

      try {
        const provider = new ethers.providers.JsonRpcProvider({
          url,
          timeout: REQUEST_TIMEOUT,
        });

        await provider.getBlockNumber();

        // Success — cache and return
        this.healthCache.set(chain, { provider, timestamp: Date.now() });
        failures.set(url, 0);
        this.failureCounts.set(chain, failures);
        
        console.log(`[RPC] Connected to ${chain}: ${url.substring(0, 40)}...`);
        return provider;
      } catch (error) {
        failures.set(url, failCount + 1);
        this.failureCounts.set(chain, failures);
        console.warn(`[RPC] Failed ${chain}: ${url.substring(0, 40)}... (attempt ${failCount + 1}/3)`);
      }
    }

    throw new Error(`All RPC endpoints exhausted for ${chain}`);
  }

  /**
   * Resolve ${ENV_VAR} references in config values.
   */
  _resolveEnvVar(value) {
    if (!value || typeof value !== 'string') return value;
    const match = value.match(/^\$\{(.+)\}$/);
    if (match) {
      return process.env[match[1]] || null;
    }
    return value;
  }

  /**
   * Reset failure counts for a chain (e.g., after a successful recovery).
   */
  resetFailures(chain) {
    this.failureCounts.delete(chain);
    this.healthCache.delete(chain);
  }

  /**
   * Get chain health status.
   */
  getHealth() {
    const status = {};
    for (const [chain, config] of Object.entries(chains)) {
      const cached = this.healthCache.get(chain);
      const failures = this.failureCounts.get(chain);
      status[chain] = {
        healthy: !!cached,
        activeUrl: cached ? 'connected' : 'none',
        failures: failures ? Object.fromEntries(failures) : {}
      };
    }
    return status;
  }
}

module.exports = new FailoverProvider();