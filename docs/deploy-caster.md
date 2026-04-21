---
title: "Deploy Caster - Smart Contract Deployment Guide"
description: "Complete guide for deploying smart contracts to Base network using Caster and ENS"
tags: ["deployment", "caster", "base", "ens", "smart-contracts"]
seo_keywords: "caster deployment, base network deployment, ens deployment, smart contract deployment, gxqstudio.eth"
---

# 🚀 Deploy Caster - Deployment Guide

> Complete guide for deploying smart contracts to Base network via Caster

## ═══════════════════════════════════════════════════════════════
## 🎯 Overview
## ═══════════════════════════════════════════════════════════════

Caster is a deployment tool for publishing smart contract artifacts to ENS (Ethereum Name Service) addresses on various networks. This guide covers deployment to **Base network** targeting the ENS name **gxqstudio.eth**.

### Target Configuration

- **Network**: Base (Chain ID: 8453)
- **ENS Target**: gxqstudio.eth
- **Artifact**: ./build/talents.json
- **Script**: scripts/deploy-caster.sh

## ═══════════════════════════════════════════════════════════════
## 📋 Prerequisites
## ═══════════════════════════════════════════════════════════════

### Required Tools

```bash
# Node.js and pnpm
node --version  # v18.0.0+
pnpm --version

# Caster CLI (install if needed)
npm install -g @caster/cli

# Verify caster installation
caster --version
```

### Required Credentials

1. **CASTER_KEY**: Private key or mnemonic phrase
   - Format: `0x...` (64 hex characters) or 12/24 word mnemonic
   - Must have funds for gas fees on Base network

2. **PROVIDER_URL**: RPC endpoint for Base network
   - Mainnet: `https://mainnet.base.org`
   - Testnet: `https://goerli.base.org`
   - Alternative providers: Alchemy, Infura, QuickNode

### Required Artifact

```bash
# Build artifact first
DRY_RUN=false ./scripts/update-talents.sh --live

# Verify artifact exists
ls -la build/talents.json
cat build/talents.json | jq .
```

## ═══════════════════════════════════════════════════════════════
## 🔧 Setup
## ═══════════════════════════════════════════════════════════════

### Step 1: Configure Environment

```bash
# Create secure environment file (DO NOT COMMIT)
cat > .env.deploy << 'EOF'
# Caster Deployment Configuration
CASTER_KEY=your_private_key_or_mnemonic
PROVIDER_URL=https://mainnet.base.org
NETWORK=base
ENS_NAME=gxqstudio.eth
ARTIFACT_PATH=./build/talents.json
EOF

# Secure the file
chmod 600 .env.deploy

# Add to .gitignore
echo ".env.deploy" >> .gitignore
```

### Step 2: Load Environment

```bash
# Load environment variables
source .env.deploy

# Verify configuration
echo "Network: $NETWORK"
echo "ENS: $ENS_NAME"
echo "Artifact: $ARTIFACT_PATH"
echo "Provider: ${PROVIDER_URL}"
echo "Key: ${CASTER_KEY:0:10}..." # Show only first 10 chars
```

### Step 3: Verify Network Connection

```bash
# Test RPC connection
curl -X POST $PROVIDER_URL \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Expected response for Base mainnet:
# {"jsonrpc":"2.0","id":1,"result":"0x2105"} # 8453 in hex
```

## ═══════════════════════════════════════════════════════════════
## 🚦 Deployment Process
## ═══════════════════════════════════════════════════════════════

### Dry-Run Deployment (Recommended First)

```bash
# Test deployment without executing
./scripts/deploy-caster.sh --dry-run

# Or with explicit flag
DRY_RUN=true ./scripts/deploy-caster.sh

# Review output
# This shows exactly what would be deployed
```

**Expected Output:**
```
═══════════════════════════════════════════════════════════════════════════
🚀 Deploy Caster - Safe Deployment Script
═══════════════════════════════════════════════════════════════════════════
[INFO] Configuration:
  Network: base
  ENS: gxqstudio.eth
  Artifact: ./build/talents.json
  Dry Run: true

[WARNING] 🔒 DRY RUN MODE - No deployment will occur

[INFO] Would execute command:
caster push --ens gxqstudio.eth --network base --artifact ./build/talents.json
```

### Live Deployment

```bash
# CAUTION: This will execute actual blockchain transaction!

# Load credentials
source .env.deploy

# Verify one more time
echo "Deploying to: $ENS_NAME on $NETWORK"
read -p "Continue? (yes/no): " confirm

if [ "$confirm" = "yes" ]; then
  # Execute deployment
  DRY_RUN=false ./scripts/deploy-caster.sh --live
fi
```

### Custom Deployment Options

```bash
# Deploy to testnet first
./scripts/deploy-caster.sh \
  --network=base-goerli \
  --ens=gxqstudio.eth \
  --artifact=./build/talents.json

# Deploy with custom artifact
./scripts/deploy-caster.sh \
  --artifact=./build/custom-talents.json

# Deploy to different ENS
./scripts/deploy-caster.sh \
  --ens=myproject.eth
```

## ═══════════════════════════════════════════════════════════════
## 🔍 Verification
## ═══════════════════════════════════════════════════════════════

### Verify Deployment

```bash
# Check transaction on Base explorer
# Visit: https://basescan.org/tx/<transaction-hash>

# Verify ENS resolution
# Check that gxqstudio.eth points to deployed contract

# Query deployed artifact (if available)
caster query --ens gxqstudio.eth --network base
```

### Post-Deployment Checks

