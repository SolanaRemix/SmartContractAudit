# DAO Documentation

## Overview

This directory contains documentation and tools for the SmartContractAudit DAO (Decentralized Autonomous Organization) and contributor reward systems.

## Contents

- **[eligibility.md](eligibility.md)**: Criteria for DAO participation and airdrop eligibility
- **[scoring.md](scoring.md)**: Contribution scoring methodology
- **[merkle.md](merkle.md)**: Merkle tree generation for token distribution
- **[snapshot.md](snapshot.md)**: How snapshots are taken for airdrops
- **[claiming.md](claiming.md)**: Process for claiming airdrop allocations

## Purpose

The DAO tools and documentation serve to:

1. **Recognize Contributors**: Fairly reward community contributions
2. **Enable Governance**: Distribute governance tokens for decision-making
3. **Build Community**: Incentivize long-term participation
4. **Transparency**: Provide clear rules and processes

## Quick Start

### For Contributors

1. Review [eligibility.md](eligibility.md) to understand qualification criteria
2. Check [scoring.md](scoring.md) to see how contributions are valued
3. Wait for snapshot announcement (see [snapshot.md](snapshot.md))
4. Follow [claiming.md](claiming.md) to claim your allocation

### For Administrators

1. Review contributor data and calculate scores
2. Generate merkle tree using `/dao/merkle/generate_merkle.js`
3. Take snapshot per [snapshot.md](snapshot.md) process
4. Publish merkle root and enable claiming

## Tools

- **Merkle Generator**: `/dao/merkle/generate_merkle.js`
  - Generates merkle trees for token distribution
  - Produces proof files for individual claimants
  - Verifies allocation integrity

- **Availability Checker**: `/scripts/availability-check.sh`
  - Checks username availability across platforms
  - Validates contributor handles
  - Prevents impersonation

## Sample Data

See `/dao/airdrop-sample.json` for example allocation data structure.

## Important Notes

### Security

- All operations default to DRY_RUN mode
- Never commit real private keys or secrets
- Verify merkle roots before deployment
- Use multisig for token distribution contracts

### Privacy

- Contributor data handling follows PRIVACY.md
- Personal information minimized
- Public addresses only when necessary
- Opt-in for public recognition

### Fairness

- Clear, published criteria
- Transparent scoring methodology
- Appeal process for disputes
- Regular community review of rules

## Governance Integration

DAO tokens may be used for:

- Voting on project proposals
- Electing maintainers
- Funding allocation decisions
- Feature prioritization
- Policy changes

See GOVERNANCE.md for how DAO governance integrates with project governance.

## Roadmap

- [ ] Initial airdrop allocation
- [ ] Merkle tree generation and verification
- [ ] Smart contract deployment (if applicable)
- [ ] Claiming interface
- [ ] Governance voting interface
- [ ] Regular contributor rewards
- [ ] Community grants program

## Resources

- **Governance**: See `/GOVERNANCE.md`
- **Contributing**: See `/CONTRIBUTING.md`
- **Security**: See `/SECURITY.md`
- **Support**: Open an issue or discussion

## Contact

- **General Questions**: GitHub Discussions
- **Allocation Issues**: Open a GitHub issue with tag `dao`
- **Security Concerns**: security@cuberai.example

---

**Last Updated**: 2026-01-01  
**Status**: Planning/Development
