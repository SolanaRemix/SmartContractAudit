<<<<<<< HEAD
# Snapshot Integration

## Overview

This document explains how SmartContractAudit uses Snapshot for gasless, off-chain governance voting.

## What is Snapshot?

[Snapshot](https://snapshot.org) is a decentralized voting platform that enables:

- **Gasless Voting**: Vote without transaction fees
- **Off-Chain Storage**: Votes stored on IPFS
- **Flexible Strategies**: Custom voting power calculations
- **Easy Integration**: Simple setup for DAOs
- **Transparent Results**: Public, verifiable voting

## Snapshot Space Setup

### Creating the Space

**Not yet created** - To be set up by maintainers

Once created, the space will be accessible at:
`https://snapshot.org/#/smartcontractaudit.eth`

### Space Configuration

#### Basic Settings

```json
{
  "name": "SmartContractAudit",
  "network": "1",
  "symbol": "SCAUDIT",
  "skin": "smartcontractaudit",
  "domain": "smartcontractaudit.eth",
  "about": "Governance for SmartContractAudit - automated smart contract auditing and security",
  "avatar": "[LOGO URL]",
  "twitter": "[TWITTER HANDLE]",
  "github": "SolanaRemix/SmartContractAudit",
  "website": "[PROJECT WEBSITE]"
}
```

#### Voting Settings
=======
# Snapshot Space Setup & Strategies

## Overview

Snapshot is a gasless, off-chain voting platform used by SmartContractAudit DAO for governance proposals. This document explains our Snapshot configuration and voting strategies.

## Snapshot Space

**Space Name**: SmartContractAudit
**ENS**: smartcontractaudit.eth (placeholder)
**Network**: Ethereum Mainnet
**URL**: snapshot.org/#/smartcontractaudit.eth

## Space Configuration

### Basic Settings

```json
{
  "name": "SmartContractAudit DAO",
  "network": "1",
  "symbol": "SCA",
  "skin": "smartcontractaudit",
  "domain": "smartcontractaudit.eth",
  "about": "Decentralized governance for SmartContractAudit - automated security scanning and smart contract auditing",
  "website": "https://github.com/SolanaRemix/SmartContractAudit",
  "twitter": "@SmartContractAudit",
  "github": "SolanaRemix",
  "terms": "https://github.com/SolanaRemix/SmartContractAudit/blob/main/GOVERNANCE.md"
}
```

### Proposal Settings
>>>>>>> origin/pr9

```json
{
  "voting": {
    "delay": 0,
    "period": 604800,
    "type": "basic",
    "quorum": 0,
    "hideAbstain": false
<<<<<<< HEAD
  }
}
```

**Explanation**:
- `delay`: 0 seconds (voting starts immediately)
- `period`: 604800 seconds (7 days)
- `type`: basic (yes/no/abstain)
- `quorum`: No minimum (can be added later)

#### Proposal Validation

```json
{
  "validation": {
    "name": "basic",
    "params": {
      "minScore": 100
    }
  }
}
```

**Requirements to create proposals**:
- Minimum 100 tokens
- Prevents spam proposals

## Voting Strategies

### Token-Based Strategy

**Primary Strategy**: ERC20 balance snapshot

```json
{
=======
  },
>>>>>>> origin/pr9
  "strategies": [
    {
      "name": "erc20-balance-of",
      "network": "1",
      "params": {
<<<<<<< HEAD
        "address": "[TOKEN_CONTRACT_ADDRESS]",
        "symbol": "SCAUDIT",
        "decimals": 18
      }
    }
  ]
}
```

### Multi-Strategy (Advanced)

Can combine multiple strategies:

```json
{
  "strategies": [
    {
      "name": "erc20-balance-of",
      "network": "1",
      "params": {
        "address": "[TOKEN_CONTRACT]",
        "symbol": "SCAUDIT",
=======
        "address": "0x...",
        "symbol": "SCA",
>>>>>>> origin/pr9
        "decimals": 18
      }
    },
    {
      "name": "delegation",
      "network": "1",
      "params": {
<<<<<<< HEAD
        "symbol": "SCAUDIT",
        "strategies": [
          {
            "name": "erc20-balance-of",
            "params": {
              "address": "[TOKEN_CONTRACT]"
            }
          }
        ]
      }
    }
  ]
}
```

**Supports**:
- Token holdings
- Delegated voting power
- LP token holdings (if applicable)
- NFT holdings (if applicable)

### Custom Strategy

For complex voting power calculations:

```javascript
// Example: Weighted by contribution score + token holdings
function calculateVotingPower(address) {
  const tokens = getTokenBalance(address);
  const contributionScore = getContributionScore(address);
  
  // 50% from tokens, 50% from contributions
  return (tokens * 0.5) + (contributionScore * 0.5);
}
```

## Proposal Types

### Governance Proposals

**Format**:
```markdown
# [Proposal Title]
=======
        "symbol": "SCA",
        "strategies": []
      }
    }
  ],
  "validation": {
    "name": "basic",
    "params": {
      "minScore": 1
    }
  }
}
```

## Voting Strategies

We use multiple strategies to calculate voting power:

### 1. Token Balance Strategy

**Strategy**: `erc20-balance-of`

Counts tokens held in wallet at proposal snapshot time.

```json
{
  "name": "erc20-balance-of",
  "network": "1",
  "params": {
    "address": "0xYourTokenAddress",
    "symbol": "SCA",
    "decimals": 18
  }
}
```

**Voting Power**: 1 token = 1 vote

### 2. Delegation Strategy

**Strategy**: `delegation`

Allows token holders to delegate voting power.

```json
{
  "name": "delegation",
  "network": "1",
  "params": {
    "symbol": "SCA (delegated)",
    "strategies": [
      {
        "name": "erc20-balance-of",
        "params": {
          "address": "0xYourTokenAddress",
          "symbol": "SCA",
          "decimals": 18
        }
      }
    ]
  }
}
```

### 3. Contribution Strategy (Custom)

**Strategy**: `contribution-score`

Bonus voting power based on contribution history.

```json
{
  "name": "api",
  "network": "1",
  "params": {
    "url": "https://api.smartcontractaudit.io/snapshot/scores/{addresses}",
    "symbol": "CONTRIB"
  }
}
```

**Calculation**:
- Pull contribution scores from API
- Contribution score / 100 = bonus votes
- Capped at 20% of token-based voting power

### 4. Staking Strategy

**Strategy**: `contract-call`

Bonus for staked tokens.

```json
{
  "name": "contract-call",
  "network": "1",
  "params": {
    "address": "0xStakingContractAddress",
    "decimals": 18,
    "symbol": "xSCA",
    "methodABI": {
      "name": "balanceOf",
      "type": "function",
      "inputs": [
        {
          "name": "account",
          "type": "address"
        }
      ],
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ]
    }
  }
}
```

**Multiplier**: Staked tokens = 1.5x voting power

## Proposal Types

### Standard Proposal

```markdown
Title: [Proposal Name]
>>>>>>> origin/pr9

## Summary
Brief description of the proposal

## Motivation
Why this proposal is needed

## Specification
<<<<<<< HEAD
Detailed proposal implementation

## Voting Options
- For: Support the proposal
- Against: Oppose the proposal  
- Abstain: No opinion
```

### Proposal Categories

1. **Feature Requests**: New functionality
2. **Parameter Changes**: Adjust governance parameters
3. **Treasury Allocation**: Fund distribution decisions
4. **Partnership Approvals**: Major partnerships
5. **Security Policies**: Security-related changes
6. **Meta-Governance**: Changes to governance itself

## Creating a Proposal

### Prerequisites

- Minimum token balance (100 tokens)
- Connected wallet
- Clear proposal content
- Community discussion completed

### Steps

1. **Pre-Proposal Discussion**
   - Post in GitHub Discussions
   - Gather community feedback
   - Refine proposal
   - Build consensus

2. **Draft Proposal**
   - Write clear title
   - Complete all sections
   - Define voting options
   - Set voting period

3. **Submit to Snapshot**
   - Connect wallet to Snapshot
   - Navigate to space
   - Click "New Proposal"
   - Fill in details
   - Set voting period (typically 7 days)
   - Sign message (no gas cost)

4. **Announcement**
   - Post in GitHub Discussions
   - Notify community
   - Share voting link
   - Provide context

5. **Voting Period**
   - Monitor participation
   - Answer questions
   - Provide clarifications
   - Encourage voting

6. **Results**
   - Tally results
   - Announce outcome
   - Document decision
   - Implement if approved

## Voting Process

### For Token Holders

1. **Visit Snapshot Space**
   ```
   https://snapshot.org/#/smartcontractaudit.eth
   ```

2. **Connect Wallet**
   - Click "Connect Wallet"
   - Choose wallet provider
   - Approve connection

3. **Review Proposals**
   - Read active proposals
   - Review discussions
   - Consider options

4. **Cast Vote**
   - Select your choice
   - Sign message (gasless)
   - Vote recorded on IPFS

5. **Verify Vote**
   - Check vote appears
   - See your voting power
   - Confirm choice

### Voting Power

Your voting power is determined by:
- Token holdings at snapshot block
- Delegated tokens (if any)
- Contribution score (if applicable)

**Note**: Voting power is snapshot at proposal creation time. Buying tokens after won't increase voting power for that proposal.

## Delegation

### Delegate Your Voting Power

Don't have time to vote? Delegate to someone you trust:

1. **Choose Delegate**
   - Research active voters
   - Check voting history
   - Verify alignment with your values

2. **Set Delegation**
   - Use Snapshot delegation interface
   - Sign delegation message
   - Specify delegate address

3. **Update Anytime**
   - Change delegate anytime
   - Remove delegation
   - Vote directly (overrides delegation)

### Accepting Delegations

To accept delegations:
- Publicly share your address
- Communicate voting philosophy
- Vote regularly and responsibly
- Explain voting decisions

## Proposal Guidelines

### What Makes a Good Proposal?

✅ **Good proposals**:
- Clear and concise
- Well-researched
- Community support
- Actionable specification
- Consider consequences
- Define success metrics

❌ **Poor proposals**:
- Vague or unclear
- No community discussion
- Unrealistic or impossible
- Conflicts with values
- Lacks detail
- No consideration of alternatives

### Proposal Template

```markdown
# [Title]: [Brief Description]

## Summary
One paragraph summary of the proposal.

## Motivation
Why should we implement this? What problem does it solve?

## Specification
### Overview
High-level description

### Details
Specific implementation details

### Timeline
When and how will this be implemented?

### Cost
Resource requirements (funding, time, people)

## Risks & Considerations
What could go wrong? Alternative approaches?

## Success Metrics
How will we measure success?

## Voting Options
- **For**: Approve and implement the proposal
- **Against**: Reject the proposal
- **Abstain**: No opinion
```

## Governance Process

### Standard Flow

1. **Ideation** (GitHub Discussions)
2. **Temperature Check** (Informal poll)
3. **Formal Proposal** (Snapshot)
4. **Voting Period** (7 days)
5. **Implementation** (If approved)
6. **Post-Mortem** (Review results)

### Fast-Track Process

For urgent matters:

- Reduced voting period (3 days)
- Requires maintainer sponsorship
- Emergency situations only
- Security issues, critical bugs

### Quorum Requirements

**Current**: No quorum (may be added later)

**Potential future requirements**:
- Minimum 10% of total supply votes
- Scales with proposal importance
- Adjusted via governance proposal

## Integration with GitHub

### Linking Proposals

Reference Snapshot proposals in GitHub:

```markdown
**Snapshot Vote**: https://snapshot.org/#/smartcontractaudit.eth/proposal/[PROPOSAL_ID]
**Status**: Active / Passed / Rejected
**Voting Ends**: [DATE]
```

### Implementation Tracking

After proposal passes:

1. Create GitHub issue
2. Link to Snapshot proposal
3. Track implementation
4. Update community on progress

## Security & Best Practices

### Proposal Security

- **Review Carefully**: Check all details before voting
- **Verify Links**: Ensure official Snapshot space
- **Check Addresses**: Validate contract addresses
- **Be Skeptical**: Watch for scams and phishing

### Wallet Security

- **Use Hardware Wallet**: For large holdings
- **Verify Messages**: Read before signing
- **Check Network**: Ensure correct network
- **Revoke Permissions**: Disconnect when done

### Common Scams

⚠️ **Watch out for**:
- Fake Snapshot spaces
- Phishing sites mimicking Snapshot
- Malicious proposals requesting approvals
- Impersonators claiming to be team

✅ **Verify**:
- Official Snapshot URL: `snapshot.org`
- Correct space name
- Team announcements on GitHub
- Message content before signing

## FAQ

**Q: Does voting cost gas?**
A: No. Voting on Snapshot is gasless - you only sign a message.

**Q: When is voting power calculated?**
A: At the block when the proposal is created (snapshot block).

**Q: Can I change my vote?**
A: Yes, before the voting period ends.

**Q: Do I need tokens to vote?**
A: Yes, you need tokens at the snapshot block to have voting power.

**Q: What if I don't want to vote on everything?**
A: Delegate your voting power to someone you trust.

**Q: Are vote results binding?**
A: Typically yes, but maintainers have final say on implementation feasibility.

**Q: Can proposals be canceled?**
A: Yes, by the proposal creator or space admins in exceptional cases.

## Resources

### Official Links

- **Snapshot Platform**: https://snapshot.org
- **Documentation**: https://docs.snapshot.org
- **Space** (TBD): https://snapshot.org/#/smartcontractaudit.eth

### SmartContractAudit

- **GitHub**: https://github.com/SolanaRemix/SmartContractAudit
- **Discussions**: GitHub Discussions
- **Governance Docs**: [GOVERNANCE.md](../../GOVERNANCE.md)

### Tools

- **Snapshot Labs**: Official Snapshot tools
- **Snapshot Strategies**: Strategy browser
- **Delegation Portal**: Delegate voting power

## Contact

Questions about Snapshot or governance?

- **GitHub Discussions**: Governance category
- **Email**: governance@cuberai.example

---

**Status**: Planning Phase

**Snapshot Space**: Not yet created

**Last Updated**: 2026-01-01
=======
Technical details and implementation

## Benefits
Expected positive outcomes

## Risks
Potential downsides or concerns

## Timeline
Implementation schedule

## Voting Options
- For
- Against
- Abstain
```

### Financial Proposal

```markdown
Title: Budget Allocation for [Purpose]

## Amount Requested
X tokens / $Y USD

## Recipient
Address or entity receiving funds

## Purpose
What funds will be used for

## Milestones
- Milestone 1: Description, Amount
- Milestone 2: Description, Amount

## Reporting
How progress will be reported

## Voting Options
- Approve
- Reject
- Abstain
```

## Creating Proposals

### Prerequisites

1. **Minimum Token Balance**: 1000 tokens (prevents spam)
2. **Connected Wallet**: Wallet with eligible tokens
3. **ENS or Ethereum Address**: For identification

### Steps to Create

1. **Navigate to Space**
   - Visit snapshot.org/#/smartcontractaudit.eth
   - Connect wallet

2. **Click "New Proposal"**

3. **Fill in Details**
   - Title (clear and concise)
   - Description (use template above)
   - Discussion link (GitHub issue/discussion)
   - Voting options
   - Start/end dates
   - Snapshot block number

4. **Submit**
   - Sign message with wallet
   - Proposal appears immediately
   - Voting begins at start date

### Best Practices

- **Discussion First**: Post to GitHub Discussions before Snapshot
- **Clear Title**: Describe proposal in title
- **Detailed Description**: Provide all necessary context
- **Link to Discussion**: Reference prior community input
- **Reasonable Timeline**: Give voters enough time
- **Milestone Based**: Break large proposals into milestones

## Voting Process

### For Voters

1. **View Proposal**
   - Browse active proposals
   - Read full description
   - Check discussion thread

2. **Review Strategies**
   - See your voting power
   - Understand how it's calculated
   - Consider delegating if unable to participate

3. **Cast Vote**
   - Select option (For/Against/Abstain)
   - Sign message (gasless!)
   - Vote recorded on IPFS

4. **Results**
   - Live results visible
   - Voting power breakdown
   - Final results after end time

### Delegation

**Delegate Your Votes**:

1. Visit snapshot.org/#/delegate
2. Enter space: smartcontractaudit.eth
3. Enter delegate address
4. Sign message

**As a Delegate**:
- Act in best interest of delegators
- Provide reasoning for votes
- Stay informed on proposals
- Can be revoked anytime

## Admin Functions

### Space Settings

Admins can modify:
- Space information
- Voting strategies
- Validation rules
- Visual theme
- Moderators

### Proposal Moderation

Admins can:
- Mark proposals as spam
- Close malicious proposals
- Update proposal categories
- Pin important proposals

### Validation Rules

Current validation:
- Minimum 1 token to vote
- Minimum 1000 tokens to propose
- Account age > 30 days (if using GitHub)

## Integration with GitHub

### Automatic Proposal Creation

```yaml
# .github/workflows/snapshot-proposal.yml
name: Create Snapshot Proposal

on:
  issues:
    types: [labeled]

jobs:
  create-proposal:
    if: github.event.label.name == 'governance-proposal'
    runs-on: ubuntu-latest
    steps:
      - name: Parse issue
        # Extract proposal details from issue
      
      - name: Create Snapshot proposal
        # Use Snapshot API to create proposal
```

### Voting Results to GitHub

```yaml
# Post voting results back to GitHub issue
- name: Post results
  uses: actions/github-script@v6
  with:
    script: |
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        body: '## Voting Results\n...'
      })
