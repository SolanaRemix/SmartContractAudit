---
title: "Caster Deployment Guide"
description: "Complete guide to deploying smart contracts to ENS using Caster on Base network"
tags: [deployment, caster, ens, base, blockchain]
seo_keywords: "ens deployment, caster smart contracts, base network deployment, gxqstudio.eth"
geo:
  country: "global"
---

# 🚀 Caster Deployment Guide

Complete guide to deploying smart contracts to **ENS** using **Caster** on the **Base network**.

## 🎯 Overview

Caster is a deployment tool for publishing smart contracts and "talents" (contract interfaces) to ENS names on various networks. This guide focuses on deploying to **gxqstudio.eth** on **Base**.

## 📋 Prerequisites

Before deploying:
- ✅ Caster CLI installed (or deployment service configured)
- ✅ ENS name ownership verified (`gxqstudio.eth`)
- ✅ Base network access (RPC endpoint)
- ✅ Deployment key/credentials
- ✅ Build artifacts prepared
- ✅ Network gas funds available

## 🔧 Setup

### 1. Install Caster (if needed)

```bash
# Example installation (adjust based on actual Caster tool)
npm install -g caster-cli

# Or use specific deployment tooling
# Follow Caster official documentation
```

### 2. Set Environment Variables

```bash
# Required secrets (NEVER commit these!)
export CASTER_KEY="your_deployment_key_here"
export PROVIDER_URL="https://base.llamarpc.com"

# Optional configuration
export ENS_NAME="gxqstudio.eth"
export NETWORK="base"
export ARTIFACT="./build/talents.json"
```

### 3. Configure ENS

Ensure your ENS name is properly configured:
- Owner address set
- Resolver configured
- Text records (if needed)
- Subdomain structure (if any)

## 🔨 Building Artifacts

### Step 1: Prepare Your Project

```bash
# Ensure package.json has build script
cat package.json | jq '.scripts.build'

# Install dependencies
pnpm install
```

### Step 2: Build Artifacts

```bash
# Dry-run (safe, default)
./scripts/update-talents.sh

# Review what would be built
cat build/talents.json

# Live build
DRY_RUN=false ./scripts/update-talents.sh
```

### Step 3: Validate Artifact

```bash
# Check artifact exists
ls -lh build/talents.json

# Validate JSON structure
cat build/talents.json | jq

# Check required fields
jq '.version, .metadata' build/talents.json
```

**Expected structure:**

```json
{
  "version": "1.0.0",
  "timestamp": "2024-12-31T02:00:00.000Z",
  "talents": [
    {
      "name": "ExampleTalent",
      "address": "0x...",
      "abi": [ /* ... */ ]
    }
  ],
  "metadata": {
    "generator": "update-talents.sh",
    "network": "base",
    "ens": "gxqstudio.eth"
  }
}
```

## 🚀 Deployment Process

### Step 1: Dry-Run Deployment

```bash
# Test deployment (no actual changes)
./scripts/deploy-caster.sh

# Or explicitly
DRY_RUN=true ./scripts/deploy-caster.sh
```

**Output:**
```
╔════════════════════════════════════════════════════╗
║  🎯 Caster Deployment Script                      ║
║  Deploy to: gxqstudio.eth (base)                  ║
╚════════════════════════════════════════════════════╝

[INFO] Configuration:
  DRY_RUN: true
  ENS: gxqstudio.eth
  Network: base
  Artifact: ./build/talents.json
[SUCCESS] Artifact found: ./build/talents.json
[SUCCESS] Artifact validation passed
[INFO] Deployment plan:
  Command: caster push
  Target: --ens gxqstudio.eth
  Network: --network base
  Artifact: --artifact ./build/talents.json
[WARN] 🔒 DRY_RUN MODE: No actual deployment will occur
```

### Step 2: Review Deployment Plan

Check the following:
- ✅ Correct ENS name (`gxqstudio.eth`)
- ✅ Correct network (`base`)
- ✅ Valid artifact (`./build/talents.json`)
- ✅ Secrets are set (keys masked)
- ✅ Gas funds available

### Step 3: Live Deployment

```bash
# Set secrets
export CASTER_KEY="your_key_here"
export PROVIDER_URL="https://base.llamarpc.com"

# Deploy for real
DRY_RUN=false ./scripts/deploy-caster.sh

# Or with explicit flag
./scripts/deploy-caster.sh --live
```

**⚠️ WARNING**: This creates real blockchain transactions and costs gas!

### Step 4: Verify Deployment

```bash
# Check ENS records
# (command depends on ENS tooling)
cast resolve gxqstudio.eth --rpc-url https://base.llamarpc.com

# Verify contract
cast code <deployed_address> --rpc-url https://base.llamarpc.com

# Check logs
cat logs/deploy-*.json
```

## 🔐 Security Best Practices

### Secret Management

```bash
# ❌ NEVER do this
echo "CASTER_KEY=sk_live_abc123" > .env
git add .env  # DON'T commit secrets!

# ✅ DO this instead
# Set secrets in terminal only (not in files)
export CASTER_KEY="sk_live_abc123"

# Or use secure secret management
# - GitHub repository secrets (CI/CD)
# - HashiCorp Vault
# - AWS Secrets Manager
```

### Pre-Deployment Checklist

- [ ] Artifact validated and reviewed
- [ ] ENS name ownership verified
- [ ] Network configuration correct
- [ ] Secrets set securely (not in code)
- [ ] Gas funds available
- [ ] Backup of previous deployment
- [ ] Team notified of deployment
- [ ] Monitoring ready

## 🌐 Network Configuration

### Base Network

