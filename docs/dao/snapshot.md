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

```json
{
  "voting": {
    "delay": 0,
    "period": 604800,
    "type": "basic",
    "quorum": 0,
    "hideAbstain": false
  },
  "strategies": [
    {
      "name": "erc20-balance-of",
      "network": "1",
      "params": {
        "address": "0x...",
        "symbol": "SCA",
        "decimals": 18
      }
    },
    {
      "name": "delegation",
      "network": "1",
      "params": {
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

## Summary
Brief description of the proposal

## Motivation
Why this proposal is needed

## Specification
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
