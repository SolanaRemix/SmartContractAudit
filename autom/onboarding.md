---
title: "GitAntivirus Automation & Onboarding"
description: "Complete guide to onboarding and using GitAntivirus automation tools"
tags: ["automation", "onboarding", "guide", "gitantivirus"]
seo_keywords: "gitantivirus onboarding, automation guide, smart contract security automation"
geo:
  country: "global"
---

# 🚀 GitAntivirus Automation & Onboarding

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    🎯 Welcome to GitAntivirus                             ║
║              Your Automated Smart Contract Security System                ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

Welcome to the GitAntivirus ecosystem! This guide will help you get started with our automated security scanning and improvement tools.

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Component Overview](#component-overview)
3. [Step-by-Step Setup](#step-by-step-setup)
4. [Running Agents](#running-agents)
5. [Advanced Configuration](#advanced-configuration)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 Quick Start

### Prerequisites

- ✅ Node.js 18+ installed
- ✅ pnpm or npm package manager
- ✅ Git repository access
- ✅ GitHub token (for bot operations)

### 5-Minute Setup

```bash
# 1. Clone repository
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit

# 2. Install dependencies (if package.json exists)
pnpm install

# 3. Make scripts executable
chmod +x scripts/*.sh

# 4. Run your first scan
./scripts/master.sh scan
```

---

## 🧩 Component Overview

### 1. 🧠 SmartBrain Orchestrator (`scripts/master.sh`)

Central coordination system with multiple agents:

- **Agent A:** Repository Scanner
- **Agent B:** Dependency Auditor
- **Agent C:** Security Analyzer
- **Agent D:** Code Quality Checker
- **Agent E:** Test Coverage Analyzer
- **Agent F:** Health Monitor

### 2. 🤖 Node Bot (`node/bot/`)

Automated GitHub scanner that:
- Searches for repositories
- Analyzes security issues
- Creates draft PRs with fixes
- Respects allowlist boundaries

### 3. ⚙️ GitHub Actions (`.github/workflows/`)

CI/CD pipelines for:
- Automated security scanning on PRs
- Scheduled repository audits
- Continuous monitoring

### 4. 🚀 Deployment Tools (`scripts/`)

- `deploy-caster.sh` - Deploy to ENS domains
- `update-talents.sh` - Build and validate artifacts

---

## 📋 Step-by-Step Setup

### Step 1: Environment Configuration

Create a `.env` file (never commit this!):

```bash
# GitHub Token (required for bot write operations)
GH_TOKEN=your_github_token_here

# Optional configurations
DRY_RUN=true
BOT_PINGS_ENABLED=false
ALLOWLIST_ORGS=SolanaRemix,smsdao
MAX_PRS_PER_RUN=3
STAR_THRESHOLD=10

# Deployment (if using)
CASTER_KEY=your_caster_key
PROVIDER_URL=https://mainnet.base.org
```

### Step 2: Run SmartBrain Agents

#### 🔍 Agent A: Repository Scan

```bash
./scripts/master.sh scan
```

**What it does:**
- Scans for smart contract files (*.sol, *.vy)
- Identifies configuration files
- Checks for security tools

**Example output:**
```
═══════════════════════════════════════════════════════════════════════════
  🔍 SCAN MODE
═══════════════════════════════════════════════════════════════════════════

ℹ️  [INFO] Found 5 smart contract files
ℹ️  [INFO] Found 12 configuration files
ℹ️  [INFO] Solhint config found
```

#### 🔒 Agent B+C: Security Audit

```bash
./scripts/master.sh audit
```

**What it does:**
- Audits npm/pip dependencies
- Scans for hardcoded secrets
- Identifies unsafe function calls
- Reports potential vulnerabilities

**Example output:**
```
═══════════════════════════════════════════════════════════════════════════
  🔒 AUDIT MODE
═══════════════════════════════════════════════════════════════════════════

🤖 [AGENT-B] Starting dependency audit...
ℹ️  [INFO] Auditing npm dependencies...
ℹ️  [INFO] Audit report saved to /tmp/audit-report.json

🤖 [AGENT-C] Starting security analysis...
⚠️  [WARNING] Potentially unsafe functions found
```

#### 💊 Agent F: Health Check

```bash
./scripts/master.sh health
```

**What it does:**
- Checks disk space
- Monitors memory usage
- Reports git status
- System diagnostics

**Example output:**
```
═══════════════════════════════════════════════════════════════════════════
  💊 HEALTH CHECK MODE
═══════════════════════════════════════════════════════════════════════════

🤖 [AGENT-F] Starting health monitoring...
✅ [SUCCESS] Disk usage OK: 45%
ℹ️  [INFO] Memory usage: 62%
ℹ️  [INFO] Git: 3 uncommitted changes
```

#### 📊 Full Analysis

```bash
./scripts/master.sh full
```

**What it does:**
- Runs ALL agents (A through F)
- Generates comprehensive report
- Cleans ports and installs dependencies
- Complete system analysis

### Step 3: Run Node Bot

```bash
cd node/bot
pnpm install
pnpm start
```

**Dry-run mode (default):**
```
═══════════════════════════════════════════════════════════════════════════
  🤖 GitAntivirus Node Bot
═══════════════════════════════════════════════════════════════════════════

ℹ️  [INFO] DRY_RUN: true
⚠️  [WARNING] 🧪 RUNNING IN DRY-RUN MODE - No PRs will be created

✅ [SUCCESS] Found 25 repositories matching criteria
✅ [SUCCESS] 15 repositories passed filters
ℹ️  [INFO] Processing 3 repositories...
```

**Enable live operations:**
```bash
DRY_RUN=false GH_TOKEN=$YOUR_TOKEN pnpm start
```

### Step 4: Build and Deploy

#### Build Artifacts

```bash
./scripts/update-talents.sh --no-dry-run
```

**What it does:**
- Runs build process (pnpm build)
- Validates output artifact
- Prepares for deployment

#### Deploy to ENS (Dry-Run)

```bash
./scripts/deploy-caster.sh --dry-run
```

**What it does:**
- Checks dependencies (caster CLI)
- Validates environment variables
- Shows deployment preview
- Does NOT deploy (dry-run)

#### Live Deployment

```bash
export CASTER_KEY=your_private_key
export PROVIDER_URL=https://mainnet.base.org
DRY_RUN=false ./scripts/deploy-caster.sh
```

---

## ⚙️ Advanced Configuration

### Custom Agent Selection

Run specific agents only:

```bash
./scripts/master.sh scan --agent=A
./scripts/master.sh audit --agent=B,C
```

### Verbose Output

Enable detailed logging:

```bash
./scripts/master.sh full --verbose
```

### Override Dry-Run

```bash
./scripts/master.sh audit --no-dry-run
```

### Bot Allowlist

Scan only specific organizations:

```bash
ALLOWLIST_ORGS="SolanaRemix,myorg" node bot/index.js
```

---

## 🔧 Troubleshooting

### Issue: "Permission denied" on scripts

**Solution:**
```bash
chmod +x scripts/*.sh
```

### Issue: "pnpm not found"

**Solution:**
```bash
npm install -g pnpm
```

### Issue: Bot not creating PRs

**Check:**
1. Is `DRY_RUN=false`?
2. Is `GH_TOKEN` set with write permissions?
3. Does token have repo and PR write access?

### Issue: "No repositories found"

**Check:**
1. Verify `SEARCH_KEYWORDS` are relevant
2. Lower `STAR_THRESHOLD`
3. Check GitHub API rate limits

---

## 📞 Getting Help

- 📖 [Architecture Documentation](../docs/architecture.md)
- 🔐 [Security Practices](../docs/security.md)
- 💡 [Usage Examples](../docs/usage.md)
- 🤖 [Bot Configuration](../node/bot/README.md)

---

## 🎉 Congratulations!

You're now ready to use GitAntivirus! Start with `./scripts/master.sh scan` and explore from there.

```
═══════════════════════════════════════════════════════════════════════════
🎯 Happy Scanning! | 🛡️ Stay Secure!
═══════════════════════════════════════════════════════════════════════════
```

---

*Last updated: 2025-12-31*
*Version: 1.0.0*
