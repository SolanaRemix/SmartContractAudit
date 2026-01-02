<<<<<<< HEAD
# Merkle Airdrop Process

## Overview

This document explains the merkle tree airdrop mechanism used for efficient and gas-optimized token distribution to DAO participants.

## What is a Merkle Airdrop?

A merkle airdrop uses a merkle tree data structure to:
- **Reduce Gas Costs**: Only root hash stored on-chain
- **Prove Inclusion**: Users prove eligibility with merkle proof
- **Scale Efficiently**: Support thousands of recipients
- **Maintain Transparency**: Full tree publicly verifiable

## Merkle Tree Basics

### Structure

```
            Root Hash
           /         \
      Hash AB      Hash CD
      /    \        /    \
  Hash A Hash B  Hash C Hash D
    |      |       |      |
  User A User B  User C User D
```

### Components

1. **Leaf Nodes**: Individual allocations (address + amount)
2. **Branch Nodes**: Hashes of child nodes
3. **Root Hash**: Single hash representing entire tree
4. **Merkle Proof**: Path from leaf to root

## Distribution Flow

### Phase 1: Data Collection

1. **Snapshot**: Capture contributions at specific time
2. **Scoring**: Calculate scores using [scoring.md](scoring.md)
3. **Allocation**: Convert scores to token amounts
4. **Verification**: Community review period

### Phase 2: Merkle Tree Generation

1. **Format Data**: Create allocation list
   ```json
   {
     "address": "0x1234...",
     "amount": "1000000000000000000",
     "score": 500
   }
   ```

2. **Generate Leaves**: Hash each allocation
   ```javascript
   leaf = keccak256(abi.encodePacked(address, amount))
   ```

3. **Build Tree**: Combine hashes pairwise up to root

4. **Generate Proofs**: Create proof for each leaf

5. **Publish**: Release tree data publicly

### Phase 3: Contract Deployment (If On-Chain)

1. **Deploy Contract**: MerkleDistributor contract
2. **Set Root**: Store merkle root hash
3. **Fund Contract**: Transfer tokens to contract
4. **Verify**: Confirm setup correct
5. **Announce**: Notify eligible claimants

### Phase 4: Claiming

See [claiming.md](claiming.md) for user claiming process.

## Generating Merkle Trees

### Using the Provided Script

We provide a merkle tree generator script:

**Location**: `dao/merkle/generate_merkle.js`

**Usage**:
```bash
cd dao/merkle
node generate_merkle.js ../airdrop-sample.json output.json
```

**Input Format** (`airdrop-sample.json`):
```json
[
  {
    "address": "0x1234567890123456789012345678901234567890",
    "amount": "1000000000000000000000",
    "score": 500
  },
  {
    "address": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    "amount": "500000000000000000000",
    "score": 250
  }
]
```

**Output Format** (`output.json`):
```json
{
  "merkleRoot": "0xabc123...",
  "claims": {
    "0x1234...": {
      "index": 0,
      "amount": "1000000000000000000000",
      "proof": ["0xdef456...", "0x789abc..."]
    }
  }
}
```

### Manual Generation

For custom implementations:

**Step 1: Prepare leaves**
```javascript
const leaves = allocations.map((alloc, index) => {
  return ethers.utils.solidityKeccak256(
    ['uint256', 'address', 'uint256'],
    [index, alloc.address, alloc.amount]
  );
});
```

**Step 2: Build tree**
```javascript
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const root = tree.getRoot();
```

**Step 3: Generate proofs**
```javascript
const proof = tree.getHexProof(leaves[index]);
```

## Smart Contract Integration

### Example Solidity Contract

