/**
 * SmartContractAudit — Main Auditor Module
 * Production-hardened orchestrator for all auditing functionality
 * @version 1.0.0
 */

const AntivirusScanner = require('./antivirus');
const SpamDetector = require('./spam');
const HoneypotDetector = require('./honeypot');
const WalletTracer = require('./tracer');
const DeepScanner = require('./scanner');

// ─── Constants ───────────────────────────────────
const VALID_MODULES = ['antivirus', 'spam', 'honeypot', 'tracer'];
const VALID_CHAINS = [
  'ethereum', 'bsc', 'polygon', 'avalanche',
  'arbitrum', 'optimism', 'solana'
];

const DEFAULT_SCAN_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const MAX_TRACE_DEPTH = 50;
const MIN_TRACE_DEPTH = 1;

// ─── Validation Utilities ────────────────────────

function validateAddress(address) {
  if (!address || typeof address !== 'string') {
    throw new Error('Address must be a non-empty string');
  }
  
  const trimmed = address.trim();
  
  // Ethereum-style
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) return trimmed.toLowerCase();
  
  // Solana-style
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(trimmed)) return trimmed;
  
  throw new Error(`Invalid address format: "${trimmed}"`);
}

function validateChain(chain) {
  if (!chain || typeof chain !== 'string') {
    throw new Error('Chain must be a non-empty string');
  }
  
  const normalized = chain.toLowerCase().trim();
  if (!VALID_CHAINS.includes(normalized)) {
    throw new Error(`Invalid chain: "${chain}". Allowed: ${VALID_CHAINS.join(', ')}`);
  }
  return normalized;
}

function validateModule(module) {
  if (!VALID_MODULES.includes(module)) {
    throw new Error(`Invalid module: "${module}". Allowed: ${VALID_MODULES.join(', ')}`);
  }
  return module;
}

function validateDepth(depth) {
  const parsed = parseInt(depth, 10);
  if (isNaN(parsed) || parsed < MIN_TRACE_DEPTH || parsed > MAX_TRACE_DEPTH) {
    throw new Error(`Depth must be between ${MIN_TRACE_DEPTH} and ${MAX_TRACE_DEPTH}`);
  }
  return parsed;
}

// ─── Logger ──────────────────────────────────────

class AuditorLogger {
  constructor(config = {}) {
    this.silent = config.silent || false;
    this.logLevel = config.logLevel || 'info';
  }
  
  _log(level, message, data = {}) {
    if (this.silent) return;
    
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    if (levels[level] < levels[this.logLevel]) return;
    
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      component: 'auditor',
      message,
      ...data
    };
    
    const fn = level === 'error' ? console.error : 
               level === 'warn' ? console.warn : console.log;
    
    fn(`[${entry.timestamp}] [${level.toUpperCase()}] ${message}`);
  }
  
  info(msg, data) { this._log('info', msg, data); }
  warn(msg, data) { this._log('warn', msg, data); }
  error(msg, data) { this._log('error', msg, data); }
  debug(msg, data) { this._log('debug', msg, data); }
}

// ─── Auditor Class ───────────────────────────────

class Auditor {
  constructor(config = {}) {
    this.config = this._validateConfig(config);
    this.logger = new AuditorLogger(config.logging || {});
    
    // Module registry with metadata
    this._modules = new Map();
    this._initializeModules();
    
    // Concurrency lock for config updates
    this._configLock = false;
    this._pendingConfig = null;
  }
  
  /**
   * Validate and normalize configuration
   */
  _validateConfig(config) {
    const defaults = {
      scanTimeout: DEFAULT_SCAN_TIMEOUT,
      retryAttempts: 3,
      retryDelay: 1000,
      logging: { logLevel: 'info', silent: false },
      antivirus: {},
      spam: {},
      honeypot: {},
      tracer: {},
      scanner: {}
    };
    
    const merged = { ...defaults, ...config };
    
    if (merged.scanTimeout < 1000 || merged.scanTimeout > 600000) {
      throw new Error('scanTimeout must be between 1000ms and 600000ms');
    }
    if (merged.retryAttempts < 0 || merged.retryAttempts > 10) {
      throw new Error('retryAttempts must be between 0 and 10');
    }
    
    return merged;
  }
  