```bash
# 1. Verify transaction confirmed
echo "Check transaction status on BaseScan"

# 2. Test contract functionality
# Run integration tests against deployed contract

# 3. Update documentation
echo "Deployment completed at $(date)" >> DEPLOYMENT.log

# 4. Tag release
git tag -a v1.0.0 -m "Deployed to gxqstudio.eth on Base"
git push origin v1.0.0

# 5. Notify team
echo "✅ Deployment successful!"
```

## ═══════════════════════════════════════════════════════════════
## 🛡️ Security Best Practices
## ═══════════════════════════════════════════════════════════════

### Before Deployment

- [ ] Test thoroughly on testnet first
- [ ] Verify artifact integrity (checksums)
- [ ] Review all transaction parameters
- [ ] Ensure sufficient gas funds
- [ ] Backup current state
- [ ] Have rollback plan ready
- [ ] Notify stakeholders

### During Deployment

- [ ] Monitor transaction status
- [ ] Watch for errors or reverts
- [ ] Keep transaction hash
- [ ] Note block number
- [ ] Record gas used

### After Deployment

- [ ] Verify contract on explorer
- [ ] Test contract functionality
- [ ] Update documentation
- [ ] Archive deployment artifacts
- [ ] Revoke temporary access
- [ ] Monitor for issues

## ═══════════════════════════════════════════════════════════════
## 📊 Deployment Scenarios
## ═══════════════════════════════════════════════════════════════

### Scenario 1: First Deployment

```bash
# 1. Build artifacts
DRY_RUN=false ./scripts/update-talents.sh --live

# 2. Test on testnet
NETWORK=base-goerli \
PROVIDER_URL=https://goerli.base.org \
DRY_RUN=false ./scripts/deploy-caster.sh --live

# 3. Verify testnet deployment
# Test all functionality

# 4. Deploy to mainnet
source .env.deploy
DRY_RUN=false ./scripts/deploy-caster.sh --live

# 5. Verify and celebrate! 🎉
```

### Scenario 2: Update Existing Deployment

```bash
# 1. Build new version
DRY_RUN=false ./scripts/update-talents.sh --live

# 2. Compare artifacts
diff build/talents.json build/talents.json.backup

# 3. Test update on testnet
NETWORK=base-goerli DRY_RUN=false ./scripts/deploy-caster.sh --live

# 4. Deploy update to mainnet
source .env.deploy
DRY_RUN=false ./scripts/deploy-caster.sh --live
```

### Scenario 3: Rollback Deployment

```bash
# 1. Restore previous artifact
cp build/talents.json.backup build/talents.json

# 2. Verify backup integrity
cat build/talents.json | jq .

# 3. Deploy previous version
source .env.deploy
DRY_RUN=false ./scripts/deploy-caster.sh --live

# 4. Verify rollback successful
caster query --ens gxqstudio.eth --network base
```

## ═══════════════════════════════════════════════════════════════
## 🆘 Troubleshooting
## ═══════════════════════════════════════════════════════════════

### Common Issues

#### Issue: Insufficient Funds

```bash
# Check balance
cast balance $YOUR_ADDRESS --rpc-url $PROVIDER_URL

# Solution: Add more ETH to deployment wallet
# Transfer from another wallet or exchange
```

#### Issue: Transaction Reverted

```bash
# Check revert reason
# View on BaseScan or check logs

# Common causes:
# - Insufficient gas limit
# - Contract requirements not met
# - Incorrect parameters

# Solution: Review and fix parameters
```

#### Issue: RPC Connection Failed

```bash
# Test connection
curl $PROVIDER_URL

# Solutions:
# 1. Check provider URL is correct
# 2. Verify internet connection
# 3. Try alternative RPC endpoint
# 4. Check provider status page
```

#### Issue: ENS Not Resolving

```bash
# Check ENS registration
# Verify on ENS app: https://app.ens.domains/

# Ensure:
# - ENS name is registered
# - You have permission to update
# - Correct network (mainnet ENS vs L2)
```

## ═══════════════════════════════════════════════════════════════
## 📚 Additional Resources
## ═══════════════════════════════════════════════════════════════

### Documentation

- [Base Network Docs](https://docs.base.org/)
- [ENS Documentation](https://docs.ens.domains/)
- [Caster CLI Guide](https://github.com/caster-project/caster)
- [Ethers.js Docs](https://docs.ethers.org/)

### Tools & Explorers

- [BaseScan](https://basescan.org/) - Base network explorer
- [ENS App](https://app.ens.domains/) - ENS management
- [Base Bridge](https://bridge.base.org/) - Bridge assets to Base
- [Tenderly](https://tenderly.co/) - Transaction simulation

### Support

- [Base Discord](https://discord.gg/base)
- [ENS Discord](https://discord.gg/ens)
- Repository Issues: Open issue on GitHub
- Team Contact: @SolanaRemix, @smsdao

## ═══════════════════════════════════════════════════════════════
## 📝 Deployment Checklist
## ═══════════════════════════════════════════════════════════════

### Pre-Deployment

- [ ] Artifact built and verified
- [ ] Credentials configured securely
- [ ] RPC connection tested
- [ ] Sufficient funds confirmed
- [ ] Testnet deployment successful
- [ ] Team notified
- [ ] Backup created

### Deployment

- [ ] Dry-run completed
- [ ] Parameters reviewed
- [ ] Deployment executed
- [ ] Transaction confirmed
- [ ] Verification completed

### Post-Deployment

- [ ] Contract tested
- [ ] Documentation updated
- [ ] Release tagged
- [ ] Team notified
- [ ] Monitoring active
- [ ] Credentials rotated

---

**Version**: 1.0.0  
**Network**: Base (Chain ID: 8453)  
**ENS**: gxqstudio.eth  
**Last Updated**: 2025-12-31  
**Status**: Production Ready

**🚀 Happy Deploying!** Remember to always test on testnet first! 🛡️✨