```solidity
=======
# Merkle Airdrop Flow

## Overview

Merkle airdrops enable efficient, gas-optimized token distribution to many recipients. Recipients can claim their tokens when they're ready, paying only their own gas costs.

## How Merkle Airdrops Work

### Concept

Instead of sending tokens to thousands of addresses (expensive), we:
1. Calculate each recipient's allocation
2. Build a Merkle tree from allocations
3. Store only the Merkle root on-chain
4. Users claim by providing a Merkle proof

### Benefits

- **Gas Efficient**: Only root hash stored on-chain
- **Scalable**: Supports unlimited recipients
- **Flexible**: Users claim when ready
- **Transparent**: All allocations public and verifiable
- **Secure**: Cryptographically guaranteed

## Airdrop Process

### Phase 1: Data Collection

1. **Contribution Snapshot**
   ```bash
   # Run scoring algorithm
   node scripts/calculate-contributions.js --start-date 2025-01-01 --end-date 2025-12-31
   ```

2. **Score Calculation**
   - Apply scoring formula (see [scoring.md](scoring.md))
   - Calculate token allocations
   - Generate allocation list

3. **Review Period**
   - Post draft allocations to GitHub
   - Community review (7 days)
   - Address disputes
   - Finalize allocations

### Phase 2: Merkle Tree Generation

1. **Prepare Allocation Data**
   ```json
   {
     "0x1234...": "1000000000000000000",
     "0x5678...": "500000000000000000",
     "...": "..."
   }
   ```

2. **Generate Merkle Tree**
   ```bash
   node dao/merkle/generate_merkle.js \
     --input dao/allocations.json \
     --output dao/merkle-tree.json
   ```

3. **Outputs**
   - Merkle root hash
   - Merkle proofs for each address
   - Verification data

### Phase 3: On-Chain Deployment

1. **Deploy Merkle Distributor Contract**
   ```solidity
   contract MerkleDistributor {
     bytes32 public merkleRoot;
     mapping(address => bool) public claimed;
     
     function claim(uint256 amount, bytes32[] memory proof) external;
   }
   ```

2. **Set Merkle Root**
   - Multisig proposes transaction
   - Signers approve
   - Root hash set on-chain

3. **Fund Contract**
   - Transfer total airdrop tokens to contract
   - Verify balance

### Phase 4: Claiming Period

1. **Announcement**
   - Publish claim instructions
   - Share merkle proofs
   - Provide claiming interface

2. **User Claims**
   - User visits claim interface
   - Connects wallet
   - Submits claim transaction with proof
   - Receives tokens

3. **Verification**
   - Contract verifies Merkle proof
   - Checks if already claimed
   - Transfers tokens to user

## Technical Implementation

### Generating Merkle Tree

```javascript
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

