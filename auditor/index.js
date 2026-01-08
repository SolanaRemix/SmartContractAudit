/**
 * Main Auditor Module
 * Orchestrates all auditing functionality
 */

const AntivirusScanner = require('./antivirus');
const SpamDetector = require('./spam');
const HoneypotDetector = require('./honeypot');
const WalletTracer = require('./tracer');
const DeepScanner = require('./scanner');

class Auditor {
  constructor(config = {}) {
    this.config = config;
    
    // Initialize all modules
    this.antivirus = new AntivirusScanner(config.antivirus || {});
    this.spam = new SpamDetector(config.spam || {});
    this.honeypot = new HoneypotDetector(config.honeypot || {});
    this.tracer = new WalletTracer(config.tracer || {});
    this.deepScanner = new DeepScanner(config);
  }

  /**
   * Quick scan using specified module
   */
  async quickScan(target, chain, module = 'antivirus') {
    console.log(`[Auditor] Quick scan: ${module} on ${target}`);

    switch (module) {
      case 'antivirus':
        return await this.antivirus.scanContract(target, chain);
      case 'spam':
        return await this.spam.analyzeContract(target, chain);
      case 'honeypot':
        return await this.honeypot.checkHoneypot(target, chain);
      case 'tracer':
        return await this.tracer.traceDeposits(target, chain);
      default:
        throw new Error(`Unknown module: ${module}`);
    }
  }

  /**
   * Comprehensive scan using all modules
   */
  async fullScan(target, chain) {
    console.log(`[Auditor] Full scan on ${target}`);
    return await this.deepScanner.scan(target, chain);
  }

  /**
   * Scan contract for vulnerabilities
   */
  async scanContract(address, chain) {
    return await this.antivirus.scanContract(address, chain);
  }

  /**
   * Check if contract is spam
   */
  async checkSpam(address, chain) {
    return await this.spam.analyzeContract(address, chain);
  }

  /**
   * Check if contract is honeypot
   */
  async checkHoneypot(address, chain) {
    return await this.honeypot.checkHoneypot(address, chain);
  }

  /**
   * Trace wallet deposits
   */
  async traceWallet(address, chain, depth) {
    return await this.tracer.traceDeposits(address, chain, depth);
  }

  /**
   * Deep scan wallet activity
   */
  async deepScanWallet(address, chain, options) {
    return await this.tracer.deepScan(address, chain, options);
  }

  /**
   * Get module configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Update module configuration
   */
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Reinitialize modules with new config
    if (newConfig.antivirus) {
      this.antivirus = new AntivirusScanner(this.config.antivirus);
    }
    if (newConfig.spam) {
      this.spam = new SpamDetector(this.config.spam);
    }
    if (newConfig.honeypot) {
      this.honeypot = new HoneypotDetector(this.config.honeypot);
    }
    if (newConfig.tracer) {
      this.tracer = new WalletTracer(this.config.tracer);
    }
  }
}

// Export the main Auditor class and individual modules
module.exports = Auditor;
module.exports.AntivirusScanner = AntivirusScanner;
module.exports.SpamDetector = SpamDetector;
module.exports.HoneypotDetector = HoneypotDetector;
module.exports.WalletTracer = WalletTracer;
module.exports.DeepScanner = DeepScanner;
