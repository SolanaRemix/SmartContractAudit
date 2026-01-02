<<<<<<< HEAD
# CyberAi
Audis files contracts Antivirus on chain automation Ai workers
=======
# SmartContractAudit

Automated smart contract auditing and security for blockchain repositories - providing foundational security infrastructure for the SolanaRemix ecosystem.

## 🔐 Overview

SmartContractAudit provides core security functions, auditing scripts, and GitAntivirus workflow automation. This repository serves as the foundation for smart contract security, while the **CyberAi Bot** (separate repository) orchestrates advanced multi-bot operations.

## 🤖 CyberAi Architecture

For information about the CyberAi Bot ecosystem and how it integrates with SmartContractAudit:

- **[CyberAi Architecture Guide](docs/CYBERAI_ARCHITECTURE.md)** - Complete architecture overview
- **[CyberAi PR Merge Guide](docs/CYBERAI_PR_MERGE_GUIDE.md)** - Safe PR review and merge strategy
- **[CyberAi Setup Documentation](docs/cuberai-setup.md)** - Detailed setup instructions

### Quick Architecture Summary

```
SmartContractAudit (This Repo)    →    CyberAi Bot (Separate Repo)
├─ Smart contract functions            ├─ AI-powered orchestration
├─ Security scripts                    ├─ Multi-bot coordination
├─ GitAntivirus workflow               ├─ Advanced automation
├─ SmartBrain orchestrator             └─ DAO & governance
└─ Foundation infrastructure
```

**Key Principle**: SmartContracts stay in SmartContractAudit. CyberAi Bot orchestrates and coordinates.

## 🚀 Quick Start

### Scan CyberAi Related PRs

```bash
# Scan repository for all CyberAi/CuberAi references
./scripts/scan-cyberai-prs.sh
```

### Run SmartBrain Orchestrator

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Copy environment template
cp .env.example .env

# Run health check (dry-run mode)
DRY_RUN=true ./scripts/master.sh health

# Run audit
DRY_RUN=true ./scripts/master.sh audit
```

## 📚 Documentation

- **[TRIO.md](TRIO.md)** - Product, Governance, Security overview
- **[SECURITY.md](SECURITY.md)** - Security policies
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[GOVERNANCE.md](GOVERNANCE.md)** - Project governance

## 🔍 What to Clone First?

**Clone SmartContractAudit first** - it's the foundation repository that CyberAi Bot depends on.

See [CyberAi Architecture Guide](docs/CYBERAI_ARCHITECTURE.md) for complete cloning and deployment strategy.

## 🛡️ Security

Report security issues to: security@cuberai.example (placeholder)

See [SECURITY.md](SECURITY.md) for responsible disclosure process.

## 📖 Learn More

- [Resume/Project Overview](resume.md)
- [Release Process](RELEASE.md)
- [Partner Program](docs/partners/)
- [DAO Documentation](docs/dao/)

---

**License**: Apache-2.0  
**Organization**: SolanaRemix
>>>>>>> origin/pr12
