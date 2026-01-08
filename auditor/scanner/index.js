/**
 * Deep Scanner Module
 * Orchestrates comprehensive multi-module scanning
 */

const AntivirusScanner = require('../antivirus');
const SpamDetector = require('../spam');
const HoneypotDetector = require('../honeypot');
const WalletTracer = require('../tracer');

class DeepScanner {
  constructor(config = {}) {
    this.config = config;
    
    // Initialize all scanner modules
    this.antivirus = new AntivirusScanner(config.antivirus || {});
    this.spam = new SpamDetector(config.spam || {});
    this.honeypot = new HoneypotDetector(config.honeypot || {});
    this.tracer = new WalletTracer(config.tracer || {});
  }

  /**
   * Perform comprehensive scan using specified modules
   * @param {string} target - Address or transaction hash
   * @param {string} chain - Blockchain network
   * @param {string[]} modules - Modules to use
   * @returns {Promise<Object>} Comprehensive scan results
   */
  async scan(target, chain, modules = ['antivirus', 'spam', 'honeypot', 'tracer']) {
    console.log(`[Deep Scanner] Starting comprehensive scan of ${target} on ${chain}...`);
    console.log(`[Deep Scanner] Active modules: ${modules.join(', ')}`);

    const scanId = this.generateScanId();
    const results = {
      antivirus: null,
      spam: null,
      honeypot: null,
      tracer: null
    };

    try {
      // Run scans in parallel
      const promises = [];

      if (modules.includes('antivirus')) {
        promises.push(
          this.antivirus.scanContract(target, chain)
            .then(result => { results.antivirus = result; })
            .catch(error => {
              console.error(`[Deep Scanner] Antivirus scan failed: ${error.message}`);
              results.antivirus = { error: error.message };
            })
        );
      }

      if (modules.includes('spam')) {
        promises.push(
          this.spam.analyzeContract(target, chain)
            .then(result => { results.spam = result; })
            .catch(error => {
              console.error(`[Deep Scanner] Spam detection failed: ${error.message}`);
              results.spam = { error: error.message };
            })
        );
      }

      if (modules.includes('honeypot')) {
        promises.push(
          this.honeypot.checkHoneypot(target, chain)
            .then(result => { results.honeypot = result; })
            .catch(error => {
              console.error(`[Deep Scanner] Honeypot detection failed: ${error.message}`);
              results.honeypot = { error: error.message };
            })
        );
      }

      if (modules.includes('tracer')) {
        promises.push(
          this.tracer.deepScan(target, chain)
            .then(result => { results.tracer = result; })
            .catch(error => {
              console.error(`[Deep Scanner] Wallet tracing failed: ${error.message}`);
              results.tracer = { error: error.message };
            })
        );
      }

      // Wait for all scans to complete
      await Promise.all(promises);

      // Generate summary
      const summary = this.generateSummary(results);

      return {
        target,
        chain,
        scanId,
        timestamp: Date.now(),
        results,
        summary
      };
    } catch (error) {
      console.error(`[Deep Scanner] Error during scan: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate summary from all scan results
   */
  generateSummary(results) {
    let overallRisk = 'safe';
    let totalIssues = 0;
    const recommendations = [];

    // Analyze antivirus results
    if (results.antivirus && !results.antivirus.error) {
      totalIssues += results.antivirus.vulnerabilities?.length || 0;
      
      if (results.antivirus.riskScore >= 80) {
        overallRisk = 'critical';
      } else if (results.antivirus.riskScore >= 60 && overallRisk !== 'critical') {
        overallRisk = 'high';
      } else if (results.antivirus.riskScore >= 40 && !['critical', 'high'].includes(overallRisk)) {
        overallRisk = 'medium';
      }

      if (results.antivirus.vulnerabilities?.length > 0) {
        recommendations.push('Address detected vulnerabilities immediately');
      }
    }

    // Analyze spam results
    if (results.spam && !results.spam.error) {
      if (results.spam.isSpam) {
        totalIssues += 1;
        if (overallRisk === 'safe') overallRisk = 'low';
        recommendations.push('Contract shows spam characteristics');
      }
    }

    // Analyze honeypot results
    if (results.honeypot && !results.honeypot.error) {
      if (results.honeypot.isHoneypot) {
        totalIssues += 1;
        overallRisk = 'critical';
        recommendations.push('WARNING: Contract is a honeypot - DO NOT INTERACT');
      }
    }

    // Analyze tracer results
    if (results.tracer && !results.tracer.error) {
      if (results.tracer.riskFactors?.length > 0) {
        totalIssues += results.tracer.riskFactors.length;
        if (overallRisk === 'safe') overallRisk = 'low';
        recommendations.push('Review wallet activity risk factors');
      }
    }

    return {
      overallRisk,
      issues: totalIssues,
      recommendations
    };
  }

  /**
   * Generate unique scan ID
   */
  generateScanId() {
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

module.exports = DeepScanner;