  /**
   * Initialize all detection modules
   */
  _initializeModules() {
    try {
      this._modules.set('antivirus', {
        instance: new AntivirusScanner(this.config.antivirus),
        version: '1.0.0',
        status: 'active'
      });
      
      this._modules.set('spam', {
        instance: new SpamDetector(this.config.spam),
        version: '1.0.0',
        status: 'active'
      });
      
      this._modules.set('honeypot', {
        instance: new HoneypotDetector(this.config.honeypot),
        version: '1.0.0',
        status: 'active'
      });
      
      this._modules.set('tracer', {
        instance: new WalletTracer(this.config.tracer),
        version: '1.0.0',
        status: 'active'
      });
    } catch (error) {
      this.logger.error('Failed to initialize modules', { error: error.message });
      throw new Error(`Auditor initialization failed: ${error.message}`);
    }
    
    // Deep scanner is initialized separately (depends on all modules)
    this._deepScanner = new DeepScanner(this.config);
    
    this.logger.info('All modules initialized', {
      modules: Array.from(this._modules.keys())
    });
  }
  
  /**
   * Get a module instance with validation
   */
  _getModule(moduleName) {
    validateModule(moduleName);
    
    const module = this._modules.get(moduleName);
    if (!module || module.status !== 'active') {
      throw new Error(`Module "${moduleName}" is not available`);
    }
    
    return module.instance;
  }
  
  /**
   * Execute with timeout protection
   */
  async _withTimeout(promise, timeoutMs) {
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Scan timed out')), timeoutMs)
    );
    
