#!/usr/bin/env node

/**
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
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { MerkleTree };