```

## API Access

### Get Space Info

```javascript
const fetch = require('node-fetch');

const query = `
  query Space {
    space(id: "smartcontractaudit.eth") {
      id
      name
      about
      network
      symbol
      strategies {
        name
        params
      }
    }
  }
`;

const response = await fetch('https://hub.snapshot.org/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query })
});
```

### Get Proposals

```javascript
const query = `
  query Proposals {
    proposals(
      where: {
        space: "smartcontractaudit.eth"
        state: "active"
      }
    ) {
      id
      title
      body
      start
      end
      snapshot
      state
      scores
      scores_total
      votes
    }
  }
`;
```

### Create Proposal (SDK)

```javascript
const snapshot = require('@snapshot-labs/snapshot.js');

const client = new snapshot.Client712('https://hub.snapshot.org');

await client.proposal(web3Provider, address, {
  space: 'smartcontractaudit.eth',
  type: 'single-choice',
  title: 'Proposal Title',
  body: 'Proposal Description',
  choices: ['For', 'Against', 'Abstain'],
  start: Math.floor(Date.now() / 1000),
  end: Math.floor(Date.now() / 1000) + 604800, // 7 days
  snapshot: blockNumber,
  plugins: JSON.stringify({}),
  app: 'smartcontractaudit'
});
```

## Resources

- **Snapshot Documentation**: docs.snapshot.org
- **Our Space**: snapshot.org/#/smartcontractaudit.eth
- **Strategy Library**: snapshot.org/#/strategies
- **API Documentation**: docs.snapshot.org/tools/api

## Support

For help with Snapshot:
- **General**: GitHub Discussions
- **Technical**: dao@cuberai.example
- **Snapshot Support**: discord.snapshot.org

---

Last updated: 2026-01-01
>>>>>>> origin/pr9
