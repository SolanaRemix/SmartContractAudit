# SmartContractAudit 🛡️

Professional multi-chain smart contract auditing, monitoring, and automated repair system with AI-powered detection and GitHub Actions integration.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

## 🌟 Features

### Multi-Chain Support
- **EVM Chains**: Ethereum, BSC, Polygon, Avalanche, Arbitrum, Optimism, Fantom
- **Solana**: Full Solana program analysis support
- Extensible architecture for adding new chains

### Advanced Detection Modules

#### 🦠 Antivirus Scanner
- Bytecode pattern analysis
- Source code vulnerability detection
- Known exploit signature matching
- Risk scoring algorithm

**Detects:**
- Reentrancy attacks
- Integer overflow/underflow
- Unchecked external calls
- tx.origin authentication
- Unsafe delegatecall
- Unprotected selfdestruct
- Public mint functions

#### 🚫 Spam Detector
- Contract age analysis
- Deployment frequency monitoring
- Airdrop pattern recognition
- Code similarity detection

#### 🍯 Honeypot Detector
- Transfer simulation testing
- Fee structure analysis
- Hidden function detection
- Blacklist mechanism identification
- Ownership manipulation checks

#### 🔍 Wallet Tracer
- Recursive deposit tracing
- Fund flow visualization
- Deep wallet activity analysis
- Transaction graph generation
- Risk factor identification

### Automation & CI/CD

#### GitHub Actions Workflows
1. **Auditor Bot**: Continuous monitoring (runs every 6 hours)
2. **Auto-Repair**: Automatic vulnerability fixing via PR
3. **PR Security Audit**: Automated security checks on pull requests
4. **Deep Scan**: Comprehensive weekly scans

#### Notification System
- Email alerts
- Slack integration
- Telegram bot
- Discord webhooks
- Custom webhook support

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your API keys and RPC endpoints
nano .env
```

## 🚀 Quick Start

### Scan a Contract

```bash
# Basic scan
npm run scan -- --address 0x1234567890123456789012345678901234567890 --chain ethereum

# Scan with specific modules
npm run scan -- --address 0x1234... --chain bsc --modules antivirus,honeypot

# Batch scan from file
npm run scan -- --file addresses.txt --chain polygon
```

### Check for Honeypot

```bash
node script/scan.js --address 0x1234... --chain bsc --modules honeypot
```

### Trace Wallet Deposits

```bash
node script/scan.js --address 0x1234... --chain ethereum --modules tracer --depth 10
```

### Full Comprehensive Scan

```bash
node script/scan.js --address 0x1234... --chain ethereum --modules antivirus,spam,honeypot,tracer
```

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md) - System design and components
- [API Reference](./docs/API.md) - Complete API documentation
- [User Guide](./docs/USER_GUIDE.md) - Detailed usage instructions
- [Development Guide](./docs/DEVELOPMENT.md) - Contributing and extending
- [Configuration](./docs/CONFIGURATION.md) - Configuration options
- [Workflows](./docs/WORKFLOWS.md) - GitHub Actions setup

## 🏗️ Project Structure

```
SmartContractAudit/
├── auditor/              # Core auditing modules
│   ├── antivirus/       # Vulnerability scanner
│   ├── spam/            # Spam detector
│   ├── honeypot/        # Honeypot detector
│   ├── tracer/          # Wallet tracer
│   ├── scanner/         # Deep scanner orchestrator
│   └── index.js         # Main auditor entry point
├── contracts/           # Example smart contracts
│   ├── ethereum/        # EVM contracts
│   └── solana/          # Solana programs
├── script/              # Automation scripts
│   ├── scan.js          # Main scanning script
│   ├── notify.js        # Notification handler
│   └── repair.js        # Auto-repair engine
├── config/              # Configuration files
│   ├── chains.json      # Chain configurations
│   ├── scanner.json     # Scanner settings
│   ├── notifications.json
│   └── repair.json
├── .github/workflows/   # GitHub Actions
├── docs/                # Documentation
└── reports/             # Scan reports
```

## ⚙️ Configuration

### Chain Configuration (`config/chains.json`)

Add your RPC endpoints and API keys:

```json
{
  "ethereum": {
    "rpc": "https://mainnet.infura.io/v3/YOUR_KEY",
    "apiKey": "YOUR_ETHERSCAN_KEY"
  }
}
```

### Scanner Configuration (`config/scanner.json`)

Customize detection thresholds:

```json
{
  "antivirus": {
    "threshold": 70,
    "patterns": ["reentrancy", "overflow", ...]
  }
}
```

See [Configuration Guide](./docs/CONFIGURATION.md) for complete options.

## 🤖 GitHub Actions Setup

### 1. Add Repository Secrets

Go to Settings → Secrets → Actions and add:

```
ETHEREUM_RPC_URL
BSC_RPC_URL
POLYGON_RPC_URL
SOLANA_RPC_URL
ETHERSCAN_API_KEY
BSCSCAN_API_KEY
SLACK_WEBHOOK
NOTIFICATION_WEBHOOK
```

### 2. Enable Workflows

Workflows are located in `.github/workflows/`:
- `auditor-bot.yml` - Continuous monitoring
- `auto-repair.yml` - Automated fixes
- `pr-audit.yml` - PR security checks
- `deep-scan.yml` - Weekly comprehensive scans

### 3. Configure Monitoring

Create `config/monitored-addresses.txt` with addresses to monitor (one per line).

## 📊 Reports

All scan results are saved in the `reports/` directory:

- `reports/json/` - JSON format reports
- `reports/latest.json` - Most recent scan
- Uploaded as GitHub Actions artifacts

## 🔧 Development

### Adding a New Detection Module

1. Create module directory: `auditor/mymodule/`
2. Implement scanner class with `scan()` method
3. Register in `auditor/index.js`
4. Add configuration to `config/scanner.json`
5. Add tests

### Adding Chain Support

1. Add chain config to `config/chains.json`
2. Create connector if needed
3. Update documentation

See [Development Guide](./docs/DEVELOPMENT.md) for details.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific module tests
npm test -- auditor/antivirus

# With coverage
npm run test:coverage
```

## 🔐 Security

This tool is designed to **detect** security vulnerabilities, not exploit them. Always use responsibly and ethically.

- Report security issues privately
- Do not use for malicious purposes
- Respect rate limits and terms of service
- Keep API keys and secrets secure

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/SolanaRemix/SmartContractAudit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SolanaRemix/SmartContractAudit/discussions)
- **Documentation**: [docs/](./docs/)

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

## 🙏 Acknowledgments

- OpenZeppelin for security best practices
- The Ethereum security community
- All contributors and supporters

---

**⚠️ Disclaimer**: This tool is provided as-is for educational and security research purposes. Users are responsible for complying with all applicable laws and regulations. The authors assume no liability for misuse.

**Made with ❤️ by the SmartContractAudit Team**
