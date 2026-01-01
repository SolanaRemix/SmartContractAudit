# DAO Overview

## Introduction

SmartContractAudit DAO enables decentralized governance and community participation through token-based voting and contributor rewards.

## Governance Flow

### 1. Proposal Creation

Community members can create proposals for:
- Feature requests
- Budget allocation
- Partnership decisions
- Technical changes
- Token distribution

### 2. Discussion Phase

- Proposals posted to GitHub Discussions
- Community debate period (minimum 7 days)
- Feedback and refinement
- Impact assessment

### 3. Snapshot Voting

- Proposals moved to Snapshot for voting
- Token holders vote based on their holdings
- Voting period: 7 days
- Quorum requirements apply

### 4. Execution

Approved proposals are executed by:
- **On-chain**: Multisig transactions for financial/contract changes
- **Off-chain**: Implementation by maintainers for code/policy changes

### 5. Implementation Tracking

- Progress tracked in GitHub Projects
- Regular status updates
- Completion verification
- Results published

## Governance Structure

### Snapshot + Multisig

We use a hybrid governance model:

**Snapshot (Off-chain Voting)**
- Gas-free voting
- Token-weighted votes
- Flexible strategies
- Transparent results

**Multisig (On-chain Execution)**
- Secure fund management
- Multi-signature approval
- On-chain transparency
- Emergency controls

### Key Roles

**Token Holders**
- Vote on proposals
- Earn tokens through contributions
- Participate in governance

**Multisig Signers**
- Execute approved proposals
- Manage treasury
- Emergency response
- Typically 3-5 trusted members

**Maintainers**
- Implement approved changes
- Technical execution
- Report progress
- Community liaison

## Voting Power

Voting power is based on:
1. Token holdings (primary)
2. Contribution history (weighted)
3. Staking duration (bonus)
4. Delegation (optional)

See [scoring.md](scoring.md) for detailed calculation.

## Proposal Types

### Standard Proposals
- Feature requests
- Budget allocation <$10k
- Minor policy changes
- Quorum: 10% of tokens

### Major Proposals
- Protocol upgrades
- Large budget allocation >$10k
- Major policy changes
- Quorum: 25% of tokens

### Emergency Proposals
- Security issues
- Critical bug fixes
- Accelerated timeline
- Multisig can act immediately, ratified post-facto

## Governance Token

**Token Details**:
- Name: [DAO Token Name]
- Symbol: [SYMBOL]
- Network: [Ethereum/Solana/etc.]
- Contract: [Address]

**Token Distribution**:
- Contributors: 60%
- Treasury: 20%
- Early supporters: 10%
- Team: 10% (vested)

See [eligibility.md](eligibility.md) for earning tokens.

## Snapshot Space

**Space Details**:
- URL: snapshot.org/#/smartcontractaudit.eth
- Voting strategies configured
- Proposal templates available
- Historical votes visible

See [snapshot.md](snapshot.md) for setup details.

## Multisig Details

**Multisig Wallet**:
- Network: [Network]
- Address: [Address]
- Signers: [Number] of [Total]
- Platform: Gnosis Safe / Squads

**Transaction Flow**:
1. Proposal approved on Snapshot
2. Multisig signer creates transaction
3. Other signers review and approve
4. Transaction executed on-chain
5. Results announced to community

## Participation Guidelines

### Creating Proposals

1. **Research**: Check existing proposals and discussions
2. **Draft**: Write clear, detailed proposal
3. **Discuss**: Post to GitHub Discussions for feedback
4. **Refine**: Incorporate community input
5. **Submit**: Create Snapshot proposal
6. **Promote**: Share with community to encourage voting

### Voting Best Practices

- Read proposals thoroughly
- Consider long-term impact
- Participate in discussions
- Vote based on merit, not politics
- Respect minority opinions

### Delegation

Token holders can delegate voting power to:
- Trusted community members
- Subject matter experts
- Active participants

Delegation is revocable at any time.

## Resources

- [Eligibility Criteria](eligibility.md)
- [Contribution Scoring](scoring.md)
- [Merkle Airdrops](merkle.md)
- [Snapshot Setup](snapshot.md)
- [Claiming Process](claiming.md)

## FAQ

**Q: How do I earn governance tokens?**
A: Contribute to the project! See [eligibility.md](eligibility.md) for criteria.

**Q: When are airdrops?**
A: Quarterly distributions based on contributions. See [merkle.md](merkle.md).

**Q: Can I delegate my voting power?**
A: Yes, through Snapshot delegation features.

**Q: What happens if a proposal doesn't reach quorum?**
A: It can be resubmitted after refinement and community building.

## Contact

For DAO governance questions:
- GitHub Discussions
- Discord: [Link]
- Telegram: [Link]

---

Last updated: 2026-01-01
