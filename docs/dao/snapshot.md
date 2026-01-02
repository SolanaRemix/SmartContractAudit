# Snapshot Process

## Overview

This document explains how CyberAi takes snapshots of contributor data for DAO token distribution.

## What is a Snapshot?

A **snapshot** is a point-in-time capture of:

- All eligible contributors
- Their contribution history
- Calculated scores
- Token allocations

Think of it as freezing the state of the project at a specific moment to determine who gets how many tokens.

## Why Take Snapshots?

### Fairness

- **Fixed target**: Contributors know the deadline
- **No retroactive changes**: Can't add contributions after snapshot
- **Transparent**: Everyone sees the same data
- **Predictable**: Announced well in advance

### Technical

- **Merkle tree generation**: Need fixed data set
- **Smart contract deployment**: Requires finalized allocations
- **Verification**: Community can audit the snapshot

### Operational

- **Manageable scope**: Defined set of contributions to score
- **Appeal window**: Time for disputes before distribution
- **Testing**: Can test claiming with real data

## Snapshot Schedule

### Announcement

**Minimum 14 days before snapshot:**

- Date and time (UTC) announced
- Block height or timestamp specified (for blockchain state)
- Eligibility criteria confirmed
- Scoring methodology version published
- Appeal process explained

**Announcement channels:**
- GitHub Discussions (pinned)
- Repository README
- Social media
- Email (if mailing list exists)

### Snapshot Execution

**On the announced date:**

1. **Capture GitHub data** (see Data Collection below)
2. **Record blockchain state** (if applicable, e.g., token holdings)
3. **Calculate scores** per scoring methodology
4. **Generate allocation list**
5. **Create merkle tree**

**Duration:** Typically 1-3 days for processing

### Post-Snapshot

1. **Publish results** (3-5 days after snapshot)
2. **Appeal period** (30 days)
3. **Final allocation** (after appeals resolved)
4. **Claiming opens** (date announced)

## Data Collection

### GitHub Contributions

**Data Sources:**
- Pull requests (merged, reviewed)
- Issues (created, commented, resolved)
- Discussions (participation, helpful responses)
- Code reviews (quality and quantity)
- Commits (if not via PR)

**Collection Method:**

```bash
# Example using GitHub API
# (actual implementation in snapshot scripts)

# Get all PRs merged before snapshot
gh pr list --state merged --limit 1000 \
  --json number,author,createdAt,mergedAt,additions,deletions

# Get all issues
gh issue list --state all --limit 1000 \
  --json number,author,createdAt,closedAt,comments

# Get code reviews
gh api /repos/OWNER/REPO/pulls/PR_NUMBER/reviews
```

**Timestamp:** All data uses GitHub's timestamps (UTC)

### Security Contributions

**Private vulnerability reports:**
- Collected separately from security@cyberai.network
- Manually scored by security team
- Privacy maintained (no public disclosure)

### Community Contributions

**External contributions:**
- Tutorials and blog posts (self-reported + verified)
- Event organization (documented in issues)
- Social media promotion (significant only)
- Translations and internationalization

## Score Calculation

### Process

1. **Collect raw contribution data** (automated)
2. **Classify contributions** (automated + manual review)
3. **Apply base point values** (per scoring.md)
4. **Apply multipliers** (time, impact, quality)
5. **Add bonuses** (special recognition)
6. **Apply caps** (individual and type limits)
7. **Generate preliminary scores**

### Review

1. **Automated validation** (sanity checks, outlier detection)
2. **Manual review** (top 10% and flagged cases)
3. **Anti-fraud checks** (sockpuppets, gaming detection)
4. **Quality assessment** (borderline cases)

### Output

```json
{
  "snapshot_date": "2026-01-01T00:00:00Z",
  "methodology_version": "1.0",
  "total_contributors": 150,
  "total_points": 50000,
  "contributors": [
    {
      "github_username": "contributor1",
      "address": "0x1234...5678",
      "total_points": 500,
      "breakdown": {
        "code": 300,
        "reviews": 100,
        "community": 50,
        "security": 50
      },
      "bonuses": {
        "early_contributor": 50,
        "consistency": 75
      }
    }
  ]
}
```

## Address Collection

### How Addresses are Collected

**Option 1: GitHub Profile**
- Add address to GitHub profile bio or special field
- Format: `Wallet: 0x1234...` or similar

**Option 2: Registration Issue**
- Open issue with specific template
- Provide address + GitHub username
- Sign message to prove ownership

**Option 3: Later Registration**
- Can register address even after snapshot
- Allocation reserved for 12 months
- Claim when ready

### Address Verification

To prevent fraud:

- **Sign message**: Prove you control the address
- **Email verification**: Confirm GitHub account ownership
- **Manual review**: Suspicious cases reviewed
- **Uniqueness**: Each address used only once

### Privacy

- Addresses optional for snapshot
- Can register address later for claiming
- Not published publicly unless you claim
- Only merkle proof needed (not full list)

## Verification and Audit

### Public Verification

After snapshot published, anyone can:

1. **Check their own score** against methodology
2. **Verify contribution counting** (GitHub is public)
3. **Recalculate scores** using published data
4. **Report discrepancies** for review

### Audit Trail

We publish:

- Snapshot data (contributions, scores)
- Methodology version used
- Scripts used for calculation (in repo)
- Merkle tree file
- Root hash

### Independent Audits

Community members can:

- Run scoring independently
- Verify merkle tree generation
- Check for calculation errors
- Validate against GitHub API

## Appeals Process

### Appeal Window

**30 days** from snapshot result publication

### How to Appeal

1. **Open GitHub Issue**
   - Use `dao-snapshot-appeal` tag
   - Include your GitHub username
   - Provide specific claim (what's wrong)

2. **Provide Evidence**
   - Links to contributions not counted
   - Calculation errors with correct math
   - Special circumstances explanation

3. **Wait for Review**
   - Response within 10 business days
   - May request additional information
   - Decision posted in issue

### Valid Appeal Reasons

✅ **Will consider:**
- Contributions not counted in snapshot
- Calculation errors (mathematical)
- Misclassification of contribution type
- Technical errors in data collection
- Special circumstances (with evidence)

❌ **Will NOT consider:**
- Disagreement with point values
- Contributions after snapshot date
- Requests to change methodology retroactively
- General dissatisfaction with allocation

### Appeal Outcomes

**Approved:**
- Score recalculated
- Allocation updated
- Merkle tree regenerated (if needed)
- Announced publicly

**Denied:**
- Explanation provided
- Original score stands
- Can dispute in governance (if persistent)

## Special Cases

### New Contributors After Snapshot

- Eligible for next snapshot
- Can participate in interim rewards (if available)
- Build contribution history for better allocation

### Inactive Contributors

- Included if active within 180 days before snapshot
- Allocations reserved for 12 months
- Unclaimed tokens may be redistributed

### Banned Contributors

- Code of Conduct violators excluded
- Manual review for borderline cases
- Can appeal ban per CODE_OF_CONDUCT.md

### Multiple Identities

- Only one GitHub account per person
- Sockpuppeting results in total exclusion
- Legitimate account changes handled case-by-case

## Timeline Example

**Day -14:** Snapshot announced (2026-01-01 00:00 UTC)  
**Day 0:** Snapshot taken  
**Day 3:** Data processing complete  
**Day 5:** Preliminary results published  
**Day 7:** Address registration opens  
**Day 35:** Appeal period ends  
**Day 40:** Final allocations published  
**Day 45:** Merkle tree generated  
**Day 50:** Claiming opens  

## Technical Details

### Block Height vs. Timestamp

**GitHub data:** Uses UTC timestamp  
**Blockchain data:** Uses block height (more deterministic)

**Example:**
- GitHub: 2026-01-01T00:00:00Z
- Solana: Block 150,000,000
- Ethereum: Block 18,000,000

### Data Storage

**Raw data:** Stored in private repository (privacy)  
**Aggregated data:** Published (addresses opt-in)  
**Merkle tree:** Public (required for claiming)  
**Audit logs:** Retained per DATA_RETENTION.md

### Automation

Scripts provided in repository:

```bash
# Collect GitHub data
./scripts/snapshot/collect-data.sh

# Calculate scores
./scripts/snapshot/calculate-scores.sh

# Generate allocations
./scripts/snapshot/generate-allocations.sh

# Create merkle tree
./dao/merkle/generate_merkle.js
```

## FAQ

**Q: Can I contribute after snapshot?**  
A: Yes! Future snapshots will include new contributions.

**Q: What if I don't have an address yet?**  
A: Register later. Allocation reserved for 12 months.

**Q: Can I appeal after 30 days?**  
A: No, appeals must be within 30-day window.

**Q: What happens to unclaimed tokens?**  
A: After 12 months, may be redistributed per governance decision.

**Q: Can I see others' allocations?**  
A: Only if they choose to share. Merkle tree allows private claiming.

## Contact

- **Questions**: GitHub Discussions with tag `dao-snapshot`
- **Appeals**: GitHub Issues with tag `dao-snapshot-appeal`  
- **Technical Issues**: GitHub Issues with tag `dao-technical`

---

**Last Updated**: 2026-01-01  
**Next Snapshot**: TBD (announced 14+ days in advance)  
**Current Phase**: Planning
