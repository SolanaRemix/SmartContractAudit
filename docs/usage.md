---
title: "GitAntivirus Usage Guide"
description: "Practical examples and usage patterns for GitAntivirus"
tags: ["usage", "examples", "guide"]
seo_keywords: "gitantivirus usage, how to use gitantivirus, security scanning examples"
---

# 📖 GitAntivirus Usage Guide

## Common Usage Patterns

### 1. Quick Security Scan

Scan your repository for common security issues:

```bash
./scripts/master.sh scan
```

**Use when:**
- Starting a new audit
- Quick vulnerability check
- Before committing changes

**Output:**
- Count of smart contract files
- Configuration files discovered
- Security tool detection

---

### 2. Full Dependency Audit

Audit all dependencies for known vulnerabilities:

```bash
./scripts/master.sh audit
```

**Use when:**
- Updating dependencies
- Security compliance review
- Before production deployment

**Output:**
- npm/pip vulnerability report
- Hardcoded secret detection
- Unsafe function identification

---

### 3. System Health Check

Monitor system health and repository status:

```bash
./scripts/master.sh health
```

**Use when:**
- CI/CD health checks
- Pre-deployment verification
- System diagnostics

**Output:**
- Disk usage metrics
- Memory consumption
- Git repository status

---

### 4. Comprehensive Report

Generate a complete security analysis:

```bash
./scripts/master.sh report --verbose
```

**Use when:**
- Compliance audits
- Security reviews
- Stakeholder reporting

**Output:**
- All agent reports combined
- Detailed findings
- Recommendations

---

### 5. Full Analysis Pipeline

Run complete analysis with all components:

```bash
./scripts/master.sh full
```

**Use when:**
- Initial repository onboarding
- Quarterly security reviews
- Major version releases

**What it does:**
1. Cleans up ports
2. Installs dependencies
3. Runs all 6 agents (A-F)
4. Generates comprehensive report

---

## Node Bot Usage

### Safe Exploration (Dry-Run)

```bash
cd node/bot
pnpm install
pnpm start
```

**Result:** Analyzes repositories, logs findings, creates NO PRs

### Live Operations

```bash
export GH_TOKEN=your_github_token
DRY_RUN=false pnpm start
```

**Result:** Creates draft PRs for security fixes

### Filtered Scanning

```bash
ALLOWLIST_ORGS="SolanaRemix,MyOrg" pnpm start
```

**Result:** Only scans allowed organizations

### Adjust Rate Limits

```bash
MAX_PRS_PER_RUN=5 pnpm start
```

**Result:** Creates up to 5 PRs instead of default 3

---

## Deployment Workflows

### Build Artifacts

```bash
# Dry-run build check
./scripts/update-talents.sh --dry-run

# Actual build
./scripts/update-talents.sh --no-dry-run
```

**Output:** `build/talents.json`

### Test Deployment

```bash
export CASTER_KEY=your_key
export PROVIDER_URL=https://mainnet.base.org
./scripts/deploy-caster.sh --dry-run
```

**Result:** Shows what would be deployed without executing

### Production Deployment

```bash
DRY_RUN=false ./scripts/deploy-caster.sh --network=base --ens=gxqstudio.eth
```

**Result:** Deploys to ENS domain on Base network

---

## CI/CD Integration

### GitHub Actions - Pull Request

Add to your workflow:

```yaml
- name: Run Security Scan
  run: ./scripts/master.sh audit
```

### GitHub Actions - Scheduled

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./scripts/master.sh full
```

### GitLab CI

```yaml
security_scan:
  stage: test
  script:
    - chmod +x scripts/master.sh
    - ./scripts/master.sh audit
  artifacts:
    paths:
      - reports/
```

---

## Advanced Usage

### Custom Agent Selection

Run specific agents only:

```bash
# Only run repository scanner
./scripts/master.sh scan --agent=A

# Run security agents only
./scripts/master.sh audit --agent=B,C
```

### Verbose Logging

```bash
./scripts/master.sh full --verbose
```

**Output:** Detailed debug information for troubleshooting

### Override Dry-Run Globally

```bash
export DRY_RUN=false
./scripts/master.sh audit
```

---

## Real-World Examples

### Example 1: Pre-Commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
echo "Running security scan..."
./scripts/master.sh scan
if [ $? -ne 0 ]; then
    echo "Security scan failed!"
    exit 1
fi
```

### Example 2: Weekly Security Report

Cron job:

```bash
# Run every Monday at 9 AM
0 9 * * 1 cd /path/to/repo && ./scripts/master.sh report > weekly-report.txt
```

### Example 3: Automated PR Scanning

GitHub Action trigger:

```yaml
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: |
          chmod +x scripts/master.sh
          ./scripts/master.sh audit --verbose
```

### Example 4: Multi-Repository Bot Scan

```bash
#!/bin/bash
# Scan multiple organizations
for org in "SolanaRemix" "MyOrg" "AnotherOrg"; do
    ALLOWLIST_ORGS=$org node bot/index.js
    sleep 60  # Rate limit friendly
done
```

---

## Output Interpretation

### Scan Results

```
ℹ️  [INFO] Found 5 smart contract files
```
**Meaning:** 5 Solidity or Vyper files detected

```
⚠️  [WARNING] Potentially unsafe functions found
```
**Action Required:** Review identified functions

```
✅ [SUCCESS] Dependencies installed
```
**Status:** Operation completed successfully

### Health Metrics

```
✅ [SUCCESS] Disk usage OK: 45%
```
**Status:** Plenty of disk space available

```
⚠️  [WARNING] Disk usage is high: 85%
```
**Action Required:** Free up disk space

---

## Tips & Best Practices

### 1. Always Start with Dry-Run

```bash
# Test first
DRY_RUN=true ./scripts/deploy-caster.sh

# Then execute
DRY_RUN=false ./scripts/deploy-caster.sh
```

### 2. Use Verbose Mode for Debugging

```bash
./scripts/master.sh full --verbose
```

### 3. Review Logs Regularly

```bash
cat node/logs/summary.json | jq .stats
```

### 4. Combine Commands

```bash
./scripts/master.sh audit && ./scripts/update-talents.sh && ./scripts/deploy-caster.sh --dry-run
```

### 5. Set Up Aliases

Add to `.bashrc` or `.zshrc`:

```bash
alias gv-scan='./scripts/master.sh scan'
alias gv-audit='./scripts/master.sh audit'
alias gv-full='./scripts/master.sh full --verbose'
```

---

## Troubleshooting Common Issues

### Issue: Scripts not executable

```bash
chmod +x scripts/*.sh
```

### Issue: pnpm command not found

```bash
npm install -g pnpm
```

### Issue: GitHub API rate limit

**Solution:** Authenticate your requests:
```bash
export GH_TOKEN=your_token
```

### Issue: Port conflicts

```bash
# SmartBrain automatically cleans ports
./scripts/master.sh full
```

---

## Next Steps

- Review [Security Best Practices](./security.md)
- Understand [System Architecture](./architecture.md)
- Deploy with [Caster Guide](./deploy-caster.md)

---

*Usage Guide Version: 1.0.0*
*Last Updated: 2025-12-31*
