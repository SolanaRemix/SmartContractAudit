---
title: "GitAntivirus Usage Guide"
description: "Practical examples and workflows for using GitAntivirus security automation"
tags: ["usage", "examples", "workflows", "tutorial"]
seo_keywords: "gitantivirus usage, security automation examples, workflow guide, practical examples"
---

# 📖 GitAntivirus Usage Guide

> Practical examples and common workflows for security automation

## ═══════════════════════════════════════════════════════════════
## 🎯 Quick Start
## ═══════════════════════════════════════════════════════════════

### Run Your First Scan

```bash
# Navigate to repository
cd /path/to/SmartContractAudit

# Run security scan (dry-run)
./scripts/master.sh scan

# Run with file output
DRY_RUN=false ./scripts/master.sh scan

# View results
cat reports/security-scan.md
```

## ═══════════════════════════════════════════════════════════════
## 🔍 Security Scanning
## ═══════════════════════════════════════════════════════════════

### Basic Security Scan

```bash
# Dry-run mode (safe, no file changes)
./scripts/master.sh scan

# Live mode (creates reports)
DRY_RUN=false ./scripts/master.sh scan

# Verbose output
VERBOSE=true ./scripts/master.sh scan

# Custom output directory
OUTPUT_DIR=./my-reports DRY_RUN=false ./scripts/master.sh scan
```

### Advanced Security Scan

```bash
# Scan with all options
DRY_RUN=false \
VERBOSE=true \
OUTPUT_DIR=./security-reports \
./scripts/master.sh scan

# Review specific patterns
git grep -i "password\|secret\|api_key" -- ':!*.md'

# Check for TODO security items
git grep -i "TODO.*security\|FIXME.*security"
```

## ═══════════════════════════════════════════════════════════════
## 🔬 Code Auditing
## ═══════════════════════════════════════════════════════════════

### Repository Audit

```bash
# Run code audit
DRY_RUN=false ./scripts/master.sh audit

# View audit report
cat reports/audit-report.md

# Analyze specific metrics
find . -type f -name "*.js" | wc -l  # Count JS files
find . -type f -name "*.md" | wc -l  # Count docs
```

### Code Quality Checks

```bash
# Run full audit with verbose logging
VERBOSE=true DRY_RUN=false ./scripts/master.sh audit

# Check for large files
find . -type f -size +1M -not -path "*/\.git/*"

# Check for binary files
find . -type f -exec file {} \; | grep -i binary
```

## ═══════════════════════════════════════════════════════════════
## ❤️ Health Monitoring
## ═══════════════════════════════════════════════════════════════

### Basic Health Check

```bash
# Run health check
DRY_RUN=false ./scripts/master.sh health

# View health report
cat reports/health-check.md

# Check git status
git status --short
```

### Comprehensive Health Check

```bash
# Full health analysis
VERBOSE=true DRY_RUN=false ./scripts/master.sh health

# Check dependencies
if [ -f "package.json" ]; then
  npm outdated
fi

# Check for uncommitted changes
git diff --stat

# Check branch status
git branch -vv
```

## ═══════════════════════════════════════════════════════════════
## 🚀 Complete Analysis
## ═══════════════════════════════════════════════════════════════

### Run All Checks

```bash
# Run complete analysis suite
DRY_RUN=false ./scripts/master.sh full

# With verbose logging
VERBOSE=true DRY_RUN=false ./scripts/master.sh full

# Review all reports
ls -la reports/
cat reports/security-scan.md
cat reports/audit-report.md
cat reports/health-check.md
```

### Scheduled Analysis

```bash
# Create a cron job for weekly analysis
# Add to crontab -e:
0 0 * * 1 cd /path/to/SmartContractAudit && DRY_RUN=false ./scripts/master.sh full
```

## ═══════════════════════════════════════════════════════════════
## 🤖 Bot Operations
## ═══════════════════════════════════════════════════════════════

### Run Bot in Dry-Run Mode

```bash
cd node/bot

# Install dependencies (first time only)
pnpm install

# Run bot (dry-run by default)
node index.js

# View execution log
cat ../logs/summary.json
```

### Configure Bot for Specific Organizations

```bash
# Set environment variables
export ALLOWLIST_ORGS="SolanaRemix,smsdao"
export MAX_PRS_PER_RUN=5
export SEARCH_KEYWORDS="solana,rust,security"
export MIN_STARS=20

# Run bot
node index.js

# Check results
cat ../logs/summary.json | jq .
```

### Run Bot in Live Mode

```bash
# CAUTION: This will create actual PRs!
export GH_TOKEN="your_github_token_here"
export DRY_RUN=false
export ALLOWLIST_ORGS="YourOrg"
export BOT_PINGS_ENABLED=false  # Keep disabled for safety

# Run bot
node index.js

# Monitor progress
tail -f ../logs/summary.json
```

## ═══════════════════════════════════════════════════════════════
## 🔨 Build & Deploy
## ═══════════════════════════════════════════════════════════════

### Build Artifacts

```bash
# Dry-run (check what would be built)
./scripts/update-talents.sh --dry-run

# Live build
DRY_RUN=false ./scripts/update-talents.sh --live

# Verify artifact
ls -la build/
cat build/talents.json | jq .
```

### Deploy to Base Network

