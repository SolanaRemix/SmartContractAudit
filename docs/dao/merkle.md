# Merkle Tree Distribution

## Overview

This document explains how SmartContractAudit uses Merkle trees for secure and efficient token distribution in DAO airdrops.

## What is a Merkle Tree?

A **Merkle tree** (also called a hash tree) is a cryptographic data structure that allows:

- **Efficient verification**: Prove inclusion without revealing entire dataset
- **Tamper resistance**: Any change invalidates the root hash
- **Scalability**: Verify claims with logarithmic proof size
- **Privacy**: Only reveal specific allocations when needed

### How It Works

1. **Leaves**: Each allocation (address + amount) is hashed
2. **Branches**: Pairs of hashes are combined and hashed
3. **Root**: Final single hash represents entire distribution
4. **Proofs**: Path from leaf to root proves inclusion

```
         Root Hash
        /         \
    Hash01      Hash23
    /    \      /    \
  H0    H1    H2    H3
  |     |     |     |
Addr0 Addr1 Addr2 Addr3
```

## Why Use Merkle Trees?

### Benefits

✅ **Gas Efficient**: Store only root hash on-chain (32 bytes)  
✅ **Scalable**: Support millions of recipients  
✅ **Verifiable**: Anyone can verify their allocation  
✅ **Private**: Don't reveal others' allocations  
✅ **Flexible**: Update allocations before claiming  
✅ **Auditable**: Community can verify distribution

### Traditional Alternatives

❌ **Store all addresses on-chain**: Very expensive gas costs  
❌ **Centralized server**: Trust issues, single point of failure  
❌ **Manual claims**: Not scalable, error-prone

## Generation Process

### 1. Prepare Allocation Data

Input format (see `/dao/airdrop-sample.json`):

```json
{
  "allocations": [
    {
      "address": "0x1234...5678",
      "amount": "1000",
      "reason": "Code contributions"
    },
    {
      "address": "0xabcd...ef00",
      "amount": "500",
      "reason": "Community participation"
    }
  ]
}
```

### 2. Generate Merkle Tree

Use the provided tool:

```bash
# Make executable
chmod +x dao/merkle/generate_merkle.js

# Generate tree
node dao/merkle/generate_merkle.js \
  --input dao/airdrop-sample.json \
  --output dao/merkle-tree-output.json
```

**Output includes:**
- Merkle root hash
- Proof for each address
- Metadata (total tokens, recipient count)

### 3. Verify Tree

```bash
# Verify tree integrity
node dao/merkle/generate_merkle.js \
  --verify dao/merkle-tree-output.json
```

### 4. Publish Root

- **Announce**: Post root hash in announcement
- **On-chain**: Store in smart contract (if applicable)
- **Repository**: Commit tree file to repository
- **Archive**: Backup tree file securely

## Claiming Process

### For Recipients

1. **Check eligibility**: Visit claiming interface
2. **Connect wallet**: Connect your address
3. **View allocation**: See your token amount
4. **Generate proof**: System generates your Merkle proof
5. **Submit claim**: Transaction to claim tokens
6. **Verification**: Smart contract verifies proof against root
7. **Receive tokens**: Tokens transferred to your address

### Technical Flow

```
User Address + Amount + Proof
         ↓
   Smart Contract
         ↓
   Verify against Root Hash
         ↓
   If valid → Transfer tokens
   If invalid → Reject transaction
```

## Tree Structure

### Leaf Node

Each leaf is a hash of:

```javascript
keccak256(
  abi.encodePacked(
    address,    // Recipient address
    amount      // Token amount
  )
)
```

### Branch Nodes

Each branch combines two child hashes:

```javascript
keccak256(
  abi.encodePacked(
    leftHash,
    rightHash
  )
)
```

### Root Node

Final hash representing entire distribution.

## Proof Format

A Merkle proof is an array of hashes:

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

**Verification steps:**
1. Hash (address + amount) = leaf hash
2. Combine with proof[0], hash
3. Combine with proof[1], hash
4. Continue until root
5. Compare computed root with stored root

## Security Considerations

