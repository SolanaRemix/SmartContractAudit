# Welcome to SmartContractAudit! 🚀

Welcome to the SmartContractAudit project! This guide will help you get started with the SmartBrain orchestration system and GitAntivirus security framework.

## Quick Start

### Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- pnpm package manager (`npm install -g pnpm`)
- Git configured with your credentials
- Basic understanding of TypeScript/JavaScript
- (Optional) Solidity knowledge for smart contract work

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/SolanaRemix/SmartContractAudit.git
   cd SmartContractAudit
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Verify SmartBrain setup**
   ```bash
   chmod +x scripts/master.sh
   scripts/master.sh health
   ```

4. **Run your first security scan**
   ```bash
   scripts/master.sh scan
   ```

## Repository Structure

```
SmartContractAudit/
├── .github/
│   ├── workflows/         # GitHub Actions workflows
│   ├── bots/             # SmartBrain BOT configurations
│   └── ONBOARDING/       # Onboarding documentation
├── scripts/
│   └── master.sh         # SmartBrain orchestrator
├── contracts/            # Smart contracts (if applicable)
├── src/                  # Source code
└── README.md
```

## SmartBrain System Overview

SmartBrain is an autonomous multi-agent orchestration system with the following agents:

### Agent A - Code Auditor
- Performs automated code quality checks
- Analyzes TypeScript, JavaScript, and Solidity code
- Generates audit reports

### Agent B - Fixer & Optimizer
- Cleans up hanging processes and ports
- Synchronizes dependencies
- Optimizes build processes

### Agent C - Security & Compliance
- Audits smart contracts for vulnerabilities
- Checks for reentrancy and zero-address issues
- Ensures compliance with security standards

### Agent F - Health Check
- Runs linting and type checking
- Executes tests
- Validates overall project health

### Agent X - Antivirus Scanner
- Scans for malicious code patterns
- Detects potential security threats
- Quarantines suspicious files

## Common Commands

### SmartBrain Orchestrator

```bash
# Run full audit
scripts/master.sh audit

# Run healing sequence
scripts/master.sh heal

# Check repository integrity
scripts/master.sh integrity

# Perform health check
scripts/master.sh health

# Run antivirus scan
scripts/master.sh scan

# Show help
scripts/master.sh help
```

### Development Workflow

```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint

# Run tests
pnpm test

# Build project
pnpm build

# Run type checking
pnpm typecheck
```

## GitAntivirus Workflow

The GitAntivirus workflow runs automatically on:
- Push to main, gitantivirus-node, or feature branches
- Pull requests to main
- Daily at 2 AM UTC
- Manual trigger via GitHub Actions

All scans run in **DRY_RUN mode** by default (non-destructive).

## Safety Features

⚠️ **Important Safety Notes:**

1. **Non-Destructive by Default**: All scripts run in DRY_RUN mode unless explicitly configured otherwise
2. **No Secrets**: Never commit secrets, API keys, or credentials to the repository
3. **Quarantine System**: Suspicious files are isolated in `.quarantine/` for review
4. **Logging**: All agent activities are logged to `SMARTBRAIN.log`
5. **Port Safety**: Port cleanup only affects ports 3000-3010 and 4000

## Getting Help

- **Documentation**: Check `.github/bots/README.md` for BOT configuration details
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Security**: Report security vulnerabilities privately to the maintainers

## Next Steps

1. Read through the [BOT Configuration Guide](.github/bots/README.md)
2. Review the [Development Guidelines](DEVELOPMENT.md)
3. Explore the [Security Best Practices](SECURITY.md)
4. Join the team communication channels
5. Make your first contribution!

## Contributing

We welcome contributions! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure all tests pass (`scripts/master.sh health`)
5. Submit a pull request

## Code of Conduct

Please be respectful and professional in all interactions. We strive to maintain a welcoming and inclusive environment for all contributors.

---

**Ready to start?** Run `scripts/master.sh health` to verify your setup is complete! 🌟
