---
title: "Node Bot System - CuberAi GitAntivirus"
description: "Automated bot templates for smart contract security scanning and PR generation"
tags: [node, bot, automation, security, smartbrain, gitantivirus]
seo_keywords: "smart contract security, automated scanning, github bot, cuberai, gitantivirus"
geo:
  country: "global"
---

# 🤖 Node Bot System

## Overview

The Node Bot System is a collection of automated tools for discovering, scanning, and securing smart contract repositories across GitHub. Built with safety and ethics in mind, all bots default to **dry-run mode** and require explicit configuration for write operations.

## Components

| Name | Type | Purpose | Trigger | Status | Notes |
|------|------|---------|---------|--------|-------|
| **SmartBrain Orchestrator** | Shell Script | Multi-agent CLI for scan/audit/health/repair/deploy | Manual / CI | ✅ Active | See `scripts/master.sh` |
| **Node Bot** | Node.js | GitHub repo scanner & PR generator | Scheduled / Manual | 🔒 Template | Dry-run by default |
| **GitAntivirus Workflow** | GitHub Actions | CI/CD security pipeline | PR / Push | ✅ Active | See `.github/workflows/gitantivirus.yml` |
| **Caster Deploy** | Shell Script | ENS deployment to Base network | Manual | 🔒 Template | Requires secrets |
| **Talents Builder** | Shell Script | Build deployment artifacts | Manual | 🔒 Template | Safe by default |

## 🚀 Quick Start

### Running the Node Bot

```bash
# Install dependencies
cd node/bot
pnpm install

# Run in dry-run mode (default, safe)
node index.js

# Run with custom configuration
DRY_RUN=true BOT_PINGS_ENABLED=false node index.js

# Live mode (requires GH_TOKEN)
DRY_RUN=false GH_TOKEN=your_token node index.js
```

### Using SmartBrain Orchestrator

```bash
# Scan workspace
./scripts/master.sh scan

# Run security audit
./scripts/master.sh audit

# Full pipeline
./scripts/master.sh orchestrate
```

## 🔐 Security & Ethics

- **Dry-run by default**: No write operations without explicit opt-in
- **No secrets in code**: All tokens must be provided via environment variables
- **Opt-in pings**: Bot mentions are disabled by default
- **Conservative limits**: Maximum 3 PRs per run by default
- **Allowlist support**: Filter repositories by organization
- **Draft PRs only**: No auto-merge capabilities

## 📚 Documentation

- [Bot Behavior & Configuration](bot/README.md)
- [PR Template](PR_TEMPLATE.md)
- [Workflow Template](node.yml)

## 🛠️ Configuration

All configuration is done via environment variables or config files:

- `config/repair.json` - Global bot configuration
- Environment variables (see bot/README.md for details)

## 📊 Monitoring

Logs and summaries are stored in:
- `node/logs/summary.json` - Bot execution summaries
- `logs/` - SmartBrain orchestrator logs

## 🤝 Contributing

When adding new bot capabilities:
1. Maintain dry-run as default
2. Document all environment variables
3. Add safety checks and validations
4. Update this README with new components
5. Follow existing code patterns

## 📄 License

Part of the SmartContractAudit project.
