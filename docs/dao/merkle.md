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
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleDistributor {
    IERC20 public token;
    bytes32 public merkleRoot;
    mapping(address => bool) public claimed;
    
    event Claimed(address indexed account, uint256 amount);
    
    constructor(IERC20 _token, bytes32 _merkleRoot) {
        token = _token;
        merkleRoot = _merkleRoot;
    }
    
    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!claimed[msg.sender], "Already claimed");
        
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, amount));
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");
        
        claimed[msg.sender] = true;
        require(token.transfer(msg.sender, amount), "Transfer failed");
        
        emit Claimed(msg.sender, amount);
    }
    
    function isClaimed(address account) external view returns (bool) {
        return claimed[account];
    }
}
```

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
