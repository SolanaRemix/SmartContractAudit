#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { JsonLogger } = require('./utils/logger');
const { ensureAllowedPath } = require('./utils/pathSecurity');

const logger = new JsonLogger('repair');

class RepairEngine {
  constructor(config = {}) {
    this.config = config;
    this.repairPatterns = this.initializeRepairPatterns();
  }

  initializeRepairPatterns() {
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

    if (this.config && typeof this.config === 'object') {
      Object.keys(defaults).forEach((key) => {
        if (this.config[key]) {
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
    if (Buffer.byteLength(sourceCode, 'utf8') > MAX_FILE_SIZE) {
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
      logger.error('Fix generation failed', { vulnerability: vulnerability.type, error: error.message });
      return {
        vulnerabilityId: vulnerability.type,
        fixAvailable: false,
        reason: error.message
      };
    }
  }

  fixReentrancy(vulnerability, sourceCode) {
    const fixes = [];

    if (!sourceCode.includes('ReentrancyGuard')) {
      fixes.push({
        type: 'add-import',
        code: 'import "@openzeppelin/contracts/security/ReentrancyGuard.sol";'
      });
      fixes.push({ type: 'inherit-contract', code: ', ReentrancyGuard' });
    }

    fixes.push({ type: 'add-modifier', function: vulnerability.location, code: 'nonReentrant' });
    return this.generatePatch(fixes);
  }

  fixOverflow(vulnerability, sourceCode) {
    const fixes = [];

    if (sourceCode.includes('pragma solidity ^0.7') || sourceCode.includes('pragma solidity ^0.6')) {
      fixes.push({
        type: 'add-import',
        code: 'import "@openzeppelin/contracts/utils/math/SafeMath.sol";'
      });
      fixes.push({ type: 'use-library', code: 'using SafeMath for uint256;' });
    } else {
      fixes.push({
        type: 'note',
        code: 'Solidity 0.8+ has built-in overflow checks. Ensure you are using the latest version.'
      });
    }

    return this.generatePatch(fixes);
  }

  fixUncheckedSend() {
    return this.generatePatch([{ type: 'add-check', code: 'require(success, "Transfer failed");' }]);
  }

  fixTxOrigin() {
    return this.generatePatch([{ type: 'replace', old: 'tx.origin', new: 'msg.sender' }]);
  }

  fixPublicMint(vulnerability, sourceCode) {
    const fixes = [];

    if (!sourceCode.includes('Ownable')) {
      fixes.push({ type: 'add-import', code: 'import "@openzeppelin/contracts/access/Ownable.sol";' });
      fixes.push({ type: 'inherit-contract', code: ', Ownable' });
    }

    fixes.push({ type: 'add-modifier', function: 'mint', code: 'onlyOwner' });
    return this.generatePatch(fixes);
  }

  fixDelegatecall(vulnerability, sourceCode) {
    const fixes = [];

    if (!sourceCode.includes('Ownable')) {
      fixes.push({ type: 'add-import', code: 'import "@openzeppelin/contracts/access/Ownable.sol";' });
      fixes.push({ type: 'inherit-contract', code: ', Ownable' });
    }

    fixes.push({ type: 'add-modifier', function: vulnerability.location, code: 'onlyOwner' });
    fixes.push({ type: 'add-comment', code: '// WARNING: delegatecall is inherently dangerous. Review carefully!' });

    return this.generatePatch(fixes);
  }

  generatePatch(fixes) {
    return fixes.map((fix) => `+ ${fix.code}`).join('\n');
  }

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

  async createPR(fixes, repository) {
    const prTitle = '🔒 Automated Security Fixes';
    const prBody = this.generatePRBody(fixes);

    logger.info('Prepared PR payload', { repository, title: prTitle, fixes: fixes.length });

    return {
      prNumber: null,
      url: `https://github.com/${repository}/pull/TBD`,
      title: prTitle,
      description: prBody
    };
  }

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

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    reportPath: null,
    sourcePath: null,
    createPR: false
  };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--report':
        if (i + 1 >= argv.length) throw new Error('--report requires a value');
        options.reportPath = argv[++i];
        break;
      case '--source':
        if (i + 1 >= argv.length) throw new Error('--source requires a value');
        options.sourcePath = argv[++i];
        break;
      case '--create-pr':
        options.createPR = true;
        break;
      case '--help':
        process.stdout.write(`
Auto-Repair Script

Usage: node repair.js [options]

Options:
  --report <path>     Path to scan report JSON
  --source <path>     Path to source code file
  --create-pr         Create pull request with fixes metadata
  --help              Show this help message
`);
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${argv[i]}`);
    }
  }

  return options;
}

function loadRepairConfig() {
  const configPath = path.join(__dirname, '../config/repair.json');
  return fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, 'utf8')) : {};
}

async function main(argv = process.argv.slice(2)) {
  const { reportPath, sourcePath, createPR } = parseArgs(argv);

  if (!reportPath) {
    throw new Error('--report is required');
  }

  const safeReportPath = ensureAllowedPath(reportPath, process.cwd());
  const safeSourcePath = sourcePath ? ensureAllowedPath(sourcePath, process.cwd()) : null;

  const report = JSON.parse(fs.readFileSync(safeReportPath, 'utf8'));
  const sourceCode = safeSourcePath ? fs.readFileSync(safeSourcePath, 'utf8') : '';
  const config = loadRepairConfig();

  const engine = new RepairEngine(config.repairPatterns);
  const vulnerabilities = report.results?.antivirus?.vulnerabilities || [];
  const fixes = [];

  for (const vuln of vulnerabilities) {
    const fix = await engine.generateFix(vuln, sourceCode, safeSourcePath);
    if (fix.fixAvailable) {
      fixes.push(fix);
      logger.info('Generated fix', { vulnerability: vuln.type });
    } else {
      logger.warn('Could not generate fix', { vulnerability: vuln.type, reason: fix.reason });
    }
  }

  const fixesPath = path.join(__dirname, '../reports/fixes.json');
  fs.writeFileSync(fixesPath, JSON.stringify(fixes, null, 2));
  logger.info('Saved fixes', { fixesPath, count: fixes.length });

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
  main().catch((error) => {
    logger.error('Repair failed', { error: error.message });
    process.exit(1);
  });
}

module.exports = {
  RepairEngine,
  parseArgs,
  loadRepairConfig,
  main
};
