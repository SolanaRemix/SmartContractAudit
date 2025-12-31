---
title: "Automation Framework - CuberAi GitAntivirus"
description: "Complete automation framework for smart contract security with SmartBrain orchestrator"
tags: [automation, cuberai, gitantivirus, smartbrain, security, ci-cd]
seo_keywords: "smart contract automation, security pipeline, continuous security, devsecops"
geo:
  country: "global"
---

# 🤖 Automation Framework

Welcome to the **CuberAi GitAntivirus** automation framework! This comprehensive system provides automated security scanning, auditing, and deployment capabilities for smart contract projects.

## 🎯 What's Included

### 🧠 SmartBrain Orchestrator
Multi-agent command-line interface for security operations:
- **Agent A (Scan)**: Workspace scanning and file discovery
- **Agent B (Audit)**: Security vulnerability detection
- **Agent C (Health)**: System health monitoring
- **Agent D (Repair)**: Automated repair operations
- **Agent E (Deploy)**: Deployment preparation
- **Agent F (Orchestrate)**: Full pipeline orchestration

### 🔐 GitAntivirus Workflow
Automated CI/CD security pipeline that runs on:
- Pull requests (opened, synchronized, reopened)
- Pushes to main/develop branches
- Manual workflow dispatch

### 🤖 Node Bot System
Automated GitHub repository scanner:
- Discovers smart contract repositories
- Generates security improvement PRs
- Respects rate limits and ethics
- Dry-run by default

### 🚀 Deployment Tools
- **Caster Deploy**: ENS deployment to Base network
- **Talents Builder**: Artifact generation and validation

## 📚 Quick Start

### 1. Run Your First Scan

```bash
# Navigate to repository root
cd /path/to/your/repo

# Run SmartBrain scan
./scripts/master.sh scan

# Check the results
cat logs/scan-*.json
```

### 2. Run Security Audit

```bash
# Full security audit
./scripts/master.sh audit

# Review audit results
cat logs/audit-*.json
```

### 3. Health Check

```bash
# Check system health
./scripts/master.sh health

# View health report
cat logs/health-*.json
```

### 4. Full Pipeline

```bash
# Run complete orchestration
./scripts/master.sh orchestrate

# This runs: scan → audit → health
```

## 🎨 Banner Examples

All SmartBrain commands display beautiful banners:

```
╔═══════════════════════════════════════════════════════════╗
║  🧠 SmartBrain Orchestrator                              ║
║  Multi-Agent System for Smart Contract Security          ║
╚═══════════════════════════════════════════════════════════╝
```

## 🔐 Safety Features

- ✅ **DRY_RUN by default** - No destructive operations without opt-in
- ✅ **Colored output** - Easy-to-read console logging
- ✅ **JSON logs** - Machine-readable results in `logs/`
- ✅ **Error handling** - Graceful failures with helpful messages
- ✅ **Port cleanup** - Automatic conflict resolution
- ✅ **PNPM helpers** - Built-in package manager support

## 🚦 Usage Modes

### Dry-Run Mode (Default, Safe)

```bash
# All these run in dry-run by default
./scripts/master.sh scan
./scripts/master.sh audit
./scripts/master.sh repair
```

### Live Mode (Explicit Opt-In)

```bash
# Enable live mode with flag
./scripts/master.sh scan --live

# Or via environment variable
DRY_RUN=false ./scripts/master.sh scan
```

## 📊 Understanding Output

### Console Output

SmartBrain uses color-coded logging:
- 🔵 **[INFO]** - Informational messages
- 🟢 **[SUCCESS]** - Successful operations
- 🟡 **[WARN]** - Warnings (not errors)
- 🔴 **[ERROR]** - Error messages
- 🔷 **[DEBUG]** - Debug info (when VERBOSE=true)

### Log Files

All operations create JSON logs in `logs/`:
```
logs/
├── scan-20241231-020000.json
├── audit-20241231-020100.json
├── health-20241231-020200.json
└── repair-20241231-020300.json
```

Each log contains:
- Timestamp (ISO 8601)
- Workspace path
- DRY_RUN status
- Operation-specific results

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DRY_RUN` | Enable dry-run mode | `true` |
| `VERBOSE` | Enable verbose logging | `false` |
| `LOG_DIR` | Directory for logs | `./logs` |
| `WORKSPACE` | Working directory | Current directory |

### Config File

Edit `config/repair.json` for bot behavior:
```json
{
  "auto_apply": false,
  "dry_run_default": true,
  "allowlist_orgs": [],
  "max_prs_per_run": 3,
  "pings_enabled": false
}
```

## 🎓 Learning Path

1. **Start here**: [Onboarding Guide](onboarding.md)
2. **Architecture**: [System Architecture](../docs/architecture.md)
3. **Usage**: [Detailed Usage Guide](../docs/usage.md)
4. **Security**: [Security Practices](../docs/security.md)
5. **Deployment**: [Deployment Guide](../docs/deploy-caster.md)

## 💡 Tips & Tricks

### Enable Verbose Mode

```bash
VERBOSE=true ./scripts/master.sh scan
```

### Custom Log Directory

```bash
LOG_DIR=/tmp/smartbrain-logs ./scripts/master.sh orchestrate
```

### Port Cleanup Utility

```bash
# Clean up port 3000
./scripts/master.sh cleanup-port 3000

# Clean up custom port
./scripts/master.sh cleanup-port 8080
```

### Chain Commands

```bash
# Run multiple operations
./scripts/master.sh scan && \
./scripts/master.sh audit && \
./scripts/master.sh health
```

## 🐛 Troubleshooting

### "pnpm not found"

Install pnpm:
```bash
npm install -g pnpm
```

### "Permission denied"

Make scripts executable:
```bash
chmod +x scripts/*.sh
```

### "Port already in use"

Use the cleanup utility:
```bash
./scripts/master.sh cleanup-port 3000
```

## 📞 Support

- 📖 [Onboarding Guide](onboarding.md) - Step-by-step setup
- 🏗️ [Architecture Docs](../docs/architecture.md) - System design
- 🔐 [Security Guide](../docs/security.md) - Best practices
- 🤖 [Node Bot Guide](../node/README.md) - Bot automation

## 🎉 Next Steps

1. ✅ Complete the [onboarding guide](onboarding.md)
2. 🧪 Run your first scan
3. 📊 Review the logs
4. 🔐 Set up CI/CD with GitAntivirus
5. 🚀 Deploy with confidence

---

**Happy Automating!** 🚀  
*CuberAi GitAntivirus - Securing smart contracts with AI*
