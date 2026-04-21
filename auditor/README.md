# Auditor Modules

This directory contains the core auditing and detection modules for SmartContractAudit.

## Modules

### Antivirus Scanner (`antivirus/`)
Scans smart contracts for known vulnerabilities and malicious patterns.

**Features:**
- Bytecode analysis
- Source code pattern matching
- Known vulnerability detection
- Risk scoring

**Detects:**
- Reentrancy vulnerabilities
- Integer overflow/underflow
- tx.origin authentication
- Unsafe delegatecall
- Unprotected selfdestruct
- Unchecked external calls
- Public mint functions

### Spam Detector (`spam/`)
Identifies spam contracts and fraudulent patterns.

**Features:**
- Contract age analysis
- Deployment frequency checking
- Airdrop pattern detection
- Code similarity analysis
- Token distribution analysis

**Detects:**
- Mass airdrop spam
- Copy-paste contracts
- Rapid deployment patterns
- Suspicious distribution patterns

### Honeypot Detector (`honeypot/`)
Detects honeypot contracts that trap user funds.

**Features:**
- Transfer restriction detection
- Tax analysis
- Hidden function detection
- Transfer simulation
- Blacklist mechanism detection

**Detects:**
- Transfer blocking
- Sell restrictions
- Excessive fees
- Hidden mint functions
- Blacklist mechanisms
- Ownership manipulation

### Wallet Tracer (`tracer/`)
Traces wallet transactions and fund flows.

**Features:**
- Recursive deposit tracing
- Transaction graph building
- Deep wallet analysis
- Token/NFT holdings
- Risk factor identification

**Capabilities:**
- Trace deposits to origin
- Build transaction graphs
- Analyze wallet activity
- Identify suspicious patterns
- Track counterparties

### Deep Scanner (`scanner/`)
Orchestrates comprehensive multi-module scanning.

**Features:**
- Parallel module execution
- Comprehensive reporting
- Risk aggregation
- Summary generation

## Usage

### Quick Start

```javascript
const Auditor = require('./auditor');

// Initialize auditor
const auditor = new Auditor({
  antivirus: { threshold: 70 },
  spam: { threshold: 80 },
  honeypot: { simulateTransfer: true },
  tracer: { maxDepth: 5 }
});

// Scan a contract
const result = await auditor.scanContract('0x123...', 'ethereum');

// Check for honeypot
const honeypot = await auditor.checkHoneypot('0x456...', 'bsc');

// Trace wallet
const trace = await auditor.traceWallet('0x789...', 'polygon', 5);

// Full comprehensive scan
const fullScan = await auditor.fullScan('0xabc...', 'ethereum');
```

### Individual Modules

```javascript
const AntivirusScanner = require('./auditor/antivirus');
const SpamDetector = require('./auditor/spam');
const HoneypotDetector = require('./auditor/honeypot');
const WalletTracer = require('./auditor/tracer');

// Use individual modules
const scanner = new AntivirusScanner({ threshold: 70 });
const result = await scanner.scanContract('0x123...', 'ethereum');
```

## Configuration

Each module accepts a configuration object:

```javascript
{
  antivirus: {
    threshold: 70,
    patterns: ['reentrancy', 'overflow', ...],
    timeout: 60000
  },
  spam: {
    threshold: 80,
    checkAirdrop: true,
    checkSimilarity: true,
    minContractAge: 86400
  },
  honeypot: {
    simulateTransfer: true,
    maxBuyTax: 10,
    maxSellTax: 10,
    simulationAmount: '0.1'
  },
  tracer: {
    maxDepth: 5,
    minAmount: '0.01',
    includeTokens: true,
    includeNFTs: false,
    timeout: 120000
  }
}
```

## Output Format

All modules return standardized result objects:

```javascript
{
  address: string,
  chain: string,
  timestamp: number,
  scanType: string,
  // Module-specific results
  ...
}
```

## Extending

To add a new detection module:

1. Create a new directory under `auditor/`
2. Implement the module with standard interface
3. Add module to main `auditor/index.js`
4. Update configuration schema
5. Add tests

## Testing

```bash
# Test all modules
npm test

# Test specific module
npm test -- auditor/antivirus
```

## Performance

- Modules run in parallel when possible
- Configurable timeouts
- Caching for repeated scans
- Rate limiting for RPC calls
