#!/usr/bin/env node

/**
 * Scan Script
 * Main script for running contract and wallet scans
 */

const Auditor = require('../auditor');
const fs = require('fs');
const path = require('path');

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
        options.address = args[++i];
        break;
      case '--chain':
        options.chain = args[++i];
        break;
      case '--modules':
        options.modules = args[++i].split(',');
        break;
      case '--output':
        options.output = args[++i];
        break;
      case '--depth':
        options.depth = parseInt(args[++i]);
        break;
      case '--file':
        options.file = args[++i];
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
  --output <format>       Output format: json, html, pdf (default: json)
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
    const addresses = fs.readFileSync(options.file, 'utf8')
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