    return Promise.race([promise, timeout]);
  }
  
  /**
   * Execute with retry logic
   */
  async _withRetry(fn, attempts = this.config.retryAttempts) {
    let lastError;
    
    for (let i = 0; i <= attempts; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        this.logger.warn(`Attempt ${i + 1}/${attempts + 1} failed`, {
          error: error.message
        });
        
        if (i < attempts) {
          await new Promise(r => setTimeout(r, this.config.retryDelay * (i + 1)));
        }
      }
    }
    
    throw lastError;
  }
  
  // ─── Public API ───────────────────────────
  
  /**
   * Quick scan using a specific module
   * @param {string} target - Contract/wallet address
   * @param {string} chain - Blockchain network
   * @param {string} module - Module to use
   * @returns {Promise<Object>} Scan result
   */
  async quickScan(target, chain, module = 'antivirus') {
    const validatedAddress = validateAddress(target);
    const validatedChain = validateChain(chain);
    validateModule(module);
    
    this.logger.info('Starting quick scan', {
      target: validatedAddress,
      chain: validatedChain,
      module
    });
    
    const startTime = Date.now();
    
    try {
      const moduleInstance = this._getModule(module);
      
      let result;
      switch (module) {
        case 'antivirus':
          result = await this._withTimeout(
            moduleInstance.scanContract(validatedAddress, validatedChain),
            this.config.scanTimeout
          );
          break;
        case 'spam':
          result = await this._withTimeout(
            moduleInstance.analyzeContract(validatedAddress, validatedChain),
            this.config.scanTimeout
          );
          break;
        case 'honeypot':
          result = await this._withTimeout(
            moduleInstance.checkHoneypot(validatedAddress, validatedChain),
            this.config.scanTimeout
          );
          break;
        case 'tracer':
          result = await this._withTimeout(
            moduleInstance.traceDeposits(validatedAddress, validatedChain),
            this.config.scanTimeout
          );
          break;
        default:
          throw new Error(`Unknown module: ${module}`);
      }
      
      const duration = Date.now() - startTime;
      
      this.logger.info('Quick scan completed', {
        target: validatedAddress,
        module,
        duration: `${duration}ms`
      });
      
      return {
        ...result,
        meta: {
          target: validatedAddress,
          chain: validatedChain,
          module,
          duration,
          timestamp: Date.now()
        }
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error('Quick scan failed', {
        target: validatedAddress,
        module,
        duration: `${duration}ms`,
        error: error.message
      });
      
      return {
        target: validatedAddress,
        chain: validatedChain,
        module,
        error: error.message,
        duration,
        timestamp: Date.now()
      };
    }
  }
  
  /**
   * Comprehensive scan using all modules
   * @param {string} target - Contract/wallet address
   * @param {string} chain - Blockchain network
   * @returns {Promise<Object>} Full scan result
   */
  async fullScan(target, chain) {
    const validatedAddress = validateAddress(target);
    const validatedChain = validateChain(chain);
    
    this.logger.info('Starting full scan', {
      target: validatedAddress,
      chain: validatedChain
    });
    
    const startTime = Date.now();
    
    try {
      const result = await this._withTimeout(
        this._deepScanner.scan(validatedAddress, validatedChain),
        this.config.scanTimeout * 2 // Double timeout for full scan
      );
      
      const duration = Date.now() - startTime;
      
      this.logger.info('Full scan completed', {
        target: validatedAddress,
        duration: `${duration}ms`,
        risk: result.summary?.overallRisk || 'unknown'
      });
      
      return {
        ...result,
        meta: {
          target: validatedAddress,
          chain: validatedChain,
          duration,
          timestamp: Date.now()
        }
      };
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.logger.error('Full scan failed', {
        target: validatedAddress,
        duration: `${duration}ms`,
        error: error.message
      });
      
      return {
        target: validatedAddress,
        chain: validatedChain,
        error: error.message,
        duration,
        timestamp: Date.now()
      };
    }
  }
  
  /**
   * Scan contract for vulnerabilities
   */
  async scanContract(address, chain) {
    return this.quickScan(address, chain, 'antivirus');
  }
  
  /**
   * Check if contract is spam
   */
  async checkSpam(address, chain) {
    return this.quickScan(address, chain, 'spam');
  }
  
  /**
   * Check if contract is a honeypot
   */
  async checkHoneypot(address, chain) {
    return this.quickScan(address, chain, 'honeypot');
  }
  
  /**
   * Trace wallet deposits
   * @param {string} address - Wallet address
   * @param {string} chain - Blockchain network
   * @param {number} depth - Trace depth
   */
  async traceWallet(address, chain, depth = 5) {
    const validatedAddress = validateAddress(address);
    const validatedChain = validateChain(chain);
    const validatedDepth = validateDepth(depth);
    
    return this._withRetry(async () => {
      const tracer = this._getModule('tracer');
      return tracer.traceDeposits(validatedAddress, validatedChain, validatedDepth);
    });
  }
  
  /**
   * Deep scan wallet activity
   */
  async deepScanWallet(address, chain, options = {}) {
    const validatedAddress = validateAddress(address);
    const validatedChain = validateChain(chain);
    
    return this._withRetry(async () => {
      const tracer = this._getModule('tracer');
      return tracer.deepScan(validatedAddress, validatedChain, options);
    });
  }
  
  // ─── Configuration Management ──────────────
  
  /**
   * Get current configuration
   */
  getConfig() {
    return { ...this.config };
  }
  
  /**
   * Get module statuses
   */
  getModuleStatus() {
    const status = {};
    for (const [name, module] of this._modules) {
      status[name] = {
        version: module.version,
        status: module.status
      };
    }
    return status;
  }
  
  /**
   * Update configuration with concurrency safety
   * @param {Object} newConfig - Partial configuration to merge
   */
  async updateConfig(newConfig) {
    if (!newConfig || typeof newConfig !== 'object') {
      throw new Error('Invalid configuration object');
    }
    
    // Queue config update if a scan is in progress
    if (this._configLock) {
      this._pendingConfig = { ...this._pendingConfig, ...newConfig };
      this.logger.info('Configuration update queued (scan in progress)');
      return;
    }
    
    this._configLock = true;
    
    try {
      const validated = this._validateConfig({ ...this.config, ...newConfig });
      this.config = validated;
      
      // Reinitialize changed modules
      for (const moduleName of Object.keys(newConfig)) {
        if (this._modules.has(moduleName)) {
          const ModuleClass = this._getModuleClass(moduleName);
          this._modules.set(moduleName, {
            instance: new ModuleClass(this.config[moduleName]),
            version: '1.0.0',
            status: 'active'
          });
          this.logger.info(`Module reinitialized: ${moduleName}`);
        }
      }
      
      this.logger.info('Configuration updated successfully');
      
    } finally {
      this._configLock = false;
      
      // Process pending config if any
      if (this._pendingConfig) {
        const pending = this._pendingConfig;
        this._pendingConfig = null;
        await this.updateConfig(pending);
      }
    }
  }
  
  /**
   * Get module constructor by name
   */
  _getModuleClass(moduleName) {
    const classes = {
      antivirus: AntivirusScanner,
      spam: SpamDetector,
      honeypot: HoneypotDetector,
      tracer: WalletTracer
    };
    return classes[moduleName];
  }
}

// ─── Exports ─────────────────────────────────────

module.exports = Auditor;
module.exports.AntivirusScanner = AntivirusScanner;
module.exports.SpamDetector = SpamDetector;
module.exports.HoneypotDetector = HoneypotDetector;
module.exports.WalletTracer = WalletTracer;
module.exports.DeepScanner = DeepScanner;
module.exports.VALID_MODULES = VALID_MODULES;
module.exports.VALID_CHAINS = VALID_CHAINS;