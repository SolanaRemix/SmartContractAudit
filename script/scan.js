#!/usr/bin/env node

/**
 * Scan Script
 * Main script for running contract and wallet scans
 */

const Auditor = require('../auditor');
const fs = require('fs');
const path = require('path');

// Security: Maximum file size (10MB) to prevent DoS
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Security: Sanitize input to prevent injection attacks
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }
  
  // Remove any shell metacharacters and control characters
  const sanitized = input
    .replace(/[;&|`$(){}[\]<>]/g, '')
    .replace(/[\x00-\x1F\x7F]/g, '')
    .trim();
  
  if (sanitized.length === 0 && input.length > 0) {
    throw new Error('Input contains only invalid characters');
  }
  
  return sanitized;
}

// Security: Validate and sanitize file paths to prevent path traversal
function sanitizeFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('File path must be a non-empty string');
  }
  
  // Check for path traversal attempts BEFORE normalization
  const pathSegments = filePath.split(/[\\/]+/).filter(Boolean);
  if (pathSegments.includes('..')) {
    throw new Error('Path traversal detected in file path');
  }
  
  // Resolve to absolute path and normalize
  const normalizedPath = path.resolve(filePath);
  
  // Ensure file exists and is readable
  if (!fs.existsSync(normalizedPath)) {
    throw new Error(`File does not exist: ${filePath}`);
  }
 
  const realPath = fs.realpathSync(normalizedPath);
  const allowedBase = fs.realpathSync(process.cwd());
  const relativePath = path.relative(allowedBase, realPath);
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error('Access to path outside project directory is not allowed');
  }
  
  const stats = fs.statSync(realPath);
  
  if (!stats.isFile()) {
    throw new Error(`Path is not a file: ${filePath}`);
  }
  
  // Check file size
  if (stats.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum allowed size (${MAX_FILE_SIZE} bytes): ${filePath}`);
  }
  
  return realPath;
}

// Security: Validate blockchain address format
function validateAddress(address, chain = 'ethereum') {
  if (!address || typeof address !== 'string') {
    throw new Error('Address must be a non-empty string');
  }
  
  const sanitized = sanitizeInput(address);
  
  // Basic validation based on chain
  if (['ethereum', 'bsc', 'polygon', 'avalanche', 'arbitrum', 'optimism'].includes(chain)) {
    // Ethereum-style addresses start with 0x and have 40 hex characters
    if (!/^0x[a-fA-F0-9]{40}$/.test(sanitized)) {
      throw new Error('Invalid Ethereum-style address format');
    }
  } else if (chain === 'solana') {
    // Solana addresses are base58 encoded, typically 32-44 characters
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(sanitized)) {
      throw new Error('Invalid Solana address format');
    }
  }
  
  return sanitized;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    address: null,
    chain: 'ethereum',
    modules: ['antivirus', 'spam', 'honeypot'],
    output: 'json',
    depth: 5,
    file: null
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--address':
        if (i + 1 >= args.length) {
          console.error('Error: --address requires a value');
          process.exit(1);
        }
        // Security: Validate and sanitize address input
        // Note: Full validation happens in scanAddress(), but we store the raw value here
        // to preserve the original input for error messages
        try {
          const rawAddress = args[++i];
          // Basic sanitization only - full validation deferred to scanAddress()
          options.address = sanitizeInput(rawAddress);
        } catch (error) {
          console.error(`Error: Invalid address - ${error.message}`);
          process.exit(1);
        }
        break;
      case '--chain':
        if (i + 1 >= args.length) {
          console.error('Error: --chain requires a value');
          process.exit(1);
        }
        // Security: Sanitize chain input
        try {
          options.chain = sanitizeInput(args[++i]);
        } catch (error) {
          console.error(`Error: Invalid chain - ${error.message}`);
          process.exit(1);
        }
        break;
      case '--modules':
        if (i + 1 >= args.length) {
          console.error('Error: --modules requires a value');
          process.exit(1);
        }
        // Security: Sanitize module names
        try {
          const modulesInput = sanitizeInput(args[++i]);
          options.modules = modulesInput.split(',').map(m => sanitizeInput(m.trim()));
        } catch (error) {
          console.error(`Error: Invalid modules - ${error.message}`);
          process.exit(1);
        }
        break;
      case '--output':
        if (i + 1 >= args.length) {
          console.error('Error: --output requires a value');
          process.exit(1);
        }
        // Security: Sanitize output format
        try {
          options.output = sanitizeInput(args[++i]);
          if (!['json', 'all'].includes(options.output)) {
            throw new Error('Output format must be one of: json, all');
          }
        } catch (error) {
          console.error(`Error: Invalid output format - ${error.message}`);
          process.exit(1);
        }
        break;
      case '--depth':
        if (i + 1 >= args.length) {
          console.error('Error: --depth requires a value');
          process.exit(1);
        }
        const depthValue = parseInt(args[++i]);
        if (isNaN(depthValue) || depthValue < 1 || depthValue > 100) {
          console.error('Error: --depth must be a number between 1 and 100');
          process.exit(1);
        }
        options.depth = depthValue;
        break;
      case '--file':
        if (i + 1 >= args.length) {
          console.error('Error: --file requires a value');
          process.exit(1);
        }
        // Security: Validate and sanitize file path
        try {
          options.file = sanitizeFilePath(args[++i]);
        } catch (error) {
          console.error(`Error: Invalid file path - ${error.message}`);
          process.exit(1);
        }
        break;
      case '--help':
        printHelp();
        process.exit(0);
      default:
        console.error(`Unknown option: ${args[i]}`);
        process.exit(1);
    }
  }

  return options;
}

