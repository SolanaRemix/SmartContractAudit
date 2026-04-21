---
title: "Caster Deployment Guide"
description: "Complete guide for deploying smart contracts to ENS domains using Caster"
tags: ["deployment", "caster", "ens", "base-network"]
seo_keywords: "caster deployment, ens deployment, base network deployment, gxqstudio.eth"
---

# 🚀 Caster Deployment Guide

## Overview

This guide covers deploying smart contracts to ENS domains on the Base network using the Caster protocol.

**Target ENS:** `gxqstudio.eth`  
**Network:** Base (Layer 2)  
**Tool:** Caster CLI

---

## Prerequisites

### 1. Install Caster CLI

```bash
# Option 1: npm/pnpm
pnpm add -g @caster/cli

# Option 2: Direct download
# Visit: https://github.com/caster-protocol/caster
```

### 2. Prepare Environment

```bash
# Required environment variables
export CASTER_KEY=your_private_key_or_keystore_path
export PROVIDER_URL=https://mainnet.base.org

# Optional
export ENS_NAME=gxqstudio.eth
export NETWORK=base
```

### 3. Build Artifacts

```bash
# Build your smart contracts
./scripts/update-talents.sh --no-dry-run

# Verify artifact exists
ls -lh build/talents.json
```

---

## Deployment Process

### Step 1: Dry-Run Test

**Always test before live deployment:**

```bash
./scripts/deploy-caster.sh --dry-run
```

**Expected output:**
```
═══════════════════════════════════════════════════════════════════════════
  🚀 Caster Deployment Tool
═══════════════════════════════════════════════════════════════════════════

ℹ️  [INFO] Starting deployment process...
✅ [SUCCESS] Dependencies OK
✅ [SUCCESS] Environment OK
✅ [SUCCESS] Artifact OK

ℹ️  [INFO] Deployment Configuration:
  • ENS Name:    gxqstudio.eth
  • Network:     base
  • Artifact:    ./build/talents.json
  • Provider:    https://mainnet.base.org
  • Dry Run:     true

⚠️  [WARNING] 🧪 DRY-RUN MODE ENABLED
ℹ️  [INFO] Would execute the following command:

  caster push \
    --ens gxqstudio.eth \
    --network base \
    --artifact ./build/talents.json \
    --provider https://mainnet.base.org

⚠️  [WARNING] Run with DRY_RUN=false to execute actual deployment
```

### Step 2: Review Artifact

```bash
# View artifact contents
cat build/talents.json | jq

# Check artifact size
du -h build/talents.json

# Validate JSON structure
jq empty build/talents.json && echo "✅ Valid JSON"
```

### Step 3: Verify ENS Ownership

**Before deployment, confirm you control the ENS domain:**

```bash
# Check ENS owner (using cast or ethers)
cast lookup-address gxqstudio.eth --rpc-url https://mainnet.base.org
```

### Step 4: Execute Deployment

**When ready, deploy to production:**

```bash
DRY_RUN=false ./scripts/deploy-caster.sh
```

**Or with explicit parameters:**

```bash
DRY_RUN=false \
CASTER_KEY=$YOUR_KEY \
PROVIDER_URL=https://mainnet.base.org \
./scripts/deploy-caster.sh --network=base --ens=gxqstudio.eth
```

---

## Network Configuration

### Base Mainnet

```bash
export NETWORK=base
export PROVIDER_URL=https://mainnet.base.org
# Chain ID: 8453
```

### Base Testnet (Sepolia)

```bash
export NETWORK=base-sepolia
export PROVIDER_URL=https://sepolia.base.org
# Chain ID: 84532
```

### Custom RPC

```bash
# Use your own RPC endpoint
export PROVIDER_URL=https://your-rpc-endpoint.com
```

---

## Security Considerations

### Private Key Management

**Option 1: Environment Variable (Quick)**
```bash
export CASTER_KEY=0x1234...your_key
./scripts/deploy-caster.sh
```

**Option 2: Keystore File (Recommended)**
```bash
# Create encrypted keystore
cast wallet new keystore

# Use keystore path
export CASTER_KEY=/path/to/keystore.json
./scripts/deploy-caster.sh
```

**Option 3: Hardware Wallet (Most Secure)**
```bash
# Ledger/Trezor support (if available in Caster)
export CASTER_KEY=ledger://0x...address
./scripts/deploy-caster.sh
```

### Best Practices

- ✅ Always dry-run test first
- ✅ Use testnet before mainnet
- ✅ Verify artifact contents
- ✅ Confirm ENS ownership
- ✅ Use hardware wallet for production
- ✅ Keep private keys secure
- ❌ Never commit private keys
- ❌ Never share keys in chat/email
- ❌ Never deploy untested artifacts

---

## Troubleshooting

### Issue: "Caster CLI not found"

**Solution:**
```bash
# Install Caster
pnpm add -g @caster/cli

# Verify installation
which caster
caster --version
```