function generateMerkleTree(allocations) {
  // Create leaf nodes
  const leaves = Object.entries(allocations).map(([address, amount]) => {
    return keccak256(
      ethers.utils.solidityPack(['address', 'uint256'], [address, amount])
    );
  });
  
  // Build tree
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  
  // Get root
  const root = tree.getHexRoot();
  
  // Generate proofs
  const proofs = {};
  Object.entries(allocations).forEach(([address, amount]) => {
    const leaf = keccak256(
      ethers.utils.solidityPack(['address', 'uint256'], [address, amount])
    );
    proofs[address] = tree.getHexProof(leaf);
  });
  
  return { root, proofs, tree };
}
```

### Verifying Proofs

```javascript
function verifyProof(address, amount, proof, root) {
  const leaf = keccak256(
    ethers.utils.solidityPack(['address', 'uint256'], [address, amount])
  );
  
  return MerkleTree.verify(proof, leaf, root, keccak256);
}
```

### Smart Contract (Solidity)

```solidity
// SPDX-License-Identifier: MIT
>>>>>>> origin/pr9
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleDistributor {
    IERC20 public token;
    bytes32 public merkleRoot;
    mapping(address => bool) public claimed;
<<<<<<< HEAD

    event Claimed(address indexed account, uint256 amount);

=======
    
    event Claimed(address indexed account, uint256 amount);
    
>>>>>>> origin/pr9
    constructor(IERC20 _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }
<<<<<<< HEAD

    function claim(uint256 index, address account, uint256 amount, bytes32[] calldata merkleProof)
        external
    {
        require(!claimed[account], "Already claimed");

        // Verify merkle proof
        bytes32 node = keccak256(abi.encodePacked(index, account, amount));
        require(MerkleProof.verify(merkleProof, merkleRoot, node), "Invalid proof");

        // Mark as claimed and transfer
        claimed[account] = true;
        require(token.transfer(account, amount), "Transfer failed");

        emit Claimed(account, amount);
    }

    function isClaimed(address account) public view returns (bool) {
=======
    
    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Already claimed");
        
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");
        
        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        
        emit Claimed(msg.sender, amount);
    }
    
    function isClaimed(address account) external view returns (bool) {
>>>>>>> origin/pr9
        return claimed[account];
    }
}
```

<<<<<<< HEAD
## Off-Chain Alternative

For projects preferring off-chain distribution:

### Process

1. **Generate Merkle Tree**: Same as on-chain
2. **Store Root**: Database or decentralized storage
3. **Verify Claims**: Backend verifies proofs
4. **Distribute**: Direct transfer or claim portal
5. **Record**: Log all distributions

### Benefits

- No gas costs for claiming
- Faster distribution
- More flexible distribution logic
- Easier to handle errors

### Drawbacks

- Requires trust in distributor
- Less transparent
- Centralization risk

## Security Considerations

### Best Practices

1. **Verify All Data**: Review allocations before generation
2. **Test Proofs**: Validate proofs before deployment
3. **Audit Contract**: Have contract audited if on-chain
4. **Use Standard Libraries**: Don't roll your own crypto
5. **Double-Check Root**: Verify merkle root matches data
6. **Backup Data**: Store tree data redundantly

### Common Pitfalls

❌ **Don't**:
- Regenerate tree with same data (hashes may differ)
- Modify allocation list after tree generation
- Lose original tree data
- Skip proof verification testing
- Use weak hashing algorithms

✅ **Do**:
- Keep original allocation data
- Version control tree data
- Test claim process thoroughly
- Document tree generation parameters
- Use established merkle libraries

## Verification Process

### Verify Your Inclusion

1. **Download Tree Data**: Get public merkle data
2. **Find Your Entry**: Search for your address
3. **Verify Proof**: Use verification script
4. **Check Amount**: Confirm allocation matches score

### Verification Script

```javascript
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { ethers } = require('ethers');

function verifyProof(address, amount, proof, root) {
  const leaf = ethers.utils.solidityKeccak256(
    ['address', 'uint256'],
    [address, amount]
  );
  
  const tree = new MerkleTree([], keccak256, { sortPairs: true });
  return tree.verify(proof, leaf, root);
}

// Example usage
const isValid = verifyProof(
  '0x1234...',
  '1000000000000000000000',
  ['0xabc...', '0xdef...'],
  '0x789...'
);

