#!/usr/bin/env node

/**
<<<<<<< HEAD
 * Merkle Tree Generator for DAO Token Airdrops
 * 
 * This script generates a merkle tree from an allocation JSON file
 * and outputs merkle root and proofs for claiming.
 * 
 * Usage:
 *   node generate_merkle.js <input.json> <output.json>
 * 
 * Example:
 *   node generate_merkle.js ../airdrop-sample.json output.json
 * 
 * Input format:
 * [
 *   {
 *     "address": "0x...",
 *     "amount": "1000000000000000000",
 *     "score": 500
 *   }
 * ]
 * 
 * Output format:
 * {
 *   "merkleRoot": "0x...",
 *   "claims": {
 *     "0x...": {
 *       "index": 0,
 *       "amount": "1000000000000000000",
 *       "proof": ["0x...", "0x..."]
 *     }
 *   }
 * }
 * 
 * SECURITY NOTE: No secrets or private keys required.
 * This script only processes public allocation data.
 */

const fs = require('fs');
const crypto = require('crypto');

// Simple keccak256 implementation (in production, use ethers.js or web3.js)
function keccak256(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// Encode address and amount (simplified - use ethers.js abi.encode in production)
function encodeLeaf(index, address, amount) {
  const data = `${index}${address}${amount}`;
  return keccak256(data);
}

// Build merkle tree from leaves
function buildMerkleTree(leaves) {
  if (leaves.length === 0) {
    throw new Error('Cannot build tree with no leaves');
  }
  
  let currentLevel = leaves;
  const tree = [currentLevel];
  
  while (currentLevel.length > 1) {
    const nextLevel = [];
    
    for (let i = 0; i < currentLevel.length; i += 2) {
      const left = currentLevel[i];
      const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : currentLevel[i];
      
      // Sort pair to ensure deterministic tree
      const pair = [left, right].sort();
      const combined = keccak256(pair[0] + pair[1]);
      nextLevel.push(combined);
    }
    
    currentLevel = nextLevel;
    tree.push(currentLevel);
  }
  
  return tree;
}

// Generate merkle proof for a specific leaf
function getProof(tree, leafIndex) {
  const proof = [];
  let index = leafIndex;
  
  for (let level = 0; level < tree.length - 1; level++) {
    const currentLevel = tree[level];
    const isRightNode = index % 2 === 1;
    const siblingIndex = isRightNode ? index - 1 : index + 1;
    
    if (siblingIndex < currentLevel.length) {
      proof.push('0x' + currentLevel[siblingIndex]);
    }
    
    index = Math.floor(index / 2);
  }
  
  return proof;
}

// Main function
function generateMerkleData(inputFile, outputFile) {
  console.log('🌳 Merkle Tree Generator');
  console.log('========================\n');
  
  // Read input file
  console.log(`📖 Reading input: ${inputFile}`);
  const rawData = fs.readFileSync(inputFile, 'utf8');
  const allocations = JSON.parse(rawData);
  
  console.log(`✅ Found ${allocations.length} allocations\n`);
  
  // Validate allocations
  console.log('🔍 Validating data...');
  for (let i = 0; i < allocations.length; i++) {
    const alloc = allocations[i];
    if (!alloc.address || !alloc.amount) {
      throw new Error(`Invalid allocation at index ${i}: missing address or amount`);
    }
  }
  console.log('✅ Data validation passed\n');
  
  // Generate leaves
  console.log('🌱 Generating leaves...');
  const leaves = allocations.map((alloc, index) => {
    return encodeLeaf(index, alloc.address, alloc.amount);
  });
  console.log(`✅ Generated ${leaves.length} leaves\n`);
  
  // Build tree
  console.log('🌳 Building merkle tree...');
  const tree = buildMerkleTree(leaves);
  const merkleRoot = '0x' + tree[tree.length - 1][0];
  console.log(`✅ Tree built with ${tree.length} levels`);
  console.log(`📝 Merkle Root: ${merkleRoot}\n`);
  
  // Generate proofs for each allocation
  console.log('🔐 Generating proofs...');
  const claims = {};
  
  for (let i = 0; i < allocations.length; i++) {
    const alloc = allocations[i];
    const proof = getProof(tree, i);
    
    claims[alloc.address] = {
      index: i,
      amount: alloc.amount,
      score: alloc.score || 0,
      proof: proof
    };
  }
  console.log(`✅ Generated ${Object.keys(claims).length} proofs\n`);
  
  // Create output data
  const output = {
    merkleRoot: merkleRoot,
    tokenTotal: allocations.reduce((sum, a) => sum + BigInt(a.amount), BigInt(0)).toString(),
    claims: claims
  };
  
  // Write output file
  console.log(`💾 Writing output: ${outputFile}`);
  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
  console.log('✅ Output file written\n');
  
  // Summary
  console.log('📊 Summary');
  console.log('==========');
  console.log(`Total Allocations: ${allocations.length}`);
  console.log(`Merkle Root: ${merkleRoot}`);
  console.log(`Total Tokens: ${output.tokenTotal}`);
  console.log(`\n✨ Done! Merkle tree generated successfully.\n`);
  
  // Instructions
  console.log('📋 Next Steps:');
  console.log('1. Review the output file to verify correctness');
  console.log('2. Publish merkle root and claims data publicly');
  console.log('3. Deploy smart contract with merkle root (if on-chain)');
  console.log('4. Announce claim period to eligible recipients');
  console.log('5. Monitor claims and provide support as needed\n');
  
  console.log('⚠️  IMPORTANT: Keep the output file secure but accessible');
  console.log('    Recipients will need their proofs to claim tokens.\n');
=======
 * Merkle Tree Generator for Token Airdrops
 * 
 * This script generates a Merkle tree from token allocation data
 * and produces proofs for each recipient.
 * 
 * Usage:
 *   node generate_merkle.js --input allocations.json --output merkle-tree.json
 * 
 * NO SECRETS - This script does not contain or require any private keys
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple Merkle tree implementation (no external dependencies for security)
class MerkleTree {
  constructor(leaves) {
    this.leaves = leaves.map(leaf => this.hash(leaf));
    this.tree = this.buildTree(this.leaves);
    this.root = this.tree[this.tree.length - 1][0];
  }

  hash(data) {
    return crypto.createHash('sha256').update(data).digest();
  }

  buildTree(leaves) {
    if (leaves.length === 0) {
      return [[]];
    }

    const tree = [leaves];
    let currentLevel = leaves;

    while (currentLevel.length > 1) {
      const nextLevel = [];
      
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = i + 1 < currentLevel.length ? currentLevel[i + 1] : left;
        
        const combined = Buffer.concat([left, right].sort(Buffer.compare));
        nextLevel.push(this.hash(combined));
      }
      
      tree.push(nextLevel);
      currentLevel = nextLevel;
    }

    return tree;
  }

  getProof(leaf) {
    const leafHash = this.hash(leaf);
    const leafIndex = this.leaves.findIndex(l => l.equals(leafHash));
    
    if (leafIndex === -1) {
      return null;
    }

    const proof = [];
    let index = leafIndex;

    for (let level = 0; level < this.tree.length - 1; level++) {
      const levelData = this.tree[level];
      const isRightNode = index % 2 === 1;
      const siblingIndex = isRightNode ? index - 1 : index + 1;

      if (siblingIndex < levelData.length) {
        proof.push({
          position: isRightNode ? 'left' : 'right',
          data: levelData[siblingIndex].toString('hex')
        });
      }

      index = Math.floor(index / 2);
    }

    return proof;
  }

  verify(leaf, proof, root) {
    let hash = this.hash(leaf);

    for (const node of proof) {
      const sibling = Buffer.from(node.data, 'hex');
      
      if (node.position === 'left') {
        const combined = Buffer.concat([sibling, hash].sort(Buffer.compare));
        hash = this.hash(combined);
      } else {
        const combined = Buffer.concat([hash, sibling].sort(Buffer.compare));
        hash = this.hash(combined);
      }
    }

    return hash.equals(Buffer.from(root, 'hex'));
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    options[key] = value;
  }

  return options;
}

// Main function
function main() {
  const options = parseArgs();
  
  const inputPath = options.input || '../airdrop-sample.json';
  const outputPath = options.output || './merkle-tree.json';

  console.log('🌳 Merkle Tree Generator');
  console.log('========================\n');

  // Read allocation data
  console.log(`📖 Reading allocations from: ${inputPath}`);
  
  let allocations;
  try {
    const data = fs.readFileSync(path.resolve(__dirname, inputPath), 'utf8');
    allocations = JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading input file:', error.message);
    process.exit(1);
  }

  // Prepare leaves
  console.log(`\n📊 Processing ${Object.keys(allocations.allocations).length} allocations...`);
  
  const leaves = [];
  const leafMap = {};

  for (const [address, data] of Object.entries(allocations.allocations)) {
    const leaf = `${address}:${data.amount}`;
    leaves.push(leaf);
    leafMap[address] = { leaf, amount: data.amount };
  }

  // Generate Merkle tree
  console.log('\n🌲 Building Merkle tree...');
  const tree = new MerkleTree(leaves);
  const root = tree.root.toString('hex');
  
  console.log(`\n✅ Merkle root: 0x${root}`);

  // Generate proofs
  console.log('\n🔑 Generating proofs...');
  const proofs = {};

  for (const [address, { leaf, amount }] of Object.entries(leafMap)) {
    const proof = tree.getProof(leaf);
    
    if (proof) {
      proofs[address] = {
        amount,
        proof: proof.map(p => `0x${p.data}`),
        leaf: crypto.createHash('sha256').update(leaf).digest('hex')
      };
      
      // Verify proof
      const isValid = tree.verify(leaf, proof, root);
      if (!isValid) {
        console.error(`❌ Invalid proof for ${address}`);
      }
    }
  }

  console.log(`✅ Generated ${Object.keys(proofs).length} proofs`);

  // Prepare output
  const output = {
    version: '1.0',
    generated: new Date().toISOString(),
    merkleRoot: `0x${root}`,
    totalRecipients: Object.keys(proofs).length,
    totalAmount: allocations.total_supply,
    proofs
  };

  // Write output
  console.log(`\n💾 Writing output to: ${outputPath}`);
  try {
    fs.writeFileSync(
      path.resolve(__dirname, outputPath),
      JSON.stringify(output, null, 2)
    );
    console.log('✅ Output written successfully');
  } catch (error) {
    console.error('❌ Error writing output file:', error.message);
    process.exit(1);
  }

  // Summary
  console.log('\n📋 Summary:');
  console.log(`   Merkle Root: 0x${root}`);
  console.log(`   Total Recipients: ${Object.keys(proofs).length}`);
  console.log(`   Output File: ${outputPath}`);
  console.log('\n✨ Done! Use the merkle root in your smart contract.');
  console.log('📤 Distribute the proofs file to recipients for claiming.');
>>>>>>> origin/pr9
}

// Run if called directly
if (require.main === module) {
<<<<<<< HEAD
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.error('❌ Usage: node generate_merkle.js <input.json> <output.json>');
    console.error('   Example: node generate_merkle.js ../airdrop-sample.json output.json');
    process.exit(1);
  }
  
  const [inputFile, outputFile] = args;
  
  try {
    generateMerkleData(inputFile, outputFile);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = { generateMerkleData, buildMerkleTree, getProof };
=======
  main();
}

module.exports = { MerkleTree };
>>>>>>> origin/pr9
