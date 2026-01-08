# API Reference

## Auditor Modules

### AntivirusScanner

Scans smart contracts for malicious patterns and known vulnerabilities.

#### Methods

##### `scanContract(address, chain)`

Scans a smart contract for vulnerabilities.

**Parameters:**
- `address` (string): Contract address to scan
- `chain` (string): Blockchain network (e.g., 'ethereum', 'bsc', 'solana')

**Returns:**
```javascript
{
  address: string,
  chain: string,
  riskScore: number, // 0-100
  vulnerabilities: [
    {
      type: string,
      severity: 'critical' | 'high' | 'medium' | 'low',
      description: string,
      location: string,
      recommendation: string
    }
  ],
  timestamp: number
}
```

**Example:**
```javascript
const result = await antivirusScanner.scanContract(
  '0x1234567890123456789012345678901234567890',
  'ethereum'
);
```

### SpamDetector

Detects spam transactions and fraudulent contract patterns.

#### Methods

##### `analyzeContract(address, chain)`

Analyzes a contract for spam indicators.

**Parameters:**
- `address` (string): Contract address
- `chain` (string): Blockchain network

**Returns:**
```javascript
{
  address: string,
  isSpam: boolean,
  confidence: number, // 0-100
  indicators: [
    {
      type: string,
      weight: number,
      description: string
    }
  ],
  spamScore: number // 0-100
}
```

##### `analyzeTransaction(txHash, chain)`

Analyzes a transaction for spam patterns.

**Parameters:**
- `txHash` (string): Transaction hash
- `chain` (string): Blockchain network

**Returns:**
```javascript
{
  txHash: string,
  isSpam: boolean,
  reason: string,
  relatedAddresses: string[]
}
```

### HoneypotDetector

Detects honeypot contracts that trap funds.

#### Methods

##### `checkHoneypot(address, chain)`

Checks if a contract is a honeypot.

**Parameters:**
- `address` (string): Contract address
- `chain` (string): Blockchain network

**Returns:**
```javascript
{
  address: string,
  isHoneypot: boolean,
  honeypotType: string | null,
  indicators: [
    {
      type: string,
      detected: boolean,
      details: string
    }
  ],
  buyTax: number,
  sellTax: number,
  canSell: boolean
}
```

**Honeypot Types:**
- `TRANSFER_BLOCKED`: Cannot transfer tokens
- `SELL_BLOCKED`: Cannot sell tokens
- `HIGH_FEES`: Excessive transaction fees
- `MINT_FUNCTION`: Hidden mint capability
- `BLACKLIST`: Address blacklist mechanism

### WalletTracer

Traces wallet transactions and fund flows.

#### Methods

##### `traceDeposits(address, chain, depth)`

Traces deposits to their origin wallets.

**Parameters:**
- `address` (string): Wallet address to trace
- `chain` (string): Blockchain network
- `depth` (number): Maximum depth to trace (default: 5)

**Returns:**
```javascript
{
  address: string,
  deposits: [
    {
      from: string,
      amount: string,
      token: string,
      timestamp: number,
      txHash: string,
      depth: number
    }
  ],
  origins: [
    {
      address: string,
      totalAmount: string,
      firstSeen: number,
      transactionCount: number
    }
  ],
  graph: object // Transaction graph data
}
```

##### `deepScan(address, chain, options)`

Performs deep analysis of wallet activity.

**Parameters:**
- `address` (string): Wallet address
- `chain` (string): Blockchain network
- `options` (object):
  - `includeTokens` (boolean): Include token transfers
  - `includeNFTs` (boolean): Include NFT transfers
  - `timeRange` (object): { start: number, end: number }

**Returns:**
```javascript
{
  address: string,
  totalTransactions: number,
  totalVolume: string,
  firstActivity: number,
  lastActivity: number,
  counterparties: string[],
  tokens: object[],
  nfts: object[],
  riskFactors: string[]
}
```

### DeepScanner

Advanced scanning engine for comprehensive analysis.

#### Methods

##### `scan(target, chain, modules)`

Performs comprehensive scan using specified modules.

**Parameters:**
- `target` (string): Address or transaction hash
- `chain` (string): Blockchain network
- `modules` (string[]): Modules to use ['antivirus', 'spam', 'honeypot', 'tracer']

**Returns:**
```javascript
{
  target: string,
  chain: string,
  scanId: string,
  timestamp: number,
  results: {
    antivirus: object | null,
    spam: object | null,
    honeypot: object | null,
    tracer: object | null
  },
  summary: {
    overallRisk: 'safe' | 'low' | 'medium' | 'high' | 'critical',
    issues: number,
    recommendations: string[]
  }
}
```

## Automation API

### RepairEngine

Automated vulnerability repair system.

#### Methods

##### `generateFix(vulnerability)`

Generates code fix for a detected vulnerability.

**Parameters:**
- `vulnerability` (object): Vulnerability details from scan

**Returns:**
```javascript
{
  vulnerabilityId: string,
  fixAvailable: boolean,
  patch: string, // Unified diff format
  description: string,
  confidence: number
}
```

##### `createPR(fixes, repository)`

Creates a pull request with automated fixes.

**Parameters:**
- `fixes` (object[]): Array of fix objects
- `repository` (string): GitHub repository

**Returns:**
```javascript
{
  prNumber: number,
  url: string,
  title: string,
  description: string
}
```

### NotificationService

Sends alerts and notifications to admins.

#### Methods

##### `notifyAdmin(message, severity)`

Sends notification to administrators.

**Parameters:**
- `message` (string): Notification message
- `severity` (string): 'info' | 'warning' | 'critical'

**Returns:**
```javascript
{
  sent: boolean,
  channels: string[], // ['email', 'slack', 'telegram']
  timestamp: number
}
```

## Configuration

### Chain Configuration

```javascript
{
  "ethereum": {
    "rpc": "https://mainnet.infura.io/v3/YOUR_KEY",
    "explorer": "https://etherscan.io",
    "chainId": 1
  },
  "bsc": {
    "rpc": "https://bsc-dataseed1.binance.org",
    "explorer": "https://bscscan.com",
    "chainId": 56
  },
  "solana": {
    "rpc": "https://api.mainnet-beta.solana.com",
    "explorer": "https://explorer.solana.com",
    "chainId": "mainnet-beta"
  }
}
```

### Scanner Configuration

```javascript
{
  "antivirus": {
    "enabled": true,
    "threshold": 70,
    "patterns": ["reentrancy", "overflow", "delegatecall"]
  },
  "spam": {
    "enabled": true,
    "threshold": 80,
    "checkAirdrop": true
  },
  "honeypot": {
    "enabled": true,
    "simulateTransfer": true,
    "maxBuyTax": 10,
    "maxSellTax": 10
  }
}
```

## Error Codes

- `E001`: Invalid contract address
- `E002`: Chain not supported
- `E003`: RPC connection failed
- `E004`: Rate limit exceeded
- `E005`: Contract not verified
- `E006`: Insufficient data for analysis
- `E007`: Scan timeout
- `E008`: Invalid configuration
