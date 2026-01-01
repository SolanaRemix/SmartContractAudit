# Contribution Scoring Formula

## Overview

This document defines how contributor scores are calculated for DAO token distribution. The scoring system aims to be fair, transparent, and resistant to gaming.

## Base Scoring Formula

```
Total Score = Code Score + Documentation Score + Community Score + Security Score + Quality Multiplier
```

## Component Scoring

### 1. Code Contributions

**Pull Request Scoring**:

```javascript
function calculateCodeScore(pr) {
  let baseScore = 0;
  
  // Size-based scoring
  if (pr.additions + pr.deletions < 50) {
    baseScore = 1;  // Small PR
  } else if (pr.additions + pr.deletions < 200) {
    baseScore = 3;  // Medium PR
  } else if (pr.additions + pr.deletions < 500) {
    baseScore = 5;  // Large PR
  } else {
    baseScore = 8;  // Very large PR
  }
  
  // Impact multipliers
  if (pr.labels.includes('critical')) baseScore *= 2;
  if (pr.labels.includes('security')) baseScore *= 1.5;
  if (pr.labels.includes('breaking-change')) baseScore *= 1.3;
  
  // Quality adjustments
  if (pr.reviews > 2) baseScore *= 1.1;
  if (pr.hasTests) baseScore *= 1.2;
  if (pr.hasDocs) baseScore *= 1.1;
  
  return baseScore;
}
```

**Commit Scoring**:
- Each commit with DCO sign-off: 0.1 points
- First commit on new feature: 2 points bonus
- Fixes critical bug: 10 points

### 2. Documentation Contributions

**Documentation Scoring**:

```javascript
function calculateDocScore(contribution) {
  const docType = contribution.type;
  
  const scores = {
    'minor-update': 1,
    'major-documentation': 3,
    'tutorial': 5,
    'api-docs': 4,
    'translation': 3,
    'video-tutorial': 8
  };
  
  let score = scores[docType] || 0;
  
  // Quality bonus
  if (contribution.hasExamples) score *= 1.2;
  if (contribution.hasScreenshots) score *= 1.1;
  
  return score;
}
```

### 3. Community Support

**Community Scoring**:

```javascript
function calculateCommunityScore(activity) {
  let score = 0;
  
  // Issue activity
  score += activity.issueComments * 0.5;
  score += activity.issuesTriaged * 1;
  score += activity.issuesCreated * 0.3;
  
  // PR reviews
  score += activity.prReviewComments * 0.5;
  score += activity.prApprovalsGiven * 2;
  
  // Discussion participation
  score += activity.discussionPosts * 0.5;
  score += activity.discussionHelpful * 1;
  
  // Moderation
  score += activity.moderationActions * 3;
  
  // Cap community score to prevent spam
  return Math.min(score, 50);
}
```

### 4. Security Contributions

**Security Scoring**:

```javascript
function calculateSecurityScore(report) {
  const severityScores = {
    'critical': 50,
    'high': 20,
    'medium': 10,
    'low': 5,
    'informational': 2
  };
  
  let score = severityScores[report.severity] || 0;
  
  // Bonus for responsible disclosure
  if (report.privateDisclosure) score *= 1.5;
  
  // Bonus for providing fix
  if (report.includesFix) score *= 1.3;
  
  return score;
}
```

## Quality Multiplier

To reward high-quality contributions over quantity:

```javascript
function calculateQualityMultiplier(contributor) {
  let multiplier = 1.0;
  
  // PR acceptance rate
  const acceptanceRate = contributor.mergedPRs / contributor.totalPRs;
  if (acceptanceRate > 0.8) multiplier *= 1.2;
  else if (acceptanceRate < 0.4) multiplier *= 0.8;
  
  // Code review quality
  const avgReviewScore = contributor.avgReviewScore; // 1-5 scale
  multiplier *= (0.9 + (avgReviewScore * 0.05));
  
  // Time invested (prevents drive-by contributions)
  const monthsActive = contributor.monthsActive;
  if (monthsActive > 6) multiplier *= 1.1;
  if (monthsActive > 12) multiplier *= 1.2;
  
  // Spam penalty
  if (contributor.spamFlags > 0) multiplier *= 0.5;
  
  return multiplier;
}
```

## Final Score Calculation