function printHelp() {
  console.log(`
SmartContractAudit Scanner

Usage: node scan.js [options]

Options:
  --address <address>     Contract or wallet address to scan
  --chain <chain>         Blockchain network (default: ethereum)
  --modules <modules>     Comma-separated list of modules (default: antivirus,spam,honeypot)
  --output <format>       Output format: json, all (default: json)
  --depth <number>        Trace depth for wallet scanning (default: 5)
  --file <path>           File containing addresses to scan (one per line)
  --help                  Show this help message

Examples:
  node scan.js --address 0x123... --chain ethereum
  node scan.js --address 0x456... --chain bsc --modules honeypot
  node scan.js --file addresses.txt --chain polygon

Supported chains: ethereum, bsc, polygon, avalanche, arbitrum, optimism, solana
Supported modules: antivirus, spam, honeypot, tracer
  `);
}

async function scanAddress(auditor, address, chain, modules) {
  // Security: Validate address before scanning
  try {
    address = validateAddress(address, chain);
  } catch (error) {
    console.error(`Invalid address: ${error.message}`);
    return {
      address,
      chain,
      error: `Invalid address format: ${error.message}`,
      timestamp: Date.now()
    };
  }
  
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Scanning: ${address}`);
  console.log(`Chain: ${chain}`);
  console.log(`Modules: ${modules.join(', ')}`);
  console.log('='.repeat(60));

  try {
    const result = await auditor.deepScanner.scan(address, chain, modules);
    return result;
  } catch (error) {
    console.error(`Error scanning ${address}: ${error.message}`);
    return {
      address,
      chain,
      error: error.message,
      timestamp: Date.now()
    };
  }
}

async function main() {
  const options = parseArgs();

  if (!options.address && !options.file) {
    console.error('Error: Either --address or --file must be specified');
    printHelp();
    process.exit(1);
  }

  // Initialize auditor
  const config = loadConfig();
  const auditor = new Auditor(config);

  let results = [];

  // Scan single address or batch
  if (options.address) {
    const result = await scanAddress(auditor, options.address, options.chain, options.modules);
    results.push(result);
  } else if (options.file) {
    // Security: File path already validated in parseArgs via sanitizeFilePath
    // Read file content securely
    const fileContent = fs.readFileSync(options.file, 'utf8');
    const addresses = fileContent
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'));

    console.log(`Loaded ${addresses.length} addresses from ${options.file}`);

    for (const address of addresses) {
      const result = await scanAddress(auditor, address, options.chain, options.modules);
      results.push(result);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // Save results
  saveResults(results, options.output);

  // Print summary
  printSummary(results);
}

function loadConfig() {
  const configPath = path.join(__dirname, '../config/scanner.json');
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
  return {};
}

function saveResults(results, format) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportsDir = path.join(__dirname, '../reports');
  
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  if (format === 'json' || format === 'all') {
    const jsonDir = path.join(reportsDir, 'json');
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir, { recursive: true });
    }
    
    const filename = path.join(jsonDir, `scan-${timestamp}.json`);
    fs.writeFileSync(filename, JSON.stringify(results, null, 2));
    console.log(`\nResults saved to: ${filename}`);
    
    // Also save as latest.json
    fs.writeFileSync(path.join(reportsDir, 'latest.json'), JSON.stringify(results, null, 2));
  }
}

function printSummary(results) {
  console.log(`\n${'='.repeat(60)}`);
  console.log('SCAN SUMMARY');
  console.log('='.repeat(60));

  let criticalCount = 0;
  let highCount = 0;
  let mediumCount = 0;
  let honeypotCount = 0;
  let spamCount = 0;

  for (const result of results) {
    if (result.error) {
      console.log(`❌ ${result.address}: ERROR`);
      continue;
    }

    const risk = result.summary?.overallRisk || 'unknown';
    const icon = {
      safe: '✅',
      low: '⚠️ ',
      medium: '⚠️ ',
      high: '🔴',
      critical: '🔴'
    }[risk] || '❓';

    console.log(`${icon} ${result.address}: ${risk.toUpperCase()}`);

    if (risk === 'critical') criticalCount++;
    else if (risk === 'high') highCount++;
    else if (risk === 'medium') mediumCount++;

    if (result.results?.honeypot?.isHoneypot) honeypotCount++;
    if (result.results?.spam?.isSpam) spamCount++;

    if (result.summary?.recommendations?.length > 0) {
      result.summary.recommendations.forEach(rec => {
        console.log(`  → ${rec}`);
      });
    }
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`Total scanned: ${results.length}`);
  console.log(`Critical risk: ${criticalCount}`);
  console.log(`High risk: ${highCount}`);
  console.log(`Medium risk: ${mediumCount}`);
  console.log(`Honeypots detected: ${honeypotCount}`);
  console.log(`Spam detected: ${spamCount}`);
  console.log('='.repeat(60));
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
