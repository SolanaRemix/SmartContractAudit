---
title: "GitAntivirus Onboarding Guide"
description: "Step-by-step guide to onboard your repository to GitAntivirus security automation"
tags: ["onboarding", "tutorial", "getting-started", "gitantivirus"]
seo_keywords: "gitantivirus onboarding, security automation setup, smart contract audit onboarding"
---

# 🎓 GitAntivirus Onboarding Guide

> **Welcome!** This guide will walk you through setting up GitAntivirus security automation for your repository.

## ═══════════════════════════════════════════════════════════════
## 🎯 Prerequisites
## ═══════════════════════════════════════════════════════════════

Before you begin, ensure you have:

- ✅ Git installed (v2.0+)
- ✅ Node.js (v18+) and pnpm
- ✅ GitHub account with repository access
- ✅ Basic command line knowledge
- ⚠️ GitHub Personal Access Token (for write operations only)

## ═══════════════════════════════════════════════════════════════
## 📋 Step-by-Step Setup
## ═══════════════════════════════════════════════════════════════

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit

# Check current branch
git branch
```

**Expected Output:**
```
* gitantivirus-node
```

### Step 2: Verify Directory Structure

```bash
# List all directories
tree -L 2 -d
```

**Expected Structure:**
```
.
├── .github
│   └── workflows
├── autom
├── config
├── docs
├── node
│   ├── bot
│   └── logs
└── scripts
```

### Step 3: Make Scripts Executable

```bash
# Make all scripts executable
chmod +x scripts/*.sh

# Verify permissions
ls -la scripts/
```

**Expected Output:**
```
-rwxr-xr-x  master.sh
-rwxr-xr-x  deploy-caster.sh
-rwxr-xr-x  update-talents.sh
```

### Step 4: Install Bot Dependencies

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Navigate to bot directory
cd node/bot

# Install dependencies
pnpm install

# Return to root
cd ../..
```

### Step 5: Run Your First Security Scan

```bash
# Run security scan (dry-run mode)
./scripts/master.sh scan
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════════════════════
🧠 SmartBrain Orchestrator - Security Scan
═══════════════════════════════════════════════════════════════════════════
[INFO] Starting security scan...
[WARNING] DRY_RUN mode enabled - no files will be written
[INFO] Would scan repository for hardcoded secrets
[INFO] Would check for common vulnerabilities
```

### Step 6: Run Complete Audit

```bash
# Run all checks (dry-run mode)
./scripts/master.sh full
```

**This will execute:**
1. 🔍 Security Scan
2. 🔬 Code Audit
3. ❤️ Health Check

### Step 7: Test the Node BOT

```bash
# Navigate to bot directory
cd node/bot

# Run bot in dry-run mode
node index.js
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════════════════════
🤖 GitAntivirus BOT - Automated Security & Onboarding
═══════════════════════════════════════════════════════════════════════════
[INFO] Configuration:
  Mode: 🔒 DRY RUN
  Bot Pings: ❌ Disabled
  Allowlist Orgs: (none)
  Max PRs: 3
```

## ═══════════════════════════════════════════════════════════════
## 🔧 Advanced Configuration
## ═══════════════════════════════════════════════════════════════

### Enable File Writing (Live Mode)

```bash
# Run scan with file output
DRY_RUN=false ./scripts/master.sh scan

# Check generated reports
ls -la reports/
cat reports/security-scan.md
```

### Configure Bot Allowlist

```bash
# Set allowlist for specific organizations
export ALLOWLIST_ORGS="SolanaRemix,smsdao"

# Run bot with allowlist
cd node/bot
node index.js
```

### Enable Bot Pings (Use Responsibly!)

```bash
# Enable pings for SolanaRemix repositories only
export BOT_PINGS_ENABLED=true
export ALLOWLIST_ORGS="SolanaRemix"

# Run bot
node index.js
```

## ═══════════════════════════════════════════════════════════════
## 🎭 Example Agent Runs
## ═══════════════════════════════════════════════════════════════

### Example 1: Quick Security Check

```bash
# Scan for security issues
./scripts/master.sh scan

# Review output
echo "Check complete! Review console output for findings."
```

### Example 2: Full Repository Audit

```bash
# Enable verbose logging and run all checks
VERBOSE=true DRY_RUN=false ./scripts/master.sh full

# Check generated reports
ls -la reports/
```

### Example 3: Build and Prepare Deployment

```bash
# Build project and create artifacts
DRY_RUN=false ./scripts/update-talents.sh --live

# Verify artifact
cat build/talents.json | jq .
```

### Example 4: Dry-Run Deployment

```bash
# Test deployment without executing
./scripts/deploy-caster.sh --dry-run

# This shows what would be deployed without actually deploying
```

### Example 5: Bot Repository Discovery

```bash
cd node/bot

# Search for repositories with custom keywords
SEARCH_KEYWORDS="solana,rust,security" \
MIN_STARS=50 \
node index.js
```

## ═══════════════════════════════════════════════════════════════
## ⚙️ GitHub Actions Integration
## ═══════════════════════════════════════════════════════════════

### Workflow is Pre-Configured

The GitAntivirus workflow (`.github/workflows/gitantivirus.yml`) is already set up to run:

- ✅ On push to main/develop
- ✅ On pull requests
- ✅ Weekly on Mondays (scheduled)
- ✅ Manually via workflow_dispatch

### Trigger Manual Run

1. Go to repository on GitHub
2. Click **Actions** tab
3. Select **GitAntivirus** workflow
4. Click **Run workflow**
5. Select options:
   - Dry Run: true/false
   - Scan Type: scan/audit/health/full
6. Click **Run workflow** button

### Configure Secrets (Optional)

For write operations, add these secrets in repository settings:

1. Navigate to **Settings** → **Secrets and variables** → **Actions**
2. Add secrets:
   - `GH_TOKEN`: GitHub Personal Access Token
   - `CASTER_KEY`: Deployment key (optional)
   - `PROVIDER_URL`: RPC endpoint (optional)
   - `PROJECT_URL`: GitHub Projects URL (optional)

## ═══════════════════════════════════════════════════════════════
## 🛡️ Security Best Practices
## ═══════════════════════════════════════════════════════════════

### ✅ DO:
- Always test in dry-run mode first
- Review generated reports carefully
- Use environment variables for secrets
- Keep allowlist restrictive
- Monitor bot activity logs

### ❌ DON'T:
- Commit secrets to version control
- Enable pings without permission
- Run live mode without testing
- Ignore security warnings
- Bypass rate limits

## ═══════════════════════════════════════════════════════════════
## 📊 Monitoring & Logs
## ═══════════════════════════════════════════════════════════════

### Check Bot Logs

```bash
# View bot execution summary
cat node/logs/summary.json | jq .

# Check workflow artifacts
# Available in GitHub Actions → Workflow run → Artifacts
```

### Review Reports

```bash
# Security scan report
cat reports/security-scan.md

# Audit report
cat reports/audit-report.md

# Health check report
cat reports/health-check.md
```

## ═══════════════════════════════════════════════════════════════
## 🆘 Troubleshooting
## ═══════════════════════════════════════════════════════════════

### Issue: Scripts not executable
```bash
# Solution: Make executable
chmod +x scripts/*.sh
```

### Issue: Permission denied
```bash
# Solution: Check file permissions
ls -la scripts/
```

### Issue: Node modules not found
```bash
# Solution: Install dependencies
cd node/bot && pnpm install
```

### Issue: Cannot create reports
```bash
# Solution: Ensure DRY_RUN=false
DRY_RUN=false ./scripts/master.sh scan
```

## ═══════════════════════════════════════════════════════════════
## 🎓 Next Steps
## ═══════════════════════════════════════════════════════════════

1. ✅ Complete initial setup (you're here!)
2. 📖 Read [Architecture Documentation](../docs/architecture.md)
3. 🔍 Review [Usage Examples](../docs/usage.md)
4. 🛡️ Study [Security Guide](../docs/security.md)
5. 🚀 Try [Deployment Guide](../docs/deploy-caster.md)

## ═══════════════════════════════════════════════════════════════
## 💬 Getting Help
## ═══════════════════════════════════════════════════════════════

Need assistance? We're here to help!

- 📖 **Documentation**: Check `/docs` directory
- 🐛 **Issues**: Open a GitHub issue
- 💬 **Contact**: @SolanaRemix, @smsdao, @SmartBrain
- 🔗 **Community**: Join our Discord/Telegram

## ═══════════════════════════════════════════════════════════════
## 🎉 Congratulations!
## ═══════════════════════════════════════════════════════════════

You've successfully onboarded to GitAntivirus! 🎊

Your repository now has:
- ✅ Automated security scanning
- ✅ Code quality auditing
- ✅ Health monitoring
- ✅ Smart contract deployment tools
- ✅ Bot automation capabilities

Happy securing! 🛡️✨

---

**🧠 Powered by**: SmartBrain / SMSDAO  
**📅 Created**: 2025-12-31  
**📍 Status**: Production Ready