```javascript
function calculateFinalScore(contributor) {
  const codeScore = contributor.prs.reduce((sum, pr) => 
    sum + calculateCodeScore(pr), 0);
  
  const docScore = contributor.docs.reduce((sum, doc) => 
    sum + calculateDocScore(doc), 0);
  
  const communityScore = calculateCommunityScore(contributor.activity);
  
  const securityScore = contributor.securityReports.reduce((sum, report) => 
    sum + calculateSecurityScore(report), 0);
  
  const baseScore = codeScore + docScore + communityScore + securityScore;
  
  const qualityMultiplier = calculateQualityMultiplier(contributor);
  
  return Math.round(baseScore * qualityMultiplier);
}
```

## Token Allocation Formula

Once scores are calculated, tokens are distributed proportionally:

```javascript
function calculateTokenAllocation(contributor, totalScore, tokenPool) {
  const contributorScore = calculateFinalScore(contributor);
  const allocation = (contributorScore / totalScore) * tokenPool;
  
  // Apply minimum and maximum
  const minAllocation = 10;  // tokens
  const maxAllocation = tokenPool * 0.05;  // max 5% per contributor
  
  return Math.max(minAllocation, Math.min(allocation, maxAllocation));
}
```

## Time-Weighted Scoring

To value consistent contribution:

```javascript
function applyTimeWeight(score, contributionDate) {
  const now = new Date();
  const monthsAgo = (now - contributionDate) / (1000 * 60 * 60 * 24 * 30);
  
  // Recent contributions valued more
  if (monthsAgo <= 1) return score * 1.5;
  if (monthsAgo <= 3) return score * 1.2;
  if (monthsAgo <= 6) return score * 1.0;
  if (monthsAgo <= 12) return score * 0.8;
  return score * 0.6;
}
```

## Example Calculations

### Example 1: Active Coder

```javascript
const contributor = {
  prs: [
    { additions: 120, deletions: 30, labels: ['feature'], reviews: 3, hasTests: true, hasDocs: true },
    { additions: 45, deletions: 10, labels: [], reviews: 1, hasTests: true, hasDocs: false },
    { additions: 200, deletions: 50, labels: ['critical'], reviews: 4, hasTests: true, hasDocs: true }
  ],
  docs: [],
  activity: { issueComments: 20, prReviewComments: 15 },
  securityReports: [],
  monthsActive: 8,
  mergedPRs: 3,
  totalPRs: 3
};

// Code Score: ~30 points (with bonuses)
// Doc Score: 0
// Community Score: ~17.5 points
// Security Score: 0
// Quality Multiplier: ~1.32
// Final: ~63 points
```

### Example 2: Documentation Expert

```javascript
const contributor = {
  prs: [],
  docs: [
    { type: 'tutorial', hasExamples: true, hasScreenshots: true },
    { type: 'major-documentation', hasExamples: true },
    { type: 'api-docs', hasExamples: true }
  ],
  activity: { issueComments: 10, discussionPosts: 20 },
  securityReports: [],
  monthsActive: 5,
  mergedPRs: 0,
  totalPRs: 0
};

// Code Score: 0
// Doc Score: ~18 points (with bonuses)
// Community Score: ~15 points
// Security Score: 0
// Quality Multiplier: ~1.1
// Final: ~36 points
```

### Example 3: Security Researcher

```javascript
const contributor = {
  prs: [
    { additions: 100, deletions: 20, labels: ['security'], reviews: 2, hasTests: true, hasDocs: true }
  ],
  docs: [],
  activity: { issueComments: 5 },
  securityReports: [
    { severity: 'high', privateDisclosure: true, includesFix: true }
  ],
  monthsActive: 3,
  mergedPRs: 1,
  totalPRs: 1
};

// Code Score: ~8 points
// Doc Score: 0
// Community Score: ~2.5 points
// Security Score: 39 points (20 * 1.5 * 1.3)
// Quality Multiplier: ~1.2
// Final: ~59 points
```

## Anti-Gaming Measures

1. **PR Size Limits**: Diminishing returns for very large PRs
2. **Community Score Cap**: Maximum 50 points from community activity
3. **Acceptance Rate**: Poor PR acceptance reduces multiplier
4. **Spam Detection**: Automated and manual spam flagging
5. **Quality Over Quantity**: Time-weighted scoring
6. **Sybil Resistance**: Account age and verification requirements

## Transparency

All scoring calculations:
- Run in public GitHub Actions
- Results published to repository
- Algorithm open source
- Community can audit

## Updates

Scoring formula updates require:
- DAO governance vote
- 30-day notice period
- Clear documentation of changes
- No retroactive changes

## Tools

See [dao/merkle/generate_merkle.js](../../dao/merkle/generate_merkle.js) for implementation.

---

Last updated: 2026-01-01
