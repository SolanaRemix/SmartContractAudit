# SmartContractAudit 🔒

[![GitHub Actions](https://github.com/SolanaRemix/SmartContractAudit/workflows/GitAntivirus%20Security%20Scan/badge.svg)](https://github.com/SolanaRemix/SmartContractAudit/actions)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Security](https://img.shields.io/badge/security-GitAntivirus-green.svg)](.github/workflows/gitantivirus.yml)

> **Automated security auditing and smart contract analysis powered by SmartBrain multi-agent orchestration**

SmartContractAudit is an advanced security framework that combines autonomous AI agents with comprehensive code analysis to provide automated auditing, vulnerability detection, and smart contract security validation.

## ✨ Features

- 🧠 **SmartBrain Orchestrator**: Multi-agent autonomous system for code quality and security
- 🛡️ **GitAntivirus**: Automated malware and vulnerability scanning
- 🔍 **Smart Contract Analysis**: Specialized auditing for Solidity contracts
- 🤖 **AI-Powered Agents**: Six specialized agents working in harmony
- 🔐 **Security-First**: Non-destructive scanning with comprehensive reporting
- ⚡ **CI/CD Integration**: Seamless GitHub Actions workflow
- 📊 **Detailed Reporting**: Audit reports and security summaries

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit

# Install dependencies (if package.json exists)
pnpm install

# Make scripts executable
chmod +x scripts/*.sh

# Run health check
scripts/master.sh health
```

### Basic Usage

```bash
# Run security scan
scripts/master.sh scan

# Run full audit
scripts/master.sh audit

# Run healing sequence
scripts/master.sh heal

# Check integrity
scripts/master.sh integrity
```

## 🧠 SmartBrain Agents

### Agent A - Code Auditor
Performs automated code quality checks, linting, testing, and generates comprehensive audit reports.

### Agent B - Fixer & Optimizer
Cleans hanging processes, synchronizes dependencies, and optimizes build processes.

### Agent C - Security & Compliance
Audits smart contracts for vulnerabilities, reentrancy issues, and compliance violations.

### Agent F - Health Monitor
Continuous monitoring of code health through linting, testing, and type checking.

### Agent X - Antivirus Scanner
Scans for malicious code patterns, suspicious files, and potential security threats.

## 📋 Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `audit` | Full audit with reporting | Before releases, weekly |
| `heal` | Fix issues and optimize | After errors, daily |
| `integrity` | Check ABI/SDK consistency | After contract updates |
| `health` | Run health diagnostics | Pre-commit, hourly |
| `scan` | Security & antivirus scan | Daily, before deployment |

## 🔒 Security Features

- **Non-Destructive by Default**: All operations run in DRY_RUN mode
- **Quarantine System**: Suspicious files isolated for review in `.quarantine/`
- **Pattern Detection**: Scans for malicious code patterns
- **Secret Detection**: Identifies exposed credentials
- **Comprehensive Logging**: All operations logged to `SMARTBRAIN.log`

## 📚 Documentation

- **[Welcome Guide](.github/ONBOARDING/WELCOME.md)**: Get started with the project
- **[Development Guide](.github/ONBOARDING/DEVELOPMENT.md)**: Developer setup and workflow
- **[SmartBrain Docs](docs/SMARTBRAIN.md)**: Detailed orchestrator documentation
- **[Security Policy](docs/SECURITY.md)**: Security practices and reporting
- **[Contributing Guide](CONTRIBUTING.md)**: How to contribute
- **[BOT Templates](.github/bots/README.md)**: Agent configuration reference

## 🔄 CI/CD Integration

GitAntivirus workflow automatically runs on:
- Push to main, gitantivirus-node, or feature branches
- Pull requests to main
- Daily at 2 AM UTC
- Manual workflow dispatch

```yaml
# Example: GitHub Actions integration
- name: Run SmartBrain Security Scan
  run: |
    chmod +x scripts/master.sh
    scripts/master.sh scan
```

## 🛠️ Architecture

```
SmartContractAudit/
├── .github/
│   ├── workflows/           # GitHub Actions (GitAntivirus)
│   ├── bots/               # SmartBrain agent configurations
│   └── ONBOARDING/         # Onboarding documentation
├── scripts/
│   └── master.sh           # SmartBrain orchestrator
├── docs/                   # Comprehensive documentation
├── src/                    # Source code (if applicable)
└── contracts/              # Smart contracts (if applicable)
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) and [Security Policy](docs/SECURITY.md) before submitting pull requests.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes and test: `scripts/master.sh health`
4. Commit with conventional commits: `feat: add new feature`
5. Push and create pull request

## 📊 Reporting

All operations generate detailed logs and reports:

- **SMARTBRAIN.log**: Real-time agent activity logs
- **AUDIT-REPORT.md**: Comprehensive audit summary
- **.quarantine/**: Suspicious files and scan results

## 🔧 Configuration

### Environment Variables

```bash
export DRY_RUN=true          # Non-destructive mode (default)
export PNPM=pnpm             # Package manager
export DEBUG=smartbrain:*    # Enable debug logging
```

### BOT Configuration

Agent configurations are stored in `.github/bots/` as JSON files:
- `agent-a-auditor.json`: Code auditor config
- `agent-b-healer.json`: Healer config
- `agent-x-antivirus.json`: Antivirus config

## 📈 Monitoring

View real-time logs:
```bash
# Follow SmartBrain logs
tail -f SMARTBRAIN.log

# Check quarantine directory
ls -la .quarantine/

# View audit report
cat AUDIT-REPORT.md
```

## ⚠️ Safety Notes

- All operations are **non-destructive by default**
- Port cleanup affects ports 3000-3010 and 4000
- Quarantined files require **manual review**
- No secrets or credentials should be committed
- Always review `.quarantine/` reports

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- SmartBrain multi-agent architecture
- GitAntivirus security framework
- All contributors and maintainers

## 📞 Support

- **Documentation**: See `docs/` directory
- **Issues**: [GitHub Issues](https://github.com/SolanaRemix/SmartContractAudit/issues)
- **Security**: See [SECURITY.md](docs/SECURITY.md) for vulnerability reporting

---

**Built with ❤️ for secure smart contract development**

*Autonomous • Secure • Non-destructive* 🧠🔒🚀
