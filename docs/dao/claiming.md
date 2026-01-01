# Token Claiming Process

## Overview

This guide explains how to claim your DAO tokens through our off-chain and on-chain claiming processes.

## Off-Chain Claim Process

For smaller allocations or testnet distributions, we use an off-chain claim process.

### Step 1: Check Eligibility

1. **Visit Dashboard**
   - Go to: https://smartcontractaudit.github.io/claim
   - Or check: `dao/allocations.json` in repository

2. **Find Your Address**
   ```bash
   grep "0xYourAddress" dao/allocations.json
   ```

3. **Verify Amount**
   - Confirm your allocation amount
   - Check distribution date

### Step 2: Connect Wallet

**Supported Wallets**:
- MetaMask
- WalletConnect
- Coinbase Wallet
- Ledger
- Trezor

**Steps**:
1. Click "Connect Wallet"
2. Select your wallet provider
3. Approve connection
4. Verify correct address is connected

### Step 3: Submit Claim Request

1. **Generate Claim Message**
   - Dashboard generates message to sign
   - Message includes: address, amount, timestamp

2. **Sign Message**
   ```javascript
   const message = `I claim ${amount} tokens to address ${address} at ${timestamp}`;
   const signature = await wallet.signMessage(message);
   ```

3. **Submit Request**
   - Send signed message to claim endpoint
   - Wait for confirmation

### Step 4: Receive Tokens

**Off-Chain Distribution**:
- Tokens sent within 24-48 hours
- Check wallet balance
- Transaction sent from multisig

**Email Notification**:
- Confirmation sent to registered email (if provided)
- Transaction hash included
- Block explorer link

## On-Chain Claim Process (Merkle)

For larger distributions, we use Merkle airdrop for gas efficiency.

### Step 1: Get Your Proof

1. **Download Proof File**
   ```bash
   # From GitHub
   curl -O https://raw.githubusercontent.com/SolanaRemix/SmartContractAudit/main/dao/merkle-proofs.json
   ```

2. **Find Your Proof**
   ```javascript
   const proofs = require('./merkle-proofs.json');
   const myProof = proofs['0xYourAddress'];
   console.log('Amount:', myProof.amount);
   console.log('Proof:', myProof.proof);
   ```

3. **Or Use Web Interface**
   - Visit claim dashboard
   - Proof loaded automatically
   - Amount displayed

### Step 2: Verify Contract

**Important**: Always verify official contract address!

```javascript
// Official MerkleDistributor contract
const CONTRACT_ADDRESS = '0x...'; // Check official announcement

// Verify on Etherscan/block explorer
// Check contract is verified
// Review contract code
```

**Red Flags**:
- ❌ Contract not verified
- ❌ Different address than announced
- ❌ Unusual permissions or functions
- ❌ Recently deployed (check announcement date)

### Step 3: Submit Claim Transaction

#### Using Web Interface

1. **Visit Claim Page**
   - https://smartcontractaudit.github.io/claim

2. **Connect Wallet**
   - Select wallet provider
   - Approve connection

3. **Review Details**
   - Verify your allocation amount
   - Check gas estimate
   - Proof loaded automatically

4. **Click "Claim Tokens"**
   - Wallet prompt appears
   - Review transaction details
   - Confirm transaction

5. **Wait for Confirmation**
   - Transaction submitted
   - Wait for block confirmation
   - Tokens appear in wallet

#### Using Ethers.js

```javascript
const { ethers } = require('ethers');

// Contract ABI
const ABI = [
  "function claim(uint256 amount, bytes32[] proof) external",
  "function isClaimed(address account) external view returns (bool)"
];

// Setup
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// Check if already claimed
const alreadyClaimed = await contract.isClaimed(address);
if (alreadyClaimed) {
  console.log('Already claimed!');
  return;
}

// Submit claim
const tx = await contract.claim(amount, proof);
console.log('Transaction hash:', tx.hash);

// Wait for confirmation
const receipt = await tx.wait();
console.log('Claimed successfully!');
```

#### Using Web3.py

```python
from web3 import Web3

# Connect
w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/YOUR_KEY'))

# Contract
contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)

# Check if claimed
already_claimed = contract.functions.isClaimed(address).call()
if already_claimed:
    print('Already claimed!')
    exit()

# Build transaction
tx = contract.functions.claim(amount, proof).build_transaction({
    'from': address,
    'nonce': w3.eth.get_transaction_count(address),
    'gas': 150000,
    'gasPrice': w3.eth.gas_price
})

# Sign and send
signed_tx = w3.eth.account.sign_transaction(tx, private_key)
tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
print(f'Transaction hash: {tx_hash.hex()}')

# Wait for confirmation
receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
print('Claimed successfully!')
```

### Step 4: Verify Receipt

