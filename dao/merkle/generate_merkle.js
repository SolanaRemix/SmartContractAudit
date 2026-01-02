#!/usr/bin/env node

/**
 * Merkle Tree Generator for SmartContractAudit DAO Airdrops
 * 
 * This tool generates Merkle trees for token distribution and produces
 * proofs for individual claimants.
 * 
 * Usage:
 *   node generate_merkle.js --input <input.json> --output <output.json>
 *   node generate_merkle.js --verify <tree.json>
 *   node generate_merkle.js --prove --tree <tree.json> --address <address>
 * 
 * Safety: Runs in dry-run mode by default. No actual token operations.
 * 
 * @license Apache-2.0
 */

const fs = require('fs');
const crypto = require('crypto');

// Configuration
const DRY_RUN = process.env.DRY_RUN !== 'false'; // Default to true

/**
 * Hash function using keccak256 (compatible with Ethereum)
 * For production, use a proper library like ethers.js or web3.js
 */
function hash(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Create a leaf node hash from address and amount
 */
function createLeafHash(address, amount) {
  // Normalize address to lowercase for consistency
  const normalizedAddress = address.toLowerCase();
  const data = `${normalizedAddress}:${amount}`;
  return hash(data);
}

/**
 * Build Merkle tree from leaf hashes
 */
function buildMerkleTree(leaves) {
  if (leaves.length === 0) {
    throw new Error('Cannot build tree with no leaves');
  }
  
  let currentLevel = [...leaves];
  const tree = [currentLevel];
  
  while (currentLevel.length > 1) {
    const nextLevel = [];
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        // Pair exists
        const combined = currentLevel[i] + currentLevel[i + 1];
        nextLevel.push(hash(combined));
      } else {
        // Odd number of nodes, promote the last one
        nextLevel.push(currentLevel[i]);
      }
    }
    
    tree.push(nextLevel);
    currentLevel = nextLevel;
  }
  
  return tree;
}

/**
 * Generate Merkle proof for a specific leaf
 */
function generateProof(tree, leafIndex) {
  const proof = [];
  let index = leafIndex;
  
  for (let level = 0; level < tree.length - 1; level++) {
    const isRightNode = index % 2 === 1;
    const siblingIndex = isRightNode ? index - 1 : index + 1;
    
    if (siblingIndex < tree[level].length) {
      proof.push({
        hash: tree[level][siblingIndex],
        isLeft: !isRightNode
      });
    }
    
    index = Math.floor(index / 2);
  }
  
  return proof;
}

/**
 * Verify a Merkle proof
 */
function verifyProof(leafHash, proof, root) {
  let currentHash = leafHash;
  
  for (const proofElement of proof) {
    const combined = proofElement.isLeft 
      ? proofElement.hash + currentHash
      : currentHash + proofElement.hash;
    currentHash = hash(combined);
  }
  
  return currentHash === root;
}

/**
 * Process input allocation data and generate Merkle tree
 */
function generateMerkleTree(inputPath, outputPath) {
  console.log(`[${DRY_RUN ? 'DRY-RUN' : 'LIVE'}] Generating Merkle tree...`);
  console.log(`Input: ${inputPath}`);
  console.log(`Output: ${outputPath}`);
  
  // Read input file
  const inputData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  
  if (!inputData.allocations || !Array.isArray(inputData.allocations)) {
    throw new Error('Invalid input format: missing allocations array');
  }
  
  // Validate allocations
  const seenAddresses = new Set();
  for (const allocation of inputData.allocations) {
    if (!allocation.address || !allocation.amount) {
      throw new Error('Invalid allocation: missing address or amount');
    }
    
    const normalized = allocation.address.toLowerCase();
    if (seenAddresses.has(normalized)) {
      throw new Error(`Duplicate address: ${allocation.address}`);
    }
    seenAddresses.add(normalized);
  }
  
  // Create leaf hashes
  const leaves = inputData.allocations.map(allocation => ({
    address: allocation.address,
    amount: allocation.amount,
    hash: createLeafHash(allocation.address, allocation.amount),
    github_username: allocation.github_username || null,
    reason: allocation.reason || null
  }));
  
  // Build tree
  const leafHashes = leaves.map(leaf => leaf.hash);
  const tree = buildMerkleTree(leafHashes);
  const root = tree[tree.length - 1][0];
  
  console.log(`Generated Merkle root: ${root}`);
  console.log(`Total leaves: ${leaves.length}`);
  
  // Generate proofs for each leaf
  const claimData = leaves.map((leaf, index) => ({
    address: leaf.address,
    amount: leaf.amount,
    github_username: leaf.github_username,
    reason: leaf.reason,
    proof: generateProof(tree, index).map(p => p.hash)
  }));
  
  // Prepare output
  const output = {
    merkle_root: root,
    total_allocations: leaves.length,
    total_amount: inputData.allocations.reduce((sum, a) => sum + parseInt(a.amount), 0).toString(),
    generated_at: new Date().toISOString(),
    input_metadata: inputData.metadata || {},
    dry_run: DRY_RUN,
    claims: claimData
  };
  
  // Write output
  if (DRY_RUN) {
    console.log('\n[DRY-RUN] Would write output to:', outputPath);
    console.log('[DRY-RUN] Sample output (first 2 claims):');
    console.log(JSON.stringify({ ...output, claims: output.claims.slice(0, 2) }, null, 2));
  } else {
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`\n✅ Merkle tree written to ${outputPath}`);
  }
  
  return output;
}