```bash
# Dry-run deployment (safe)
./scripts/deploy-caster.sh --dry-run

# Set deployment credentials
export CASTER_KEY="your_private_key"
export PROVIDER_URL="https://mainnet.base.org"

# Live deployment
DRY_RUN=false ./scripts/deploy-caster.sh --live

# Custom configuration
./scripts/deploy-caster.sh \
  --network=base \
  --ens=gxqstudio.eth \
  --artifact=./build/talents.json
```

## ═══════════════════════════════════════════════════════════════
## 📊 GitHub Actions Workflows
## ═══════════════════════════════════════════════════════════════

### Trigger Manual Workflow

1. Go to repository on GitHub
2. Navigate to **Actions** tab
3. Select **GitAntivirus** workflow
4. Click **Run workflow**
5. Configure options:
   - Dry Run: `true` or `false`
   - Scan Type: `scan`, `audit`, `health`, or `full`
6. Click **Run workflow** button

### Monitor Workflow Execution

```bash
# Using GitHub CLI
gh run list --workflow=gitantivirus.yml

# View specific run
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

### View Workflow Logs

1. Go to **Actions** tab
2. Click on workflow run
3. Click on job name
4. Expand step to view logs

## ═══════════════════════════════════════════════════════════════
## 🔧 Common Workflows
## ═══════════════════════════════════════════════════════════════

### Workflow 1: Daily Security Check

```bash
#!/bin/bash
# daily-security.sh

cd /path/to/SmartContractAudit

# Run security scan
DRY_RUN=false ./scripts/master.sh scan

# Check for issues
if grep -q "WARNING\|ERROR" reports/security-scan.md; then
  echo "Security issues found! Review reports/"
  exit 1
fi

echo "Security check passed!"
```

### Workflow 2: Pre-Commit Hook

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run quick security check
./scripts/master.sh scan

# Check for common issues
git diff --cached --name-only | while read file; do
  if grep -q "password\|secret" "$file"; then
    echo "Warning: Possible secret in $file"
  fi
done
```

### Workflow 3: PR Preparation

```bash
#!/bin/bash
# prepare-pr.sh

# Run full analysis
DRY_RUN=false VERBOSE=true ./scripts/master.sh full

# Build artifacts
DRY_RUN=false ./scripts/update-talents.sh --live

# Create summary
echo "## Security Analysis" > PR-SUMMARY.md
echo "" >> PR-SUMMARY.md
cat reports/security-scan.md >> PR-SUMMARY.md
echo "" >> PR-SUMMARY.md
cat reports/audit-report.md >> PR-SUMMARY.md

echo "PR summary created: PR-SUMMARY.md"
```

### Workflow 4: Automated Bot Run

```bash
#!/bin/bash
# run-bot-safely.sh

cd node/bot

# Always start with dry-run
echo "Running dry-run first..."
DRY_RUN=true node index.js

# Ask for confirmation
read -p "Proceed with live run? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
  echo "Running live mode..."
  export GH_TOKEN="$GITHUB_TOKEN"
  export DRY_RUN=false
  node index.js
else
  echo "Cancelled."
fi
```

## ═══════════════════════════════════════════════════════════════
## 📈 Monitoring & Reporting
## ═══════════════════════════════════════════════════════════════

### Generate Summary Report

```bash
#!/bin/bash
# generate-summary.sh

OUTPUT="SECURITY-SUMMARY-$(date +%Y%m%d).md"

{
  echo "# Security Summary - $(date +%Y-%m-%d)"
  echo ""
  echo "## Scan Results"
  if [ -f "reports/security-scan.md" ]; then
    cat reports/security-scan.md
  fi
  echo ""
  echo "## Audit Results"
  if [ -f "reports/audit-report.md" ]; then
    cat reports/audit-report.md
  fi
  echo ""
  echo "## Health Check"
  if [ -f "reports/health-check.md" ]; then
    cat reports/health-check.md
  fi
} > "$OUTPUT"

echo "Summary generated: $OUTPUT"
```

### Track Bot Activity

```bash
# View bot logs
cd node/logs

# Latest execution
cat summary.json | jq .

# Count repositories scanned
cat summary.json | jq .repositories_scanned

# List all results
cat summary.json | jq '.results[]'

# Filter errors
cat summary.json | jq '.results[] | select(.status == "error")'
```

## ═══════════════════════════════════════════════════════════════
## 🆘 Troubleshooting
## ═══════════════════════════════════════════════════════════════

### Debug Mode

```bash
# Enable verbose logging
VERBOSE=true ./scripts/master.sh scan

# Check script execution
bash -x ./scripts/master.sh scan

# Verify environment
env | grep -E "DRY_RUN|VERBOSE|OUTPUT_DIR"
```

### Common Issues

```bash
# Issue: Reports not generated
# Solution: Check DRY_RUN setting
echo "DRY_RUN=${DRY_RUN:-not set}"
DRY_RUN=false ./scripts/master.sh scan

# Issue: Permission denied
# Solution: Make scripts executable
chmod +x scripts/*.sh

# Issue: Bot not finding repositories
# Solution: Adjust search parameters
export SEARCH_KEYWORDS="your,keywords"
export MIN_STARS=5
cd node/bot && node index.js
```

## ═══════════════════════════════════════════════════════════════
## 📚 Additional Resources
## ═══════════════════════════════════════════════════════════════

- [Architecture](architecture.md) - System design details
- [Security Guide](security.md) - Security best practices
- [Deployment Guide](deploy-caster.md) - Deployment instructions
- [Onboarding](../autom/onboarding.md) - Getting started guide

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-31  
**Status**: Production Ready
