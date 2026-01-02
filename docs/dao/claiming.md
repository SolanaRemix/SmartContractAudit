# Token Claiming Process

## Overview

This guide explains how to claim your CyberAi DAO token allocation after a snapshot has been taken and the merkle tree has been generated.

## Prerequisites

Before you can claim:

✅ **Check eligibility** - Review [eligibility.md](eligibility.md)  
✅ **Snapshot taken** - Wait for snapshot announcement  
✅ **Address registered** - Have your wallet address recorded  
✅ **Allocation confirmed** - Check your allocation amount  
✅ **Claiming open** - Wait for claiming period to begin

## Claiming Timeline

### Phase 1: Registration (Days 1-30)

**Register your address:**
- Provide wallet address
- Verify ownership
- Link to GitHub account

### Phase 2: Verification (Days 31-45)

**We verify:**
- Address format is valid
- No duplicate registrations
- Ownership proof is correct
- Allocations are accurate

### Phase 3: Claiming (Day 45+)

**Claim your tokens:**
- Connect wallet
- Generate merkle proof
- Submit claim transaction
- Receive tokens

### Time Limit

⏰ **Claim within 12 months** of claiming opening

- After 12 months, unclaimed tokens may be redistributed
- Extensions may be granted for special circumstances
- Request extension via GitHub issue

## Step-by-Step Guide

### Step 1: Check Your Allocation

**Option A: Web Interface** (recommended)

1. Visit claiming website (link in announcement)
2. Enter your GitHub username or wallet address
3. View your allocation details

**Option B: Direct Merkle Tree File**

1. Download merkle tree file from repository
2. Search for your address
3. Note your amount and proof

### Step 2: Prepare Your Wallet

**Supported Wallets:**
- MetaMask (browser extension)
- WalletConnect (mobile wallets)
- Ledger/Trezor (hardware wallets)
- Other Web3 wallets

**Requirements:**
- Native token for gas (ETH, SOL, etc.)
- Wallet updated to latest version
- Network added (mainnet or specific chain)

**Estimated Gas Costs:**
- Ethereum: 50,000-100,000 gas (~$5-50 depending on gas price)
- Solana: ~0.00001 SOL (~$0.001)
- Other chains: varies

### Step 3: Connect Wallet

**Web Interface:**

1. Click "Connect Wallet" button
2. Select your wallet type
3. Approve connection in wallet
4. Verify connected address matches registration

**Security Checks:**
- URL is correct (check for phishing)
- HTTPS connection (lock icon)
- Contract address verified (compare with official)
- Transaction details reviewed

### Step 4: Generate Proof

**Automatic (Recommended):**

Interface automatically generates merkle proof for your address.

**Manual (Advanced):**

```bash
# Using our tool
node dao/merkle/generate_merkle.js \
  --prove \
  --tree merkle-tree.json \
  --address 0x1234...5678
```

Output:
```json
{
  "address": "0x1234...5678",
  "amount": "1000",
  "proof": [
    "0xabcd...",
    "0xef01...",
    "0x2345..."
  ]
}
```

### Step 5: Review Claim Details

Before submitting, verify:

- ✅ **Address**: Your wallet address is correct
- ✅ **Amount**: Token amount matches your allocation
- ✅ **Network**: Connected to correct network
- ✅ **Gas**: Sufficient gas in wallet
- ✅ **Contract**: Official contract address

**Warning Signs:**
- ❌ Different amount than expected
- ❌ Unusual contract address
- ❌ Excessive gas fee request
- ❌ Additional permissions requested

### Step 6: Submit Claim Transaction

1. Click "Claim Tokens" button
2. Review transaction in wallet popup
3. Verify gas fee is reasonable
4. Approve and sign transaction
5. Wait for confirmation

**Transaction Process:**
1. Submitted → Pending
2. Included in block → Confirming
3. Finalized → Complete

**Time to complete:**
- Ethereum: 30 seconds - 5 minutes
- Solana: 1-5 seconds
- Polygon: 5-30 seconds

### Step 7: Verify Receipt

**Check tokens in wallet:**

1. Add token contract address to wallet
2. View token balance
3. Verify amount matches allocation

**If tokens not showing:**
- Wait for sufficient confirmations
- Manually add token contract
- Check block explorer for transaction
- Verify correct network

## Troubleshooting

### Common Issues

#### "Address not found"

**Causes:**
- Address not registered
- Typo in address
- Not eligible for airdrop
- Registration after deadline

**Solutions:**
- Verify address is correct (checksum)
- Check eligibility criteria
- Appeal if you believe you're eligible
- Register for next airdrop

#### "Invalid proof"

