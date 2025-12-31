---
title: "Onboarding Guide - CuberAi GitAntivirus"
description: "Step-by-step guide to getting started with SmartBrain orchestrator and GitAntivirus automation"
tags: [onboarding, tutorial, getting-started, smartbrain]
seo_keywords: "smart contract security onboarding, automated scanning setup, devsecops tutorial"
geo:
  country: "global"
---

# 🎓 Onboarding Guide

Welcome! This guide will walk you through setting up and using the **CuberAi GitAntivirus** system with the **SmartBrain orchestrator**.

## 🎯 What You'll Learn

By the end of this guide, you'll be able to:
- ✅ Run security scans on your smart contracts
- ✅ Generate automated security audits
- ✅ Monitor system health
- ✅ Use repair operations safely
- ✅ Integrate with CI/CD pipelines

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ Git installed
- ✅ Node.js 18+ installed
- ✅ pnpm installed (`npm install -g pnpm`)
- ✅ Terminal/command-line access
- ✅ Basic understanding of shell scripts

## 🚀 Step 1: Clone and Setup

### 1.1 Clone the Repository

```bash
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit
```

### 1.2 Verify Scripts

```bash
ls -la scripts/
# You should see:
# - master.sh (executable)
# - deploy-caster.sh (executable)
# - update-talents.sh (executable)
```

### 1.3 Make Scripts Executable (if needed)

```bash
chmod +x scripts/*.sh
```

## 🧪 Step 2: Your First Scan

### 2.1 Run SmartBrain Scan

```bash
./scripts/master.sh scan
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║  🧠 SmartBrain Orchestrator                              ║
║  Multi-Agent System for Smart Contract Security          ║
╚═══════════════════════════════════════════════════════════╝

[INFO] 🔍 Agent A: Scanning workspace...
[INFO] Workspace: /path/to/your/repo
[INFO] Scanning for:
  - Smart contracts (*.sol, *.rs, *.move)
  - Security patterns
  - Dependencies
  - Configuration files
[INFO] Found:
  - 0 contract files
  - 5 configuration files
[SUCCESS] Scan complete: logs/scan-20241231-020000.json
[INFO] DRY_RUN mode: true
[SUCCESS] Done! 🎉
```

### 2.2 Review Scan Results

```bash
cat logs/scan-*.json
```

**Example Output:**
```json
{
  "timestamp": "2024-12-31T02:00:00.000Z",
  "workspace": "/path/to/repo",
  "dry_run": true,
  "scan": {
    "contracts": 0,
    "configs": 5
  }
}
```

## 🔐 Step 3: Security Audit

### 3.1 Run Security Audit

```bash
./scripts/master.sh audit
```

### 3.2 Check Audit Results

```bash
cat logs/audit-*.json
```

## 💚 Step 4: Health Check

### 4.1 Run Health Check

```bash
./scripts/master.sh health
```

**This checks:**
- Node.js version
- pnpm version
- Git version
- System status

### 4.2 View Health Report

```bash
cat logs/health-*.json
```

**Example Output:**
```json
{
  "timestamp": "2024-12-31T02:00:00.000Z",
  "workspace": "/path/to/repo",
  "dry_run": true,
  "tools": {
    "node": "v20.10.0",
    "pnpm": "8.12.0",
    "git": "git version 2.43.0"
  },
  "status": "healthy"
}
```

## 🎯 Step 5: Full Orchestration

### 5.1 Run Complete Pipeline

```bash
./scripts/master.sh orchestrate
```

**This runs:**
1. Scan workspace
2. Security audit
3. Health check

All in sequence! 🎉

### 5.2 Review All Logs

```bash
ls -lt logs/
# Shows all recent logs, newest first
```

## 🔧 Step 6: Repair Operations (Advanced)

### 6.1 Run Repair (Dry-Run)

```bash
./scripts/master.sh repair
```

**Safety Note:** This runs in dry-run mode by default. No changes will be made.

### 6.2 Review Repair Config

```bash
cat config/repair.json
```

**Default Configuration:**
```json
{
  "auto_apply": false,
  "dry_run_default": true,
  "allowlist_orgs": [],
  "max_prs_per_run": 3,
  "pings_enabled": false
}
```

### 6.3 Understanding Repair Mode

- **Dry-run** (default): Simulates repairs, no actual changes
- **Live mode**: Applies repairs (requires explicit opt-in)

```bash
# Dry-run (safe)
./scripts/master.sh repair

# Live mode (use with caution)
DRY_RUN=false ./scripts/master.sh repair
```

## 🚀 Step 7: Deployment (Optional)

### 7.1 Build Talents Artifact

```bash
./scripts/update-talents.sh
```

### 7.2 Deploy to ENS (Template)

