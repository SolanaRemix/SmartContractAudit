---
title: "Usage Guide - CuberAi GitAntivirus"
description: "Comprehensive usage examples and guides for SmartBrain orchestrator and GitAntivirus automation"
tags: [usage, examples, guide, tutorial, how-to]
seo_keywords: "smart contract security usage, automated scanning guide, smartbrain examples"
geo:
  country: "global"
---

# 📖 Usage Guide

Comprehensive guide to using **CuberAi GitAntivirus** and the **SmartBrain orchestrator**.

## 🎯 Quick Reference

```bash
# Basic commands
./scripts/master.sh scan        # Scan workspace
./scripts/master.sh audit       # Security audit
./scripts/master.sh health      # Health check
./scripts/master.sh repair      # Repair operations
./scripts/master.sh deploy      # Deployment prep
./scripts/master.sh orchestrate # Full pipeline

# Utilities
./scripts/master.sh cleanup-port 3000  # Clean up port
./scripts/master.sh --help             # Show help

# Deployment
./scripts/update-talents.sh     # Build artifacts
./scripts/deploy-caster.sh      # Deploy to ENS
```

## 🔍 Agent A: Scan

### Basic Scan

```bash
./scripts/master.sh scan
```

**What it does:**
- Searches for smart contract files (`.sol`, `.rs`, `.move`)
- Counts configuration files (`.json`, `.toml`, `.yaml`)
- Creates JSON log in `logs/`

### With Custom Workspace

```bash
WORKSPACE=/path/to/contracts ./scripts/master.sh scan
```

### Verbose Mode

```bash
VERBOSE=true ./scripts/master.sh scan
```

### Example Output

```
╔═══════════════════════════════════════════════════════════╗
║  🧠 SmartBrain Orchestrator                              ║
║  Multi-Agent System for Smart Contract Security          ║
╚═══════════════════════════════════════════════════════════╝

[INFO] 🔍 Agent A: Scanning workspace...
[INFO] Workspace: /home/user/project
[INFO] Scanning for:
  - Smart contracts (*.sol, *.rs, *.move)
  - Security patterns
  - Dependencies
  - Configuration files
[INFO] Found:
  - 15 contract files
  - 8 configuration files
[SUCCESS] Scan complete: logs/scan-20241231-020000.json
[INFO] DRY_RUN mode: true
[SUCCESS] Done! 🎉
```

### Interpreting Results

```bash
cat logs/scan-*.json | jq
```

```json
{
  "timestamp": "2024-12-31T02:00:00.000Z",
  "workspace": "/home/user/project",
  "dry_run": true,
  "scan": {
    "contracts": 15,
    "configs": 8
  }
}
```

## 🔐 Agent B: Audit

### Basic Audit

```bash
./scripts/master.sh audit
```

**What it does:**
- Runs npm/pnpm audit (if package.json exists)
- Runs cargo audit (if Cargo.toml exists)
- Checks for security vulnerabilities
- Creates JSON log

### With Package Manager

```bash
# For npm/pnpm projects
./scripts/master.sh audit

# For Rust projects
# (automatically detects Cargo.toml)
./scripts/master.sh audit
```

### Live Mode (Actually Run Audits)

```bash
DRY_RUN=false ./scripts/master.sh audit
```

### Example Output

```
[INFO] 🔐 Agent B: Running security audit...
[INFO] Audit checks:
  - Dependency vulnerabilities
  - Common security patterns
  - Code quality issues
[INFO] Running npm/pnpm audit...
[SUCCESS] Audit complete: logs/audit-20241231-020000.json
```

## 💚 Agent C: Health

### Basic Health Check

```bash
./scripts/master.sh health
```

**Checks:**
- Node.js version
- pnpm version
- Git version
- System status

### Example Output

```
[INFO] 💚 Agent C: Health check...
[INFO] Checking system health:
  - Required tools availability
  - Build status
  - Test status
[INFO] Tools:
  - Node: v20.10.0
  - pnpm: 8.12.0
  - Git: git version 2.43.0
[SUCCESS] Health check complete: logs/health-20241231-020000.json
```

## 🔧 Agent D: Repair

### Dry-Run Repair (Safe)

```bash
./scripts/master.sh repair
```

**What it does:**
- Loads config from `config/repair.json`
- Simulates repair actions
- No actual changes made
- Creates JSON log

### Live Repair Mode

```bash
DRY_RUN=false ./scripts/master.sh repair
```

**⚠️ Warning**: This may make actual changes. Use with caution.

### Configuration

Edit `config/repair.json`:

```json
{
  "auto_apply": false,
  "dry_run_default": true,
  "allowlist_orgs": [],
  "max_prs_per_run": 3,
  "pings_enabled": false
}
```

### Example Output

```
[INFO] 🔧 Agent D: Running repair operations...
[INFO] Loading config: config/repair.json
[INFO] Repair mode: auto_apply=false, dry_run=true
[INFO] Running in safe mode - no changes will be applied
[SUCCESS] Repair complete: logs/repair-20241231-020000.json
```

## 🚀 Agent E: Deploy

### Deployment Preparation

```bash
./scripts/master.sh deploy
```

**What it does:**
- Checks build artifacts
- Validates environment configuration
- Tests network connectivity
- Creates JSON log

### Live Deployment Mode

```bash
DRY_RUN=false ./scripts/master.sh deploy
```

## 🎯 Agent F: Orchestrate

### Full Pipeline

```bash
./scripts/master.sh orchestrate
```

**Runs in sequence:**
1. Scan workspace
2. Security audit
3. Health check

### Custom Log Directory

```bash
LOG_DIR=/tmp/smartbrain ./scripts/master.sh orchestrate
```

### Example Output

```
[INFO] 🎯 Agent F: Orchestrating multi-agent workflow...
╔═══════════════════════════════════════════════════════════╗
║  🧠 SmartBrain Orchestrator                              ║
║  Multi-Agent System for Smart Contract Security          ║
╚═══════════════════════════════════════════════════════════╝

[INFO] Running full pipeline:
  1. Scan workspace
  2. Run security audit
  3. Health check
  4. Repair (if needed)
  5. Deploy preparation

[INFO] 🔍 Agent A: Scanning workspace...
[SUCCESS] Scan complete: logs/scan-20241231-020000.json

[INFO] 🔐 Agent B: Running security audit...
[SUCCESS] Audit complete: logs/audit-20241231-020100.json

[INFO] 💚 Agent C: Health check...
[SUCCESS] Health check complete: logs/health-20241231-020200.json

[SUCCESS] Orchestration complete!
[INFO] Review logs in: logs/
```

## 🛠️ Utilities

### Port Cleanup

```bash
# Clean up port 3000
./scripts/master.sh cleanup-port 3000

# Clean up custom port
./scripts/master.sh cleanup-port 8080
```

### Help Command

```bash
./scripts/master.sh --help
```

## 🔨 Deployment Tools

### Build Talents Artifact

```bash
./scripts/update-talents.sh
```

**What it does:**
- Checks for package.json
- Runs `pnpm build` if available
- Creates `build/talents.json`
- Validates artifact

#### Live Build

```bash
DRY_RUN=false ./scripts/update-talents.sh
```

#### With Custom Directories

```bash
BUILD_DIR=/tmp/build ./scripts/update-talents.sh
```

### Deploy to ENS (Caster)

```bash
# Set required secrets
export CASTER_KEY="your_key_here"
export PROVIDER_URL="https://base.llamarpc.com"

# Run deployment
./scripts/deploy-caster.sh
```

#### Dry-Run (Default)

```bash
./scripts/deploy-caster.sh
```

#### Live Deployment

```bash
DRY_RUN=false CASTER_KEY=xxx PROVIDER_URL=yyy ./scripts/deploy-caster.sh
```

#### Custom ENS and Network

```bash
ENS_NAME=custom.eth NETWORK=mainnet ./scripts/deploy-caster.sh
```

## 🤖 Node Bot Usage

### Install Dependencies

```bash
cd node/bot
pnpm install
```

### Run Bot (Dry-Run)

```bash
node index.js
```

### Live Mode with Token

```bash
GH_TOKEN=ghp_xxx DRY_RUN=false node index.js
```

### With Allowlist

```bash
ALLOWLIST_ORGS="SolanaRemix,smsdao" node index.js
```

### Custom Configuration

```bash
DRY_RUN=true \
BOT_PINGS_ENABLED=false \
ALLOWLIST_ORGS="SolanaRemix" \
MAX_PRS_PER_RUN=5 \
STAR_THRESHOLD=50 \
SEARCH_KEYWORDS="solana anchor spl" \
node index.js
```

### Review Bot Summary

```bash
cat ../logs/summary.json | jq
```

## 🔄 CI/CD Usage

### Trigger Workflow Manually

1. Go to GitHub Actions tab
2. Select "GitAntivirus - SmartBrain Security Workflow"
3. Click "Run workflow"
4. Configure options:
   - `dry_run`: true/false
   - `bot_pings_enabled`: true/false