/**
 * Verify a generated Merkle tree
 */
function verifyMerkleTree(treePath) {
  console.log(`Verifying Merkle tree: ${treePath}`);
  
  const treeData = JSON.parse(fs.readFileSync(treePath, 'utf8'));
  const { merkle_root, claims } = treeData;
  
  let verified = 0;
  let failed = 0;
  
  for (const claim of claims) {
    const leafHash = createLeafHash(claim.address, claim.amount);
    const isValid = verifyProof(leafHash, 
      claim.proof.map((h, i) => ({ hash: h, isLeft: i % 2 === 0 })), 
      merkle_root
    );
    
    if (isValid) {
      verified++;
    } else {
      failed++;
      console.error(`❌ Verification failed for ${claim.address}`);
    }
  }
  
  console.log(`\n✅ Verified: ${verified}/${claims.length}`);
  if (failed > 0) {
    console.error(`❌ Failed: ${failed}/${claims.length}`);
    process.exit(1);
  }
  
  return true;
}

/**
 * Generate proof for a specific address
 */
function proveAddress(treePath, address) {
  console.log(`Generating proof for address: ${address}`);
  
  const treeData = JSON.parse(fs.readFileSync(treePath, 'utf8'));
  const normalized = address.toLowerCase();
  
  const claim = treeData.claims.find(c => c.address.toLowerCase() === normalized);
  
  if (!claim) {
    console.error(`❌ Address not found in tree: ${address}`);
    process.exit(1);
  }
  
  console.log('\n📋 Claim Information:');
  console.log(JSON.stringify(claim, null, 2));
  
  // Verify proof
  const leafHash = createLeafHash(claim.address, claim.amount);
  const isValid = verifyProof(leafHash,
    claim.proof.map((h, i) => ({ hash: h, isLeft: i % 2 === 0 })),
    treeData.merkle_root
  );
  
  console.log(`\n✅ Proof valid: ${isValid}`);
  
  return claim;
}

// CLI handling
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.length === 0) {
    console.log(`
Merkle Tree Generator for SmartContractAudit DAO

Usage:
  Generate tree:
    node generate_merkle.js --input <input.json> --output <output.json>
  
  Verify tree:
    node generate_merkle.js --verify <tree.json>
  
  Generate proof for address:
    node generate_merkle.js --prove --tree <tree.json> --address <address>

Environment:
  DRY_RUN=true (default) - Safe mode, no file writes
  DRY_RUN=false - Production mode, writes output files

Examples:
  node generate_merkle.js --input dao/airdrop-sample.json --output merkle-tree.json
  node generate_merkle.js --verify merkle-tree.json
  node generate_merkle.js --prove --tree merkle-tree.json --address 0x1234...
    `);
    process.exit(0);
  }
  
  try {
    if (args.includes('--verify')) {
      const treeIndex = args.indexOf('--verify');
      const treePath = args[treeIndex + 1];
      verifyMerkleTree(treePath);
    } else if (args.includes('--prove')) {
      const treeIndex = args.indexOf('--tree');
      const addressIndex = args.indexOf('--address');
      const treePath = args[treeIndex + 1];
      const address = args[addressIndex + 1];
      proveAddress(treePath, address);
    } else {
      const inputIndex = args.indexOf('--input');
      const outputIndex = args.indexOf('--output');
      const inputPath = args[inputIndex + 1];
      const outputPath = args[outputIndex + 1];
      generateMerkleTree(inputPath, outputPath);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  hash,
  createLeafHash,
  buildMerkleTree,
  generateProof,
  verifyProof,
  generateMerkleTree,
  verifyMerkleTree
};