1. **Check Wallet Balance**
   ```javascript
   const balance = await tokenContract.balanceOf(address);
   console.log('Balance:', ethers.utils.formatUnits(balance, 18));
   ```

2. **View on Block Explorer**
   - Go to Etherscan/block explorer
   - Search transaction hash
   - Verify token transfer event

3. **Confirm in Dashboard**
   - Claim dashboard should update
   - Show "Claimed" status
   - Display claim timestamp

## Troubleshooting

### Common Errors

#### "Already claimed"

**Cause**: Address has already claimed tokens

**Solution**:
- Check if you already claimed
- Verify you're using correct address
- Each address can only claim once

```javascript
// Check claim status
const isClaimed = await contract.isClaimed('0xYourAddress');
console.log('Claimed:', isClaimed);
```

#### "Invalid proof"

**Cause**: Proof doesn't match Merkle root

**Solution**:
- Download latest proof file
- Verify you're using correct address
- Confirm amount matches allocation
- Check Merkle root on contract

```javascript
// Verify proof locally
const { MerkleTree } = require('merkletreejs');
const isValid = tree.verify(proof, leaf, root);
console.log('Valid proof:', isValid);
```

#### "Insufficient gas"

**Cause**: Gas limit too low

**Solution**:
- Increase gas limit to 150,000
- Check current gas prices
- Wait for lower gas times

```javascript
// Estimate gas
const gasEstimate = await contract.estimateGas.claim(amount, proof);
console.log('Estimated gas:', gasEstimate.toString());
```

#### "Reverted transaction"

**Cause**: Multiple possible causes

**Solution**:
1. Check if already claimed
2. Verify contract has tokens
3. Confirm proof is valid
4. Check network (mainnet vs testnet)
5. Review transaction on block explorer

### Getting Help

If you encounter issues:

1. **Check Documentation**
   - Review this guide
   - Check FAQ below
   - Read [merkle.md](merkle.md)

2. **Search Existing Issues**
   - GitHub Issues
   - Discord support channel
   - Community forums

3. **Contact Support**
   - Email: dao@cuberai.example
   - GitHub Issue with details:
     - Your address
     - Error message
     - Transaction hash (if applicable)
     - Screenshots

## Security Best Practices

### Before Claiming

- ✅ Verify contract address (official sources only)
- ✅ Check contract is verified on block explorer
- ✅ Review contract code (or trust audit)
- ✅ Use official claim interface only
- ✅ Never share private keys

### During Claiming

- ✅ Review transaction details carefully
- ✅ Check gas price is reasonable
- ✅ Verify receiving address
- ✅ Use hardware wallet if possible
- ✅ Don't rush - double check everything

### After Claiming

- ✅ Verify tokens in wallet
- ✅ Check transaction on block explorer
- ✅ Save transaction hash
- ✅ Update personal records
- ✅ Consider staking or governance participation

### Phishing Protection

**Red Flags**:
- ❌ Unexpected DMs about claiming
- ❌ Requests for private keys
- ❌ Urgent "claim now or lose tokens"
- ❌ Links from unofficial sources
- ❌ Requests for seed phrases

**Safe Practices**:
- ✅ Only use official links
- ✅ Verify URLs carefully
- ✅ Check SSL certificates
- ✅ Use bookmarks, not search results
- ✅ Ask community if unsure

## Claiming Timeline

### Regular Distribution

- **Announcement**: 7 days before claiming opens
- **Claiming Opens**: Specific date/time announced
- **Claiming Period**: 90 days
- **Reminder**: 30 days before closing
- **Final Reminder**: 7 days before closing
- **Closing**: Unclaimed tokens handled per policy

### Emergency Distribution

For urgent fixes or security issues:
- Expedited timeline
- 48-hour notice minimum
- Extended claiming period
- Multiple reminders

## FAQ

**Q: When can I claim?**
A: Check announcement for specific dates. Typically 7 days after announcement.

**Q: How long do I have to claim?**
A: 90 days from opening. After that, unclaimed tokens return to treasury.

**Q: What if I miss the deadline?**
A: Contact DAO governance. May be included in future distribution.

**Q: Can I claim for someone else?**
A: No. Proof and address must match. Each address claims their own tokens.

**Q: What if I made a mistake?**
A: Once claimed, transaction is irreversible. Double-check before confirming!

**Q: Are there fees?**
A: Only gas fees (for on-chain claims). No platform fees.

**Q: Can I claim partial amounts?**
A: No. Must claim full allocation in single transaction.

**Q: What if contract runs out of tokens?**
A: Contact team immediately. Will be refilled from treasury.

## Resources

- [DAO Overview](README.md)
- [Eligibility Criteria](eligibility.md)
- [Merkle Airdrop Details](merkle.md)
- [Scoring Formula](scoring.md)

---

Last updated: 2026-01-01
