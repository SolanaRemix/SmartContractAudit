# Development Guide

## Development Setup

### Environment Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Development Tools**
- ESLint for code linting
- Prettier for code formatting
- Jest for testing
- Nodemon for hot reload

3. **IDE Setup**

Recommended: Visual Studio Code with extensions:
- ESLint
- Prettier
- GitLens
- Thunder Client (API testing)

### Project Structure

```
SmartContractAudit/
├── auditor/              # Auditor modules
│   ├── antivirus/       # Antivirus scanner
│   ├── spam/            # Spam detector
│   ├── honeypot/        # Honeypot detector
│   ├── tracer/          # Wallet tracer
│   ├── scanner/         # Deep scanner
│   └── index.js         # Main auditor entry
├── contracts/           # Smart contract examples
│   ├── ethereum/        # EVM contracts
│   ├── solana/          # Solana programs
│   └── examples/        # Test contracts
├── script/              # Automation scripts
│   ├── scan.js          # Scanning orchestration
│   ├── deploy.js        # Deployment automation
│   ├── repair.js        # Auto-repair logic
│   └── notify.js        # Notification system
├── config/              # Configuration files
│   ├── chains.json      # Chain configurations
│   ├── rules.json       # Detection rules
│   └── notifications.json
├── .github/workflows/   # GitHub Actions
├── docs/                # Documentation
├── reports/             # Scan reports
└── tests/               # Test suite
```

## Building Modules

### Creating a New Detection Module

1. Create module directory:
```bash
mkdir auditor/mymodule
```

2. Create module structure:
```javascript
// auditor/mymodule/index.js
class MyModule {
  constructor(config) {
    this.config = config;
  }

  async scan(target, chain) {
    // Implementation
    return {
      target,
      chain,
      results: [],
      score: 0
    };
  }
}

module.exports = MyModule;
```

3. Add tests:
```javascript
// tests/mymodule.test.js
const MyModule = require('../auditor/mymodule');

describe('MyModule', () => {
  test('should scan target', async () => {
    const module = new MyModule({});
    const result = await module.scan('0x123...', 'ethereum');
    expect(result.target).toBe('0x123...');
  });
});
```

4. Register module in main auditor:
```javascript
// auditor/index.js
const MyModule = require('./mymodule');

class Auditor {
  constructor() {
    this.modules = {
      mymodule: new MyModule(config.mymodule)
    };
  }
}
```

### Adding Chain Support

1. Add chain configuration:
```json
// config/chains.json
{
  "mychain": {
    "name": "My Blockchain",
    "rpc": "https://rpc.mychain.io",
    "explorer": "https://explorer.mychain.io",
    "chainId": 999,
    "type": "evm",
    "nativeCurrency": {
      "name": "My Token",
      "symbol": "MTK",
      "decimals": 18
    }
  }
}
```

2. Create chain connector:
```javascript
// auditor/connectors/mychain.js
const { ethers } = require('ethers');

class MyChainConnector {
  constructor(config) {
    this.provider = new ethers.providers.JsonRpcProvider(config.rpc);
  }

  async getContract(address) {
    return await this.provider.getCode(address);
  }

  async getTransaction(hash) {
    return await this.provider.getTransaction(hash);
  }
}

module.exports = MyChainConnector;
```

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm test -- antivirus

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Writing Tests

Example test structure:

```javascript
const AntivirusScanner = require('../auditor/antivirus');

describe('AntivirusScanner', () => {
  let scanner;

  beforeEach(() => {
    scanner = new AntivirusScanner({
      threshold: 70,
      patterns: ['reentrancy']
    });
  });

  describe('scanContract', () => {
    test('detects reentrancy vulnerability', async () => {
      const result = await scanner.scanContract(
        '0xVulnerableContract',
        'ethereum'
      );
      
      expect(result.vulnerabilities).toContainEqual(
        expect.objectContaining({
          type: 'reentrancy',
          severity: 'critical'
        })
      );
    });

    test('returns clean scan for safe contract', async () => {
      const result = await scanner.scanContract(
        '0xSafeContract',
        'ethereum'
      );
      
      expect(result.vulnerabilities).toHaveLength(0);
      expect(result.riskScore).toBeLessThan(20);
    });
  });
});
```

## Debugging

### Local Debugging

1. Enable debug mode:
```bash
export DEBUG=audit:*
npm run scan -- --address 0x123... --chain ethereum
```

2. Use debugger:
```javascript
// Add breakpoint
debugger;

// Run with inspector
node --inspect-brk script/scan.js --address 0x123...
```

3. VS Code launch configuration:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Scan",
  "program": "${workspaceFolder}/script/scan.js",
  "args": ["--address", "0x123...", "--chain", "ethereum"]
}
```

### Debugging Workflows

For GitHub Actions debugging:

1. Add debug step to workflow:
```yaml
- name: Debug
  run: |
    echo "Current directory: $(pwd)"
    echo "Files: $(ls -la)"
    echo "Environment: ${{ toJson(env) }}"
```

2. Use act for local testing:
```bash
act -j audit-workflow
```

## Code Style

### Linting

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

### Formatting

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### Style Guidelines

- Use camelCase for variables and functions
- Use PascalCase for classes
- Use UPPER_CASE for constants
- Always use async/await over promises
- Add JSDoc comments for public APIs
- Keep functions small and focused

Example:

```javascript
/**
 * Scans a smart contract for vulnerabilities
 * @param {string} address - Contract address
 * @param {string} chain - Blockchain network
 * @returns {Promise<ScanResult>} Scan results
 */
async function scanContract(address, chain) {
  const scanner = new AntivirusScanner();
  return await scanner.scan(address, chain);
}
```

## Performance Optimization

### Caching

Implement caching for repeated scans:

```javascript
const cache = new Map();

async function scanWithCache(address, chain) {
  const key = `${chain}:${address}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await scan(address, chain);
  cache.set(key, result);
  
  return result;
}
```

### Parallel Processing

Use parallel processing for batch scans:

```javascript
const addresses = ['0x1...', '0x2...', '0x3...'];

const results = await Promise.all(
  addresses.map(addr => scanContract(addr, 'ethereum'))
);
```

### Rate Limiting

Implement rate limiting for RPC calls:

```javascript
const Bottleneck = require('bottleneck');

const limiter = new Bottleneck({
  maxConcurrent: 5,
  minTime: 200
});

const rateLimitedScan = limiter.wrap(scanContract);
```

## Contributing

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Run linter and tests
6. Submit PR with description

### Commit Messages

Follow conventional commits:

```
feat: add spam detection for token contracts
fix: resolve honeypot false positives
docs: update API documentation
test: add tests for wallet tracer
refactor: optimize scan performance
```

### Code Review

All PRs require:
- Passing tests
- Code review approval
- No linting errors
- Updated documentation

## Deployment

### Manual Deployment

```bash
# Build
npm run build

# Test in staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

### CI/CD Pipeline

Automated deployment via GitHub Actions:

1. Push to main branch
2. Tests run automatically
3. If tests pass, deploy to staging
4. Manual approval for production
5. Deploy to production

## Troubleshooting Development Issues

### Common Setup Issues

**Issue: npm install fails**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Issue: Tests fail locally**
```bash
# Reset test environment
npm run test:clean
npm test
```

**Issue: RPC timeout in tests**
```javascript
// Increase timeout in test
jest.setTimeout(30000);
```

## Resources

- [Ethers.js Documentation](https://docs.ethers.io/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Jest Testing](https://jestjs.io/docs/getting-started)

## Getting Help

- Review existing issues on GitHub
- Join developer Discord channel
- Check [API Documentation](./API.md)
- Contact maintainers