```bash
# Set secrets first (not in code!)
export CASTER_KEY="your_key_here"
export PROVIDER_URL="https://base.llamarpc.com"

# Run deployment
./scripts/deploy-caster.sh
```

**Note:** Deployment is a template. Review the script before using in production.

## 🤖 Step 8: Node Bot (Optional)

### 8.1 Install Bot Dependencies

```bash
cd node/bot
pnpm install
```

### 8.2 Run Bot (Dry-Run)

```bash
node index.js
```

### 8.3 Review Bot Summary

```bash
cat ../logs/summary.json
```

## 🔄 Step 9: CI/CD Integration

### 9.1 Enable GitAntivirus Workflow

The workflow is already configured in `.github/workflows/gitantivirus.yml`

### 9.2 Trigger Workflow

- **Automatically**: Create a PR or push to main/develop
- **Manually**: Go to Actions tab → GitAntivirus → Run workflow

### 9.3 Review Workflow Results

1. Go to GitHub Actions tab
2. Click on latest workflow run
3. Review scan/audit/health results
4. Download artifacts for detailed logs

## 📊 Step 10: Understanding Logs

### 10.1 Log Location

All logs are stored in `logs/` directory:
```
logs/
├── scan-20241231-020000.json
├── audit-20241231-020100.json
├── health-20241231-020200.json
└── repair-20241231-020300.json
```

### 10.2 Log Format

Each log contains:
- **timestamp**: ISO 8601 format
- **workspace**: Path to scanned directory
- **dry_run**: Whether changes were applied
- **results**: Operation-specific data

### 10.3 Cleaning Up Logs

```bash
# Remove old logs (older than 30 days)
find logs/ -name "*.json" -mtime +30 -delete

# Or keep only last 10
ls -t logs/*.json | tail -n +11 | xargs rm -f
```

## 🎨 Step 11: Customization

### 11.1 Environment Variables

```bash
# Verbose mode
VERBOSE=true ./scripts/master.sh scan

# Custom log directory
LOG_DIR=/tmp/logs ./scripts/master.sh scan

# Custom workspace
WORKSPACE=/path/to/contracts ./scripts/master.sh scan
```

### 11.2 Bot Configuration

Edit `config/repair.json`:
```json
{
  "auto_apply": false,
  "dry_run_default": true,
  "allowlist_orgs": ["SolanaRemix", "smsdao"],
  "max_prs_per_run": 5,
  "pings_enabled": false
}
```

### 11.3 Workflow Customization

Edit `.github/workflows/gitantivirus.yml` to:
- Change Node.js version
- Adjust workflow triggers
- Modify artifact retention
- Add custom steps

## 🎓 Step 12: Advanced Usage

### 12.1 Help Command

```bash
./scripts/master.sh --help
```

### 12.2 Port Cleanup

```bash
./scripts/master.sh cleanup-port 3000
```

### 12.3 Chain Operations

```bash
./scripts/master.sh scan && \
./scripts/master.sh audit && \
./scripts/master.sh health
```

## ✅ Onboarding Checklist

Track your progress:

- [ ] Cloned repository
- [ ] Made scripts executable
- [ ] Ran first scan
- [ ] Reviewed scan logs
- [ ] Ran security audit
- [ ] Ran health check
- [ ] Ran full orchestration
- [ ] Explored repair operations
- [ ] Tested Node bot (optional)
- [ ] Set up CI/CD integration
- [ ] Reviewed all documentation

## 🎉 Congratulations!

You've successfully completed the onboarding! 🚀

## 📚 Next Steps

1. **Read the Architecture**: [docs/architecture.md](../docs/architecture.md)
2. **Security Best Practices**: [docs/security.md](../docs/security.md)
3. **Detailed Usage**: [docs/usage.md](../docs/usage.md)
4. **Deployment Guide**: [docs/deploy-caster.md](../docs/deploy-caster.md)

## 💡 Pro Tips

- Always test in dry-run mode first
- Review logs regularly
- Keep scripts updated
- Use verbose mode for debugging
- Set up CI/CD for automated scans
- Customize config for your needs

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Permission denied" when running scripts  
**Solution**: Run `chmod +x scripts/*.sh`

**Issue**: "pnpm not found"  
**Solution**: Install with `npm install -g pnpm`

**Issue**: "Port already in use"  
**Solution**: Use `./scripts/master.sh cleanup-port 3000`

## 📞 Support

Need help?
- 📖 [README](README.md)
- 🏗️ [Architecture](../docs/architecture.md)
- 🔐 [Security](../docs/security.md)
- 🤖 [Node Bot](../node/README.md)

---

**Welcome to CuberAi GitAntivirus!** 🎉  
*Secure your smart contracts with confidence*