```bash
export NETWORK="base"
export PROVIDER_URL="https://base.llamarpc.com"

# Alternative providers
# - https://mainnet.base.org
# - https://base-mainnet.public.blastapi.io
```

### Network Details

- **Chain ID**: 8453
- **Currency**: ETH
- **Block Explorer**: https://basescan.org
- **ENS Registry**: (Base-specific ENS implementation)

### Gas Estimation

```bash
# Estimate gas for deployment
# (depends on contract size and complexity)

# Typical range: 100,000 - 500,000 gas
# At 0.01 gwei: ~0.001 - 0.005 ETH
```

## 📊 Deployment Scenarios

### Scenario 1: First-Time Deployment

```bash
# 1. Build artifacts
DRY_RUN=false ./scripts/update-talents.sh

# 2. Validate
cat build/talents.json | jq

# 3. Dry-run deploy
./scripts/deploy-caster.sh

# 4. Live deploy
DRY_RUN=false ./scripts/deploy-caster.sh
```

### Scenario 2: Update Existing Deployment

```bash
# 1. Backup current state
cp build/talents.json build/talents.json.backup

# 2. Build new version
DRY_RUN=false ./scripts/update-talents.sh

# 3. Review changes
diff build/talents.json.backup build/talents.json

# 4. Deploy update
DRY_RUN=false ./scripts/deploy-caster.sh
```

### Scenario 3: CI/CD Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to ENS

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Build artifacts
        run: DRY_RUN=false ./scripts/update-talents.sh
      
      - name: Deploy to ENS
        env:
          CASTER_KEY: ${{ secrets.CASTER_KEY }}
          PROVIDER_URL: ${{ secrets.PROVIDER_URL }}
        run: DRY_RUN=false ./scripts/deploy-caster.sh
```

## 🔧 Customization

### Custom ENS Name

```bash
ENS_NAME="custom.eth" ./scripts/deploy-caster.sh
```

### Custom Network

```bash
NETWORK="mainnet" \
PROVIDER_URL="https://eth.llamarpc.com" \
./scripts/deploy-caster.sh
```

### Custom Artifact Path

```bash
ARTIFACT="./dist/contracts.json" ./scripts/deploy-caster.sh
```

### Script Configuration

Edit `scripts/deploy-caster.sh`:

```bash
# Default configuration
ENS_NAME="${ENS_NAME:-gxqstudio.eth}"
NETWORK="${NETWORK:-base}"
ARTIFACT="${ARTIFACT:-./build/talents.json}"
```

## 🐛 Troubleshooting

### Issue: "Artifact not found"

**Solution:**
```bash
# Build artifacts first
DRY_RUN=false ./scripts/update-talents.sh

# Verify location
ls -l build/talents.json
```

### Issue: "CASTER_KEY not set"

**Solution:**
```bash
# Set required secret
export CASTER_KEY="your_key_here"

# Verify it's set
echo ${CASTER_KEY:0:10}***
```

### Issue: "Provider connection failed"

**Solution:**
```bash
# Test provider connectivity
curl -X POST $PROVIDER_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'

# Try alternative provider
export PROVIDER_URL="https://mainnet.base.org"
```

### Issue: "Gas price too high"

**Solution:**
```bash
# Wait for lower gas prices
# Check: https://basescan.org/gastracker

# Or configure max gas price in deployment script
```

### Issue: "ENS name not owned"

**Solution:**
1. Verify ownership on ENS manager
2. Check wallet has ownership rights
3. Ensure correct network (Base vs Mainnet)

## 📚 Deployment Command Reference

### Actual Caster Command

```bash
# The deploy-caster.sh script wraps this command:
caster push \
  --ens gxqstudio.eth \
  --network base \
  --artifact ./build/talents.json \
  --provider-url $PROVIDER_URL \
  --key $CASTER_KEY
```

**Note**: The actual command is commented out in the script for safety. Uncomment when ready.

### Environment Variables Summary

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `CASTER_KEY` | Yes (live) | - | Deployment key |
| `PROVIDER_URL` | Yes (live) | - | RPC endpoint |
| `ENS_NAME` | No | `gxqstudio.eth` | Target ENS name |
| `NETWORK` | No | `base` | Target network |
| `ARTIFACT` | No | `./build/talents.json` | Artifact path |
| `DRY_RUN` | No | `true` | Enable dry-run |

## 🎯 Post-Deployment

### Verification Steps

1. **Check ENS resolution**:
   ```bash
   cast resolve gxqstudio.eth
   ```

2. **Verify contract code**:
   ```bash
   cast code <address> --rpc-url https://base.llamarpc.com
   ```

3. **Test contract functions**:
   ```bash
   cast call <address> "functionName()" --rpc-url https://base.llamarpc.com
   ```

4. **Review on explorer**:
   - Visit: https://basescan.org/address/<address>

### Monitoring

- Set up alerts for contract events
- Monitor gas usage
- Track ENS record changes
- Log all deployments

### Documentation

- Update deployment history
- Document ENS records
- Save deployment logs
- Update team documentation

## 📞 Support

### Resources

- **Caster Documentation**: (Link to official docs)
- **Base Network**: https://base.org
- **ENS Documentation**: https://docs.ens.domains
- **BaseScan**: https://basescan.org

### Getting Help

- Review logs: `cat logs/deploy-*.json`
- Check workflow runs (CI/CD)
- Consult Base network status
- Review ENS manager

---

**Deployment Guide Version**: 1.0.0  
**Target ENS**: gxqstudio.eth  
**Target Network**: Base (Chain ID: 8453)  
**Last Updated**: 2024-12-31