5. Click "Run workflow"

### Automatic Triggers

Workflow runs automatically on:
- Pull request (opened, synchronized, reopened)
- Push to main/develop branches

### View Workflow Results

1. Go to Actions tab
2. Click on workflow run
3. Review steps and logs
4. Download artifacts for detailed reports

### PR Comments

The workflow automatically posts a sticky comment on PRs with:
- Scan results
- Security checks status
- Artifact links
- Configuration details

## 📊 Log Analysis

### View Recent Logs

```bash
ls -lt logs/
```

### Parse JSON Logs

```bash
# Pretty print
cat logs/scan-*.json | jq

# Extract specific field
cat logs/scan-*.json | jq '.scan.contracts'

# Combine multiple logs
jq -s '.' logs/*.json
```

### Clean Up Old Logs

```bash
# Remove logs older than 30 days
find logs/ -name "*.json" -mtime +30 -delete

# Keep only last 10 logs
ls -t logs/*.json | tail -n +11 | xargs rm -f
```

## 🎨 Advanced Usage

### Chain Multiple Commands

```bash
./scripts/master.sh scan && \
./scripts/master.sh audit && \
./scripts/master.sh health && \
echo "All checks passed!"
```

### Conditional Execution

```bash
# Only run audit if scan succeeds
./scripts/master.sh scan && ./scripts/master.sh audit
```

### Background Execution

```bash
# Run orchestration in background
nohup ./scripts/master.sh orchestrate > orchestrate.log 2>&1 &
```

### Scheduled Execution (Cron)

```bash
# Add to crontab
# Run daily at 2 AM
0 2 * * * cd /path/to/repo && ./scripts/master.sh orchestrate
```

## 🔐 Environment Variables Reference

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `DRY_RUN` | Enable dry-run mode | `true` | `DRY_RUN=false` |
| `VERBOSE` | Enable verbose logging | `false` | `VERBOSE=true` |
| `LOG_DIR` | Directory for logs | `./logs` | `LOG_DIR=/tmp/logs` |
| `WORKSPACE` | Working directory | `$(pwd)` | `WORKSPACE=/path/to/project` |
| `GH_TOKEN` | GitHub token | - | `GH_TOKEN=ghp_xxx` |
| `CASTER_KEY` | Caster deployment key | - | `CASTER_KEY=xxx` |
| `PROVIDER_URL` | RPC endpoint | - | `PROVIDER_URL=https://...` |
| `ENS_NAME` | Target ENS name | `gxqstudio.eth` | `ENS_NAME=custom.eth` |
| `NETWORK` | Target network | `base` | `NETWORK=mainnet` |
| `BOT_PINGS_ENABLED` | Enable bot mentions | `false` | `BOT_PINGS_ENABLED=true` |
| `ALLOWLIST_ORGS` | Allowed orgs (comma-separated) | `''` | `ALLOWLIST_ORGS=org1,org2` |
| `MAX_PRS_PER_RUN` | Max PRs per run | `3` | `MAX_PRS_PER_RUN=5` |

## 📚 Integration Examples

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash
./scripts/master.sh scan
./scripts/master.sh audit
```

### CI/CD Pipeline (Generic)

```yaml
# .gitlab-ci.yml (example)
security_scan:
  script:
    - ./scripts/master.sh orchestrate
  artifacts:
    paths:
      - logs/
```

### Docker Integration

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN chmod +x scripts/*.sh
CMD ["./scripts/master.sh", "orchestrate"]
```

## 💡 Tips and Tricks

### 1. Quick Health Check

```bash
alias health="./scripts/master.sh health"
```

### 2. Watch Logs in Real-Time

```bash
watch -n 5 'ls -lt logs/ | head -10'
```

### 3. Color Output in CI

```bash
# Force color output
FORCE_COLOR=1 ./scripts/master.sh scan
```

### 4. Parallel Execution

```bash
# Run scan and health in parallel
./scripts/master.sh scan & ./scripts/master.sh health & wait
```

### 5. Create Aliases

```bash
# Add to ~/.bashrc or ~/.zshrc
alias sb="./scripts/master.sh"
alias sb-scan="./scripts/master.sh scan"
alias sb-audit="./scripts/master.sh audit"
alias sb-health="./scripts/master.sh health"
```

## 🐛 Troubleshooting

See [Security Guide](security.md) for security-specific issues and [Onboarding Guide](../autom/onboarding.md) for setup issues.

---

**Usage Guide Version**: 1.0.0  
**Last Updated**: 2024-12-31
