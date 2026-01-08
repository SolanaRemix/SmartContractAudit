#!/usr/bin/env node

/**
 * Auto-Repair Script
 * Generates fixes for detected vulnerabilities
 */

const fs = require('fs');
const path = require('path');

class RepairEngine {
  constructor(config = {}) {
    this.config = config;
    this.repairPatterns = this.initializeRepairPatterns();
  }

  initializeRepairPatterns() {
    return {
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
      }
    };
  }

  /**
   * Generate fix for a vulnerability
   */
  async generateFix(vulnerability, sourceCode) {
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
      
      return {
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
      publicMint: 'Added onlyOwner modifier to mint function'
    };
    
    return descriptions[vulnType] || 'Applied security fix';
  }

  /**
   * Create pull request with fixes
   */
  async createPR(fixes, repository) {
    console.log(`[Repair] Creating PR for ${fixes.length} fixes...`);
    
    // This would use GitHub API to create PR
    // For now, just output the fixes
    
    const prTitle = `🔒 Automated Security Fixes`;
    const prBody = this.generatePRBody(fixes);
    
    console.log('PR Title:', prTitle);
    console.log('PR Body:', prBody);
    
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
  --help              Show this help message
    `);
    return;
  }

  let reportPath = null;
  let sourcePath = null;
  let createPR = false;

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--report':
        if (i + 1 >= args.length) {
          console.error('Error: --report requires a value');
          process.exit(1);
        }
        reportPath = args[++i];
        break;
      case '--source':
        if (i + 1 >= args.length) {
          console.error('Error: --source requires a value');
          process.exit(1);
        }
        sourcePath = args[++i];
        break;
      case '--create-pr':
        createPR = true;
        break;
    }
  }

  if (!reportPath) {
    console.error('Error: --report is required');
    process.exit(1);
  }

  // Load report
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
    const fix = await engine.generateFix(vuln, sourceCode);
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
    await engine.createPR(fixes, repository);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
}

module.exports = RepairEngine;
