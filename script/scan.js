#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const Auditor = require('../auditor');
const { JsonLogger } = require('./utils/logger');
const { ensureAllowedPath } = require('./utils/pathSecurity');
const {
  getSupportedChains,
  normalizeChain,
  validateAddressForChain
} = require('./utils/chainValidation');

const logger = new JsonLogger('scan');
const supportedChains = getSupportedChains();
let shutdownRequested = false;

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    address: null,
    chain: 'ethereum',
    modules: ['antivirus', 'spam', 'honeypot'],
    output: 'json',
    depth: 5,
    file: null,
    verify: false
  };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--address':
        if (i + 1 >= argv.length) throw new Error('--address requires a value');
        options.address = argv[++i];
        break;
      case '--chain':
        if (i + 1 >= argv.length) throw new Error('--chain requires a value');
        options.chain = argv[++i];
        break;
      case '--modules':
        if (i + 1 >= argv.length) throw new Error('--modules requires a value');
        options.modules = argv[++i].split(',').map((m) => m.trim()).filter(Boolean);
        break;
      case '--output':
        if (i + 1 >= argv.length) throw new Error('--output requires a value');
        options.output = argv[++i];
        break;
      case '--depth':
        if (i + 1 >= argv.length) throw new Error('--depth requires a value');
        options.depth = Number.parseInt(argv[++i], 10);
        break;
      case '--file':
        if (i + 1 >= argv.length) throw new Error('--file requires a value');
        options.file = argv[++i];
        break;
      case '--verify':
        options.verify = true;
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
      default:
        throw new Error(`Unknown option: ${argv[i]}`);
    }
  }

  return options;
}

function printHelp() {
  const chains = Object.entries(supportedChains)
    .map(([key, value]) => `${key}(${value.chainId})`)
    .join(', ');

  process.stdout.write(`
SmartContractAudit Scanner

Usage: node scan.js [options]

Options:
  --address <address>     Contract or wallet address to scan
  --chain <chain>         Blockchain network (default: ethereum)
  --modules <modules>     Comma-separated modules (default: antivirus,spam,honeypot)
  --output <format>       Output format: json (default: json)
  --depth <number>        Trace depth for wallet scanning (default: 5)
  --file <path>           File containing addresses to scan (one per line)
  --verify                Run internal validation self-checks and exit
  --help                  Show this help message

Supported chains: ${chains}
`);
}

function registerGracefulShutdown() {
  const requestShutdown = (signal) => {
    shutdownRequested = true;
    logger.warn('Shutdown requested', { signal });
  };

  process.once('SIGTERM', () => requestShutdown('SIGTERM'));
  process.once('SIGINT', () => requestShutdown('SIGINT'));
}

function runSelfVerify() {
  const requiredChains = ['avalanche', 'arbitrum', 'optimism'];
  for (const chain of requiredChains) {
    if (!supportedChains[chain]) {
      throw new Error(`Missing required chain support: ${chain}`);
    }
  }

  validateAddressForChain('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'avalanche', supportedChains);

  let failed = false;
  try {
    validateAddressForChain('0x123', 'arbitrum', supportedChains);
  } catch {
    failed = true;
  }
  if (!failed) {
    throw new Error('Self-check failed: invalid address unexpectedly passed');
  }

  logger.info('Self-check completed', { status: 'ok' });
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
    fs.writeFileSync(path.join(reportsDir, 'latest.json'), JSON.stringify(results, null, 2));
    logger.info('Results saved', { filename, count: results.length });
  }
}

function summarizeResults(results) {
  const summary = {
    totalScanned: results.length,
    critical: 0,
    high: 0,
    medium: 0,
    honeypots: 0,
    spam: 0,
    errors: 0
  };

  for (const result of results) {
    if (result.error) {
      summary.errors += 1;
      continue;
    }

    const risk = result.summary?.overallRisk;
    if (risk === 'critical') summary.critical += 1;
    if (risk === 'high') summary.high += 1;
    if (risk === 'medium') summary.medium += 1;
    if (result.results?.honeypot?.isHoneypot) summary.honeypots += 1;
    if (result.results?.spam?.isSpam) summary.spam += 1;
  }

  logger.info('Scan summary', summary);
  return summary;
}

async function scanAddress(auditor, address, chain, modules) {
  try {
    const result = await auditor._deepScanner.scan(address, chain, modules);
    logger.info('Address scanned', {
      address,
      chain,
      risk: result.summary?.overallRisk || 'unknown'
    });
    return result;
  } catch (error) {
    logger.error('Address scan failed', { address, chain, error: error.message });
    return { address, chain, error: error.message, timestamp: Date.now() };
  }
}

async function main(argv = process.argv.slice(2)) {
  registerGracefulShutdown();

  const options = parseArgs(argv);
  if (options.verify) {
    runSelfVerify();
    return;
  }

  if (!options.address && !options.file) {
    throw new Error('Either --address or --file must be specified');
  }

  const normalizedChain = normalizeChain(options.chain, supportedChains);
  const config = loadConfig();
  const auditor = new Auditor(config);
  const results = [];

  if (options.address) {
    const validatedAddress = validateAddressForChain(options.address, normalizedChain, supportedChains);
    const result = await scanAddress(auditor, validatedAddress, normalizedChain, options.modules);
    results.push(result);
  }

  if (options.file) {
    const safeFile = ensureAllowedPath(options.file, process.cwd());
    const addresses = fs
      .readFileSync(safeFile, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    logger.info('Loaded addresses', { file: safeFile, count: addresses.length });

    for (const address of addresses) {
      if (shutdownRequested) {
        logger.warn('Stopping batch scan due to shutdown request');
        break;
      }

      try {
        const validatedAddress = validateAddressForChain(address, normalizedChain, supportedChains);
        const result = await scanAddress(auditor, validatedAddress, normalizedChain, options.modules);
        results.push(result);
      } catch (error) {
        results.push({ address, chain: normalizedChain, error: error.message, timestamp: Date.now() });
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  saveResults(results, options.output);
  summarizeResults(results);
}

if (require.main === module) {
  main().catch((error) => {
    logger.error('Fatal scan error', { error: error.message });
    process.exit(1);
  });
}

module.exports = {
  main,
  parseArgs,
  runSelfVerify,
  summarizeResults,
  loadConfig
};
