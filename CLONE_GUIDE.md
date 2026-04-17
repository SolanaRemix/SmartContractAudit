# CyberAi Repository Cloning Guide

## Quick Answer: What to Clone First?

**Clone SmartContractAudit repository from the main branch** - This is the foundation repository.

```bash
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit
git checkout main
```

## Understanding the Repository Structure

### SmartContractAudit (This Repository)
- **Branch**: `main` (production-ready)
- **Purpose**: Core smart contract security infrastructure
- **Status**: Foundation repository - clone this FIRST

### What's in Main Branch

The `main` branch contains:
- ✅ Core security scripts (`scripts/master.sh`, `scripts/audit.sh`)
- ✅ GitAntivirus workflows
- ✅ SmartBrain orchestrator
- ✅ Documentation (TRIO.md, SECURITY.md, etc.)
- ✅ DAO and governance structure
- ✅ All optimized and tested features

## Complete Cloning Instructions

### Step 1: Clone SmartContractAudit (Main Branch)

```bash
# Clone the repository
git clone https://github.com/SolanaRemix/SmartContractAudit.git

# Navigate into the directory
cd SmartContractAudit

# Verify you're on main branch
git branch

# Should show: * main
```

### Step 2: Verify the Clone

```bash
# Check the structure
ls -la

# You should see:
# - .github/workflows/
# - scripts/
# - docs/
# - TRIO.md
# - SECURITY.md
# - README.md
# etc.

# Run the scanner to see CyberAi integration
./scripts/scan-cyberai-prs.sh
```

### Step 3: Set Up Environment

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Copy environment template
cp .env.example .env

# Edit if needed (optional)
nano .env

# Set dry-run mode for safety
echo "DRY_RUN=true" >> .env
```

### Step 4: Test the Installation

```bash
# Run health check
DRY_RUN=true ./scripts/master.sh health

# Run audit (dry-run mode)
DRY_RUN=true ./scripts/master.sh audit

# Scan for CyberAi references
./scripts/scan-cyberai-prs.sh
```

## Understanding Branches

### Main Branch (Recommended)
- **Status**: Production-ready, optimized
- **What to use it for**: Deploying, production use, stable features
- **Clone command**: `git checkout main`

### Feature Branches
Feature branches like `copilot/optimize-cyberai-workflow` contain:
- Work in progress
- New features being developed
- May not be fully tested

**For production use, always use `main` branch.**

## All Related Repositories

### 1. SmartContractAudit (Clone First) ✅
```bash
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit
git checkout main
```

**Contains**:
- Smart contract security functions
- Core auditing scripts
- GitAntivirus workflow
- SmartBrain orchestrator (master.sh)
- Base infrastructure

### 2. CyberAi (Clone Second - If It Exists)
**Note**: As of now, this repository may not yet be created.

When created, it will contain:
- CyberAi Bot orchestration
- Advanced AI-powered automation
- Multi-bot coordination
- DAO token management
- Web interfaces

**Future clone command** (when available):
```bash
git clone https://github.com/SolanaRemix/CyberAi.git
cd CyberAi
git checkout main
```

## One Main Branch Strategy

The optimized version is always on the **main branch** of each repository.

### Why Main Branch?

1. **Stability**: Main branch is tested and stable
2. **Optimization**: All features are optimized
3. **Documentation**: Complete and up-to-date docs
4. **Security**: Security reviewed and approved
5. **Production-Ready**: Safe for deployment

### Avoid Feature Branches for Production

Feature branches (like `copilot/*`, `feature/*`, etc.) are:
- ❌ Work in progress
- ❌ May have bugs
- ❌ Not fully documented
- ❌ Not security reviewed

**Always use `main` branch for production deployments.**

## Cloning Strategy Diagram

```
┌─────────────────────────────────────┐
│  Step 1: Clone SmartContractAudit   │
│  git clone SolanaRemix/SmartContract│
│  git checkout main                  │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 2: Verify & Setup             │
│  ./scripts/scan-cyberai-prs.sh      │
│  chmod +x scripts/*.sh              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 3: Test                       │
│  DRY_RUN=true ./scripts/master.sh   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Step 4: (Optional) Clone CyberAi   │
│  When CyberAi repo exists           │
│  git clone SolanaRemix/CyberAi      │
│  git checkout main                  │
└─────────────────────────────────────┘
```

## Keeping Your Clone Updated

### Update SmartContractAudit

```bash
cd SmartContractAudit

# Fetch latest changes
git fetch origin main

# Switch to main if not already there
git checkout main

# Pull latest changes
git pull origin main

# Verify update
git log --oneline -5
```

### Sync Both Repositories (When CyberAi Exists)

```bash
# Update SmartContractAudit
cd /path/to/SmartContractAudit
git checkout main
git pull origin main

# Update CyberAi
cd /path/to/CyberAi
git checkout main
git pull origin main
```

## Troubleshooting

### Issue: "Branch main does not exist"

**Solution**:
```bash
git fetch origin
git checkout -b main origin/main
```

### Issue: "Permission denied"

**Solution**:
```bash
# Make sure you have read access to the repository
# If using SSH, set up SSH keys
# If using HTTPS, use personal access token
```

### Issue: "Repository not found"

**Solution**:
- Verify the repository URL
- Check your GitHub access permissions
- Ensure the repository exists

### Issue: "Scripts not executable"

**Solution**:
```bash
chmod +x scripts/*.sh
```

## Best Practices

### 1. Always Clone from Main Branch
```bash
# Good
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit
git checkout main

# Avoid (for production)
git checkout feature-branch
```

### 2. Use Dry-Run Mode for Testing
```bash
# Always test in dry-run first
DRY_RUN=true ./scripts/master.sh health
DRY_RUN=true ./scripts/master.sh audit
```

### 3. Keep Your Clone Updated
```bash
# Regularly pull updates
git pull origin main
```

### 4. Don't Modify Main Branch Directly
```bash
# If you need to make changes, create a feature branch
git checkout -b my-feature
# Make changes
git commit -am "My changes"
# Push to remote
git push origin my-feature
# Create PR to merge into main
```

### 5. Verify After Cloning
```bash
# Run scanner to verify setup
./scripts/scan-cyberai-prs.sh

# Run health check
DRY_RUN=true ./scripts/master.sh health
```

## Summary

**Quick Start**:
```bash
# 1. Clone
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit

# 2. Verify main branch
git branch

# 3. Setup
chmod +x scripts/*.sh

# 4. Test
DRY_RUN=true ./scripts/master.sh health

# 5. Scan
./scripts/scan-cyberai-prs.sh
```

**Remember**:
- ✅ Clone SmartContractAudit FIRST
- ✅ Always use `main` branch for production
- ✅ Test with DRY_RUN=true first
- ✅ Keep your clone updated with `git pull origin main`
- ✅ CyberAi repository (when it exists) is cloned SECOND

**Need Help?**:
- Read: `cat CYBERAI_README.md`
- Scan: `./scripts/scan-cyberai-prs.sh`
- Docs: `docs/CYBERAI_ARCHITECTURE.md`

---

**Last Updated**: 2026-01-02  
**Version**: 1.0.0  
**Status**: Main branch is optimized and production-ready
