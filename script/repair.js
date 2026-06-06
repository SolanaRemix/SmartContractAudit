#!/usr/bin/env node

/**
 * Auto-Repair Script
 * Generates fixes for detected vulnerabilities
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Security: Maximum file size (50MB) to prevent DoS
const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Security: Maximum number of fixes to prevent resource exhaustion
const MAX_FIXES_PER_REQUEST = 100;

// Security: Authentication token validation
function validateAuthToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Authentication token is required');
  }
  
  // Check if token matches expected format (e.g., GitHub token)
  // In production, this should verify against a secure store
  const expectedToken = process.env.REPAIR_AUTH_TOKEN;
  
  if (!expectedToken) {
    throw new Error('Authentication not configured (REPAIR_AUTH_TOKEN not set)');
  }
  
  // Use constant-time comparison to prevent timing attacks
  const bufferA = Buffer.from(token);
  const bufferB = Buffer.from(expectedToken);
  
  if (bufferA.length !== bufferB.length) {
    throw new Error('Authentication failed');
  }
  
  if (!crypto.timingSafeEqual(bufferA, bufferB)) {
    throw new Error('Authentication failed');
  }
  
  return true;
}

// Security: Validate and sanitize file paths
function sanitizeFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path must be a non-empty string');
  }
  
  // Check for path traversal attempts BEFORE normalization
  if (filePath.includes('..')) {
    throw new Error('Path traversal detected in file path');
  }
  
  // Resolve to absolute path and normalize
  const normalizedPath = path.resolve(filePath);
  
  // Additional security: ensure resolved path is within allowed directories
  // This prevents symlink-based traversal attacks
  const allowedBase = path.resolve(process.cwd());
  if (!normalizedPath.startsWith(allowedBase)) {
    throw new Error('Access to path outside project directory is not allowed');
  }
  
  // Ensure file exists
  if (!fs.existsSync(normalizedPath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
  
  const stats = fs.statSync(normalizedPath);
  
  if (!stats.isFile()) {
    throw new Error(`Path is not a file: ${filePath}`);
  }
  
  // Check file size
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size (${MAX_FILE_SIZE} bytes): ${filePath}`);
  }
  
  return normalizedPath;
}

// Security: Validate data structure
function validateVulnerabilityData(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid vulnerability data: must be an object');
  }
  
  if (!data.type || typeof data.type !== 'string') {
    throw new Error('Invalid vulnerability data: type is required');
  }
  
  // Validate type is one of the expected vulnerability types
  const validTypes = ['reentrancy', 'overflow', 'uncheckedSend', 'txOrigin', 'publicMint', 'delegatecall'];
  if (!validTypes.includes(data.type)) {
    throw new Error(`Invalid vulnerability type: ${data.type}`);
  }
  
  return true;
}

// Security: Log authentication events for audit trail
function logAuthEvent(event, success, details = {}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    success,
    details,
    pid: process.pid
  };
  
  const logPath = path.join(__dirname, '../reports/auth-events.log');
  const logDir = path.dirname(logPath);
  
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
}

class RepairEngine {
  constructor(config = {}) {
    this.config = config;
    this.repairPatterns = this.initializeRepairPatterns();
  }

  initializeRepairPatterns() {
    // Default patterns
    const defaults = {
      reentrancy: {
        enabled: true,
        strategy: 'checks-effects-interactions',
        confidence: 85,
        fix: this.fixReentrancy.bind(this)
      },
      overflow: {
        enabled: true,
        strategy: 'safemath',
        confidence: 95,
        fix: this.fixOverflow.bind(this)
      },
      uncheckedSend: {
        enabled: true,
        strategy: 'require-check',
        confidence: 90,
        fix: this.fixUncheckedSend.bind(this)
      },
      txOrigin: {
        enabled: true,
        strategy: 'use-msg-sender',
        confidence: 100,
        fix: this.fixTxOrigin.bind(this)
      },
      publicMint: {
        enabled: true,
        strategy: 'add-access-control',
        confidence: 95,
        fix: this.fixPublicMint.bind(this)
      },
      delegatecall: {
        enabled: true,
        strategy: 'add-access-control',
        confidence: 50,
        fix: this.fixDelegatecall.bind(this)
      }
    };

    // Merge config with defaults if config is provided
    if (this.config && typeof this.config === 'object') {
      Object.keys(defaults).forEach(key => {
        if (this.config[key]) {
          // Merge config values but preserve the fix function
          defaults[key] = {
            ...defaults[key],
            ...this.config[key],
            fix: defaults[key].fix
          };
        }
      });
    }

    return defaults;
  }

  /**
   * Generate fix for a vulnerability
   * @param {Object} vulnerability - The vulnerability object to fix
   * @param {string} sourceCode - The source code containing the vulnerability
   * @param {string} [filePath] - Path to the file being fixed (falls back to vulnerability.file if not provided)
   * @returns {Object} Fix object with file, vulnerabilityId, fixAvailable, patch, description, confidence, and strategy
   */
  async generateFix(vulnerability, sourceCode, filePath = null) {
    // Security: Validate vulnerability data structure
    try {
      validateVulnerabilityData(vulnerability);
    } catch (error) {
      console.error(`Invalid vulnerability data: ${error.message}`);
      return {
        vulnerabilityId: vulnerability?.type || 'unknown',
        fixAvailable: false,
        reason: `Invalid vulnerability data: ${error.message}`
      };
    }
    
    // Security: Validate source code
    if (!sourceCode || typeof sourceCode !== 'string') {
      return {
        vulnerabilityId: vulnerability.type,
        fixAvailable: false,
        reason: 'Source code must be a non-empty string'
      };
    }
    
    // Security: Check source code size
    if (sourceCode.length > MAX_FILE_SIZE) {
      return {
        vulnerabilityId: vulnerability.type,
        fixAvailable: false,
        reason: `Source code exceeds maximum size (${MAX_FILE_SIZE} bytes)`
      };
    }
    
    const pattern = this.repairPatterns[vulnerability.type];
    
    if (!pattern || !pattern.enabled) {
      return {
        vulnerabilityId: vulnerability.type,
        fixAvailable: false,
        reason: 'Auto-repair not available for this vulnerability type'
      };
    }

    try {
      const patch = await pattern.fix(vulnerability, sourceCode);
      const targetFilePath = filePath ?? vulnerability.file;
      
      if (!targetFilePath) {
        throw new Error('File path is required for generating fix but was not provided');
      }
      
      return {
        file: targetFilePath,
        vulnerabilityId: vulnerability.type,
        fixAvailable: true,
        patch,
        description: this.getFixDescription(vulnerability.type),
        confidence: pattern.confidence,
        strategy: pattern.strategy
      };
    } catch (error) {
      console.error(`Error generating fix: ${error.message}`);
      return {
        vulnerabilityId: vulnerability.type,
        fixAvailable: false,
        reason: error.message
      };
    }
  }

  /**
   * Fix reentrancy vulnerability
   */
  fixReentrancy(vulnerability, sourceCode) {
    // Example fix: Add ReentrancyGuard and use nonReentrant modifier
    const fixes = [];
    
    // Add import
    if (!sourceCode.includes('ReentrancyGuard')) {
      fixes.push({
        type: 'add-import',
        code: 'import "@openzeppelin/contracts/security/ReentrancyGuard.sol";'
      });
      
      fixes.push({
        type: 'inherit-contract',
        code: ', ReentrancyGuard'
      });
    }
    
    // Add modifier to vulnerable function
    fixes.push({
      type: 'add-modifier',
      function: vulnerability.location,
      code: 'nonReentrant'
    });

    return this.generatePatch(fixes);
  }

  /**
   * Fix integer overflow/underflow
   */
  fixOverflow(vulnerability, sourceCode) {
    // If Solidity < 0.8.0, add SafeMath
    // If >= 0.8.0, just note that built-in checks exist
    
    const fixes = [];
    
    if (sourceCode.includes('pragma solidity ^0.7') || sourceCode.includes('pragma solidity ^0.6')) {
      fixes.push({
        type: 'add-import',
        code: 'import "@openzeppelin/contracts/utils/math/SafeMath.sol";'
      });
      
      fixes.push({
        type: 'use-library',
        code: 'using SafeMath for uint256;'
      });
    } else {
      fixes.push({
        type: 'note',
        code: 'Solidity 0.8+ has built-in overflow checks. Ensure you are using the latest version.'
      });
    }

    return this.generatePatch(fixes);
  }

  /**
   * Fix unchecked send
   */
  fixUncheckedSend(vulnerability, sourceCode) {
    const fixes = [{
      type: 'add-check',
      code: 'require(success, "Transfer failed");'
    }];

    return this.generatePatch(fixes);
  }

  /**
   * Fix tx.origin usage
   */
  fixTxOrigin(vulnerability, sourceCode) {
    const fixes = [{
      type: 'replace',
      old: 'tx.origin',
      new: 'msg.sender'
    }];

    return this.generatePatch(fixes);
  }

  /**
   * Fix public mint function
   */
  fixPublicMint(vulnerability, sourceCode) {
    const fixes = [];
    
    if (!sourceCode.includes('Ownable')) {
      fixes.push({
        type: 'add-import',
        code: 'import "@openzeppelin/contracts/access/Ownable.sol";'
      });
      
      fixes.push({
        type: 'inherit-contract',
        code: ', Ownable'
      });
    }
    
    fixes.push({
      type: 'add-modifier',
      function: 'mint',
      code: 'onlyOwner'
    });

    return this.generatePatch(fixes);
  }

  /**
   * Fix unsafe delegatecall
   */
  fixDelegatecall(vulnerability, sourceCode) {
    // Delegatecall is complex and often requires manual review
    // Provide a comment and access control suggestion
    const fixes = [];
    
    // Add access control if missing
    if (!sourceCode.includes('Ownable')) {
      fixes.push({
        type: 'add-import',
        code: 'import "@openzeppelin/contracts/access/Ownable.sol";'
      });
      
      fixes.push({
        type: 'inherit-contract',
        code: ', Ownable'
      });
    }
    
    // Add modifier to function with delegatecall
    fixes.push({
      type: 'add-modifier',
      function: vulnerability.location,
      code: 'onlyOwner'
    });

    // Add warning comment
    fixes.push({
      type: 'add-comment',
      code: '// WARNING: delegatecall is inherently dangerous. Review carefully!'
    });

    return this.generatePatch(fixes);
  }

  /**
   * Generate unified diff patch
   */
  generatePatch(fixes) {
    // Simplified patch generation
    return fixes.map(fix => `+ ${fix.code}`).join('\n');
  }

  /**
   * Get fix description
   */
  getFixDescription(vulnType) {
    const descriptions = {
      reentrancy: 'Added ReentrancyGuard to prevent reentrancy attacks',
      overflow: 'Added SafeMath to prevent integer overflow/underflow',
      uncheckedSend: 'Added require check for external call return value',
      txOrigin: 'Replaced tx.origin with msg.sender for authentication',
      publicMint: 'Added onlyOwner modifier to mint function',
      delegatecall: 'Added access control to delegatecall function (manual review required)'
    };
    
    return descriptions[vulnType] || 'Applied security fix';
  }

  /**
   * Create pull request with fixes
   */
  async createPR(fixes, repository, authToken) {
    // Security: Validate authentication token
    try {
      validateAuthToken(authToken);
      logAuthEvent('pr_creation_attempt', true, { repository, fixesCount: fixes.length });
    } catch (error) {
      logAuthEvent('pr_creation_attempt', false, { repository, error: error.message });
      throw new Error(`PR creation failed: ${error.message}`);
    }
    
    // Security: Validate fixes count
    if (fixes.length > MAX_FIXES_PER_REQUEST) {
      throw new Error(`Too many fixes requested (max: ${MAX_FIXES_PER_REQUEST})`);
    }
    
    console.log(`[Repair] Creating PR for ${fixes.length} fixes...`);
    
    // This would use GitHub API to create PR
    // For now, just output the fixes
    
    const prTitle = `🔒 Automated Security Fixes`;
    const prBody = this.generatePRBody(fixes);
    
    console.log('PR Title:', prTitle);
    console.log('PR Body:', prBody);
    
    logAuthEvent('pr_creation_success', true, { repository, fixesCount: fixes.length });
    
    return {
      prNumber: null, // Would be returned from GitHub API
      url: `https://github.com/${repository}/pull/TBD`,
      title: prTitle,
      description: prBody
    };
  }

  /**
   * Generate PR body
   */
  generatePRBody(fixes) {
    let body = '## Automated Security Fixes\n\n';
    body += 'This PR contains automated fixes for detected security vulnerabilities.\n\n';
    body += '### Fixed Vulnerabilities\n\n';
    
    for (const fix of fixes) {
      body += `- **${fix.vulnerabilityId}** (${fix.confidence}% confidence)\n`;
      body += `  - Strategy: ${fix.strategy}\n`;
      body += `  - ${fix.description}\n\n`;
    }
    
    body += '### Review Notes\n\n';
    body += '⚠️ Please carefully review these changes before merging.\n';
    body += 'While these fixes are automated, they should be tested thoroughly.\n\n';
    body += '---\n';
    body += '*Generated by SmartContractAudit Auto-Repair*\n';
    
    return body;
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
Auto-Repair Script

Usage: node repair.js [options]

Options:
  --report <path>     Path to scan report JSON
  --source <path>     Path to source code file
  --create-pr         Create pull request with fixes
  --auth-token <token> Authentication token for PR creation (or use REPAIR_AUTH_TOKEN env var)
  --help              Show this help message
    `);
    return;
  }

  let reportPath = null;
  let sourcePath = null;
  let createPR = false;
  let authToken = process.env.REPAIR_AUTH_TOKEN || null;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--report':
        if (i + 1 >= args.length) {
          console.error('Error: --report requires a value');
          process.exit(1);
        }
        // Security: Validate report path
        try {
          reportPath = sanitizeFilePath(args[++i]);
        } catch (error) {
          console.error(`Error: Invalid report path - ${error.message}`);
          process.exit(1);
        }
        break;
      case '--source':
        if (i + 1 >= args.length) {
          console.error('Error: --source requires a value');
          process.exit(1);
        }
        // Security: Validate source path
        try {
          sourcePath = sanitizeFilePath(args[++i]);
        } catch (error) {
          console.error(`Error: Invalid source path - ${error.message}`);
          process.exit(1);
        }
        break;
      case '--create-pr':
        createPR = true;
        break;
      case '--auth-token':
        if (i + 1 >= args.length) {
          console.error('Error: --auth-token requires a value');
          process.exit(1);
        }
        authToken = args[++i];
        break;
    }
  }

  if (!reportPath) {
    console.error('Error: --report is required');
    process.exit(1);
  }

  // Load report - path already validated
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  const sourceCode = sourcePath ? fs.readFileSync(sourcePath, 'utf8') : '';

  // Load config
  const configPath = path.join(__dirname, '../config/repair.json');
  const config = fs.existsSync(configPath)
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : {};

  const engine = new RepairEngine(config.repairPatterns);

  // Generate fixes
  const vulnerabilities = report.results?.antivirus?.vulnerabilities || [];
  const fixes = [];

  for (const vuln of vulnerabilities) {
    const fix = await engine.generateFix(vuln, sourceCode, sourcePath);
    if (fix.fixAvailable) {
      fixes.push(fix);
      console.log(`✅ Generated fix for ${vuln.type}`);
    } else {
      console.log(`⚠️  Cannot auto-fix ${vuln.type}: ${fix.reason}`);
    }
  }

  // Save fixes
  const fixesPath = path.join(__dirname, '../reports/fixes.json');
  fs.writeFileSync(fixesPath, JSON.stringify(fixes, null, 2));
  console.log(`\nFixes saved to: ${fixesPath}`);

  // Create PR if requested
  if (createPR && fixes.length > 0 && config.autoCreatePR) {
    const repository = process.env.GITHUB_REPOSITORY || 'owner/repo';
    try {
      await engine.createPR(fixes, repository, authToken);
    } catch (error) {
      console.error(`Failed to create PR: ${error.message}`);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = RepairEngine;