console.log('Valid proof:', isValid);
```

## Tools and Libraries

### JavaScript/Node.js

- **merkletreejs**: Full-featured merkle tree library
  ```bash
  npm install merkletreejs
  ```

- **ethers.js**: Ethereum utilities and encoding
  ```bash
  npm install ethers
  ```

### Python

- **merkly**: Python merkle tree implementation
  ```bash
  pip install merkly
  ```

### Solidity

- **OpenZeppelin MerkleProof**: Standard implementation
  ```solidity
  import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
  ```

## Testing

### Test Checklist

- [ ] Generate tree with sample data
- [ ] Verify all proofs validate correctly
- [ ] Test invalid proofs are rejected
- [ ] Confirm root hash matches
- [ ] Test claim process end-to-end
- [ ] Verify double-claim prevention
- [ ] Test with various data sizes
- [ ] Validate gas costs (if on-chain)

### Sample Test Data

See `dao/airdrop-sample.json` for example allocations.

## FAQ

**Q: Why use merkle trees instead of a list?**
A: Much more gas-efficient. Storing thousands of addresses on-chain is expensive.

**Q: Can allocations be changed after tree generation?**
A: No. Changing data would change the merkle root, invalidating all proofs.

**Q: What if I lose my proof?**
A: Proofs can be regenerated from the original tree data (publicly available).

**Q: Is the merkle tree data public?**
A: Yes. Full tree data and all proofs are published for transparency.

**Q: Can someone steal my allocation?**
A: No. Proofs are tied to specific addresses. Only you can claim your allocation.

**Q: What if there's an error in my allocation?**
A: Raise during community review period. After tree deployment, corrections require new tree.

## Resources

### Documentation

- [claiming.md](claiming.md) - How to claim your tokens
- [snapshot.md](snapshot.md) - Snapshot process
- [eligibility.md](eligibility.md) - Eligibility criteria

### Tools

- `dao/merkle/generate_merkle.js` - Tree generator script
- `dao/airdrop-sample.json` - Example data

### External Resources

- [MerkleTreeJS Documentation](https://github.com/miguelmota/merkletreejs)
- [OpenZeppelin MerkleProof](https://docs.openzeppelin.com/contracts/4.x/api/utils#MerkleProof)
- [Merkle Tree Explainer](https://en.wikipedia.org/wiki/Merkle_tree)

## Contact

Questions about merkle airdrops?
- **GitHub Discussions**: Technical questions
- **GitHub Issues**: Bug reports
- **Email**: governance@cuberai.example

---

**Version**: 1.0

**Last Updated**: 2026-01-01
=======
## Claiming Instructions

### For Recipients

1. **Check Eligibility**
   - Visit airdrop dashboard
   - Connect wallet
   - See if you're eligible

2. **Get Your Proof**
   - Download from GitHub repo: `dao/merkle-proofs.json`
   - Or fetch from API endpoint

3. **Submit Claim**
   ```javascript
   // Using ethers.js
   const contract = new ethers.Contract(DISTRIBUTOR_ADDRESS, ABI, signer);
   await contract.claim(amount, proof);
   ```

4. **Verify Receipt**
   - Check wallet balance
   - View transaction on block explorer

### Web Interface

We provide a simple web interface:
- Connect wallet (MetaMask, WalletConnect)
- Auto-detect eligibility
- One-click claiming
- Transaction status tracking

## Security Considerations

### For Contract

- **Access Control**: Only authorized addresses can set root
- **Reentrancy Protection**: Use OpenZeppelin's ReentrancyGuard
- **Audit Required**: Professional audit before deployment
- **Testing**: Comprehensive test coverage
- **Upgradability**: Consider proxy pattern

### For Users

- **Verify Contract**: Check official contract address
- **Verify Amount**: Confirm allocation before claiming
- **Gas Estimation**: Estimate gas before transaction
- **Phishing Protection**: Only use official interfaces
- **Proof Privacy**: Proofs are public, not sensitive

## Troubleshooting

### Common Issues

**"Invalid proof"**
- Ensure using correct proof for your address
- Verify Merkle root matches on-chain
- Check allocation amount is exact

**"Already claimed"**
- Each address can only claim once
- Check if you claimed previously
- Verify you're using correct wallet

**"Transfer failed"**
- Contract may be out of tokens
- Check contract balance
- Contact team

### Getting Help

- Check [claiming.md](claiming.md)
- GitHub Issues
- Discord support channel
- Email: dao@cuberai.example

## Tools & Scripts

### Generate Merkle Tree
```bash
node dao/merkle/generate_merkle.js --input allocations.json
```

### Verify Proof
```bash
node dao/merkle/verify_proof.js --address 0x123... --amount 1000 --proof proof.json
```

### Batch Check Claims
```bash
node dao/merkle/check_claims.js --addresses addresses.txt
```

## Timeline

Typical airdrop timeline:
1. **Week 1**: Contribution snapshot & scoring
2. **Week 2**: Community review & disputes
3. **Week 3**: Merkle tree generation & contract deployment
4. **Week 4**: Claiming period begins
5. **Month 3**: First claiming period ends
6. **Ongoing**: Unclaimed tokens handling

## Unclaimed Tokens

After 90 days:
- Reminder sent to unclaimed addresses
- Extended deadline announced

After 180 days:
- Unclaimed tokens returned to treasury
- Used for future distributions or burned (per DAO vote)

## Resources

- [Eligibility Criteria](eligibility.md)
- [Scoring Formula](scoring.md)
- [Claiming Process](claiming.md)
- [Generator Script](../../dao/merkle/generate_merkle.js)

---

Last updated: 2026-01-01
>>>>>>> origin/pr9