**Causes:**
- Wrong merkle tree version
- Address changed after registration
- Technical error in proof generation
- Contract updated after registration

**Solutions:**
- Regenerate proof from latest tree
- Verify address matches registration
- Contact support with error details
- Check for announcement of updated tree

#### "Already claimed"

**Causes:**
- Tokens already claimed by this address
- Double claim attempt
- Someone else claimed (address compromise)

**Solutions:**
- Check wallet for tokens (may have claimed previously)
- Verify transaction history
- If stolen, report immediately to security@cyberai.network
- Check block explorer for original claim

#### "Insufficient gas"

**Causes:**
- Not enough native token for gas
- Gas price too low
- Complex transaction requiring more gas

**Solutions:**
- Add more native token to wallet
- Increase gas limit slightly
- Wait for lower gas prices
- Use different wallet/network

#### "Transaction reverted"

**Causes:**
- Contract error
- Proof invalid
- Claim period ended
- Already claimed

**Solutions:**
- Check error message details
- Verify all claim requirements
- Contact support with transaction hash
- Try again with higher gas

### Getting Help

**Self-Service:**
1. Check FAQ section below
2. Review transaction on block explorer
3. Verify all requirements met
4. Try again with different wallet/network

**Community Support:**
1. Search GitHub Issues for similar problems
2. Ask in GitHub Discussions (tag: `dao-claiming`)
3. Check announcement for updates

**Direct Support:**
- **Technical Issues**: Open GitHub Issue (tag: `dao-claiming-issue`)
- **Security Concerns**: security@cyberai.network
- **Lost Access**: Follow account recovery process

## Security Best Practices

### Before Claiming

✅ **Verify everything:**
- Official website URL
- Contract address
- Allocation amount
- Transaction details

✅ **Protect your wallet:**
- Use hardware wallet for large amounts
- Never share seed phrase
- Verify all transactions
- Use reputable wallet software

### During Claiming

✅ **Be cautious:**
- Review all transaction details
- Don't rush under time pressure
- Check gas fees are reasonable
- Verify recipient address

### After Claiming

✅ **Secure your tokens:**
- Move to secure wallet
- Enable additional security (2FA, etc.)
- Keep seed phrase safe
- Monitor wallet activity

### Avoiding Scams

❌ **Never:**
- Share seed phrase or private keys
- Click suspicious links in DMs
- Send tokens to "verify" eligibility
- Use unofficial claiming interfaces
- Connect wallet to unknown sites

⚠️ **Red Flags:**
- Unsolicited DMs about claiming
- Requests for payment to claim
- "Limited time" pressure tactics
- Unofficial websites or contracts
- Requests for more than signature approval

## FAQ

### General

**Q: When can I claim?**  
A: After claiming period opens (announced separately from snapshot)

**Q: How long do I have to claim?**  
A: 12 months from claiming opening

**Q: Is there a claim fee?**  
A: Only network gas fees, no additional protocol fees

**Q: Can I claim to a different address?**  
A: No, must claim to registered address

### Technical

**Q: Which networks are supported?**  
A: Announced with claiming details (varies by implementation)

**Q: Can I claim multiple times?**  
A: No, each address can claim only once

**Q: What if I lose access to my address?**  
A: Very limited recovery options; secure your wallet

**Q: Can I transfer before claiming?**  
A: No, must claim first, then transfer

### Timing

**Q: What happens to unclaimed tokens?**  
A: After 12 months, may be redistributed per governance

**Q: Can I claim in batches?**  
A: No, must claim full allocation at once

**Q: Is there a claim deadline extension?**  
A: Only for extraordinary circumstances; request via GitHub

## Additional Resources

### Documentation
- [eligibility.md](eligibility.md) - Eligibility criteria
- [scoring.md](scoring.md) - How allocations are calculated
- [merkle.md](merkle.md) - Technical details of merkle trees
- [snapshot.md](snapshot.md) - Snapshot process

### Tools
- Claiming interface (link in announcement)
- Block explorer for transaction verification
- Gas price trackers
- Wallet software

### Support
- GitHub Discussions: General questions
- GitHub Issues: Technical problems
- security@cyberai.network: Security concerns

## Claiming Checklist

Before claiming, verify:

- [ ] Checked eligibility and allocation amount
- [ ] Registered wallet address
- [ ] Downloaded supported wallet
- [ ] Added sufficient gas to wallet
- [ ] Verified official claiming interface URL
- [ ] Reviewed security best practices
- [ ] Understood transaction details
- [ ] Ready to claim (not rushed)

---

**Last Updated**: 2026-01-01  
**Claiming Status**: Not yet open (snapshot planning phase)  
**Support**: GitHub Discussions (tag: `dao-claiming`)