### Issue: "Artifact not found"

**Solution:**
```bash
# Build artifacts first
./scripts/update-talents.sh --no-dry-run

# Verify path
ls -lh build/talents.json
```

### Issue: "CASTER_KEY not set"

**Solution:**
```bash
# Set environment variable
export CASTER_KEY=your_key_here

# Or use .env file
echo "CASTER_KEY=your_key" >> .env
source .env
```

### Issue: "Insufficient funds"

**Solution:**
```bash
# Check balance
cast balance $YOUR_ADDRESS --rpc-url $PROVIDER_URL

# Get Base ETH from:
# - Mainnet: Bridge from Ethereum
# - Testnet: https://faucet.base.org
```

### Issue: "ENS not owned"

**Solution:**
```bash
# Verify ENS ownership
cast lookup-address gxqstudio.eth --rpc-url $PROVIDER_URL

# If incorrect, update ENS records or use correct domain
```

### Issue: "Transaction failed"

**Possible causes:**
1. Insufficient gas
2. Incorrect nonce
3. Network congestion
4. Contract errors

**Debug:**
```bash
# Check transaction details
cast tx $TX_HASH --rpc-url $PROVIDER_URL

# View logs
cast logs --address $CONTRACT_ADDRESS --rpc-url $PROVIDER_URL
```

---

## Advanced Usage

### Custom Artifact Path

```bash
./scripts/deploy-caster.sh --artifact=./custom/path/contracts.json
```

### Different ENS Domain

```bash
./scripts/deploy-caster.sh --ens=myproject.eth
```

### Gas Price Control

```bash
# Set custom gas price (if supported)
export GAS_PRICE=50  # gwei
./scripts/deploy-caster.sh
```

### Multi-Contract Deployment

```bash
# Deploy multiple contracts sequentially
for artifact in build/*.json; do
    ARTIFACT_PATH=$artifact ./scripts/deploy-caster.sh --dry-run
done
```

---

## Verification

### After Deployment

**1. Verify on Block Explorer:**
```
https://basescan.org/address/YOUR_CONTRACT_ADDRESS
```

**2. Test Contract Functions:**
```bash
# Read contract state
cast call $CONTRACT_ADDRESS "function()" --rpc-url $PROVIDER_URL
```

**3. Verify ENS Resolution:**
```bash
cast resolve-name gxqstudio.eth --rpc-url $PROVIDER_URL
```

**4. Check Event Logs:**
```bash
cast logs --address $CONTRACT_ADDRESS --from-block latest --rpc-url $PROVIDER_URL
```

---

## Deployment Checklist

Pre-Deployment:
- [ ] Artifacts built successfully
- [ ] Dry-run test passed
- [ ] Artifact reviewed and validated
- [ ] ENS ownership confirmed
- [ ] Private key secured
- [ ] Sufficient balance for gas
- [ ] Network configured correctly
- [ ] Testnet deployment completed (if applicable)

Post-Deployment:
- [ ] Transaction confirmed
- [ ] Contract address recorded
- [ ] Block explorer verification
- [ ] ENS resolution tested
- [ ] Contract functions tested
- [ ] Deployment documented
- [ ] Team notified

---

## Example Workflow

```bash
# 1. Build artifacts
./scripts/update-talents.sh --no-dry-run

# 2. Review artifact
cat build/talents.json | jq . | less

# 3. Test deployment (dry-run)
./scripts/deploy-caster.sh --dry-run

# 4. Deploy to testnet first
NETWORK=base-sepolia \
PROVIDER_URL=https://sepolia.base.org \
DRY_RUN=false \
./scripts/deploy-caster.sh

# 5. If testnet successful, deploy to mainnet
NETWORK=base \
PROVIDER_URL=https://mainnet.base.org \
DRY_RUN=false \
./scripts/deploy-caster.sh

# 6. Verify deployment
cast resolve-name gxqstudio.eth --rpc-url https://mainnet.base.org
```

---

## Additional Resources

### Base Network
- **Website:** https://base.org
- **Docs:** https://docs.base.org
- **Block Explorer:** https://basescan.org
- **Bridge:** https://bridge.base.org

### ENS
- **Website:** https://ens.domains
- **Docs:** https://docs.ens.domains
- **Manager:** https://app.ens.domains

### Caster Protocol
- **GitHub:** https://github.com/caster-protocol/caster
- **Docs:** [Caster Documentation]

---

## Support

For deployment issues:
1. Review this guide thoroughly
2. Check Caster documentation
3. Verify network status
4. Test on testnet first
5. Seek community help if needed

---

*Deployment Guide Version: 1.0.0*
*Last Updated: 2025-12-31*

```
═══════════════════════════════════════════════════════════════════════════
🚀 Deploy Safely | 🛡️ Test First | ✅ Verify Always
═══════════════════════════════════════════════════════════════════════════
```