### Tree Generation

✅ **Do's:**
- Generate offline in secure environment
- Verify tree before publishing root
- Use well-tested libraries (e.g., OpenZeppelin)
- Keep backup of complete tree
- Test with sample data first

❌ **Don'ts:**
- Don't generate on compromised machine
- Don't use untrusted allocation data
- Don't lose the tree file (claims impossible)
- Don't expose private keys
- Don't skip verification step

### Smart Contract

✅ **Do's:**
- Use established patterns (e.g., MerkleDistributor)
- Audit contract before deployment
- Implement claim tracking (prevent double claims)
- Add emergency pause functionality
- Use multisig for admin functions

❌ **Don'ts:**
- Don't deploy without audit
- Don't allow root updates after claims start
- Don't forget claim deadline mechanism
- Don't skip testing on testnet

### Operational

✅ **Do's:**
- Keep multiple backups of tree file
- Test claiming process thoroughly
- Provide clear instructions for users
- Monitor for claiming issues
- Have support channels ready

❌ **Don'ts:**
- Don't lose tree file (unrecoverable)
- Don't change allocations after publishing
- Don't forget to fund claiming contract
- Don't ignore failed claim reports

## Testing

### Test Data

Use provided sample data:

```bash
# Test with sample
node dao/merkle/generate_merkle.js \
  --input dao/airdrop-sample.json \
  --output test-output.json

# Verify sample tree
node dao/merkle/generate_merkle.js \
  --verify test-output.json
```

### Verification Checks

Before mainnet deployment:

- [ ] All addresses valid and checksummed
- [ ] All amounts correct
- [ ] No duplicate addresses
- [ ] Total matches expected supply
- [ ] Tree verifies successfully
- [ ] Sample proofs verify
- [ ] Contract accepts valid proofs
- [ ] Contract rejects invalid proofs
- [ ] Claims track correctly (no double claims)

## Tools and Libraries

### Generation Tool

Our tool (`/dao/merkle/generate_merkle.js`):
- Node.js based
- Uses standard libraries
- Includes verification
- Outputs JSON format
- DRY_RUN mode by default

### Recommended Libraries

**JavaScript/TypeScript:**
- `merkletreejs`: Merkle tree implementation
- `ethers.js` or `web3.js`: Ethereum interaction
- `@openzeppelin/merkle-tree`: OpenZeppelin's library

**Solidity:**
- `@openzeppelin/contracts/utils/cryptography/MerkleProof.sol`

## Troubleshooting

### Common Issues

**Proof verification fails:**
- Check address checksum (case-sensitive)
- Verify amount matches exactly
- Ensure using correct root hash
- Check proof array order

**Tree generation fails:**
- Validate input JSON format
- Check for duplicate addresses
- Verify all amounts are numbers
- Ensure sufficient memory

**Claims not working:**
- Confirm contract is funded
- Check claim hasn't been made already
- Verify wallet connected correctly
- Check gas limit is sufficient

### Getting Help

- **Technical Issues**: GitHub Issues with tag `merkle`
- **Claiming Problems**: Support channel (see claiming.md)
- **Security Concerns**: security@cuberai.example

## Resources

### Documentation

- [OpenZeppelin MerkleProof](https://docs.openzeppelin.com/contracts/4.x/api/utils#MerkleProof)
- [Merkle Tree Explained](https://en.wikipedia.org/wiki/Merkle_tree)
- Our tool: `/dao/merkle/generate_merkle.js`

### Examples

- Sample allocation: `/dao/airdrop-sample.json`
- Generation script: `/dao/merkle/generate_merkle.js`
- Claiming guide: `claiming.md`

### Code

```javascript
// Example verification in JavaScript
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

function verifyProof(leaf, proof, root) {
  return MerkleTree.verify(proof, leaf, root, keccak256);
}
```

## Changelog

### Version 1.0 (2026-01-01)
- Initial merkle tree documentation
- Generation tool provided
- Sample data included

---

**Last Updated**: 2026-01-01  
**Status**: Documentation complete, tool provided  
**Next Steps**: Test with sample data before production use
