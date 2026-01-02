# Contribution Scoring Methodology

## Overview

This document details how contributions are scored for DAO token allocation in CyberAi.

## Scoring Philosophy

- **Quality over Quantity**: Meaningful contributions valued over volume
- **Fairness**: Clear, transparent, and consistently applied rules
- **Diversity**: Multiple contribution types recognized
- **Balance**: No single activity dominates scoring

## Base Point Values

### Code Contributions

| Type | Base Points | Notes |
|------|-------------|-------|
| Critical bug fix | 100 | Security or data loss fixes |
| Major feature | 75 | New significant functionality |
| Minor feature | 50 | Small enhancements |
| Bug fix | 30 | Non-critical bug resolution |
| Documentation | 20 | Docs, comments, README |
| Tests | 15 | Test additions/improvements |
| Refactoring | 25 | Code quality improvements |
| Typo/formatting | 5 | Minor text corrections |

**Multipliers:**
- Lines of code (LOC): 
  - 1-50 LOC: 1.0x
  - 51-200 LOC: 1.2x
  - 201-500 LOC: 1.5x
  - 500+ LOC: 2.0x
- Complexity (cyclomatic): High complexity +25%
- Impact: Core systems +50%, utilities +0%

### Code Reviews

| Type | Base Points | Notes |
|------|-------------|-------|
| Comprehensive review | 10 | Detailed feedback, multiple rounds |
| Standard review | 5 | Thorough single-pass review |
| Quick review | 2 | Simple approval or minor feedback |
| Security-focused review | 15 | Identifies security issues |

**Disqualified Reviews:**
- Just "LGTM" with no other comment: 0 points
- Reviews of own PRs: 0 points
- Circular reviews (coordinated): 0 points

### Community Participation

| Type | Base Points | Notes |
|------|-------------|-------|
| Helpful issue response | 3 | Helps another user solve problem |
| Bug report (valid) | 10 | Reproducible bug with details |
| Feature request (accepted) | 5 | Well-thought-out feature proposal |
| Discussion participation | 2 | Constructive discussion comment |
| Tutorial/guide creation | 50 | External tutorial or guide |
| Project promotion | 10 | Blog post, talk, or meaningful promotion |

**Caps:**
- Max 50 points per user per month from issue responses
- Max 100 points per user from tutorials/guides

### Security Contributions

| Type | Base Points | Notes |
|------|-------------|-------|
| Critical vulnerability | 200 | Remote code execution, data breach |
| High severity | 100 | Privilege escalation, auth bypass |
| Medium severity | 50 | Information disclosure, DoS |
| Low severity | 25 | Minor security improvements |
| Security documentation | 30 | Security guides, best practices |
| Security tooling | 75 | Tools that improve security |

**Requirements:**
- Responsible disclosure followed
- Not publicly disclosed before fix
- Actual vulnerabilities (not theoretical)

### Governance Participation

| Type | Base Points | Notes |
|------|-------------|-------|
| Proposal creation | 20 | Well-formed governance proposal |
| Voting on proposals | 2 | Per vote cast |
| Governance discussion | 5 | Substantive governance input |
| Policy contribution | 30 | Help create/improve policies |

## Multipliers and Bonuses

### Time-Based Multipliers

**Early Contributor Bonus:**
- First 3 months: +50%
- Months 4-6: +25%
- Months 7-12: +10%

**Consistency Bonus:**
- Contributions in 3+ months: +10%
- Contributions in 6+ months: +25%
- Contributions in 12+ months: +50%

### Impact Multipliers

**High-Impact Work:**
- Affects core security: +50%
- Enables major feature: +30%
- Improves user experience: +20%
- Infrastructure improvement: +25%

**Quality Multipliers:**
- Zero bugs in follow-up: +10%
- Requires no revisions: +5%
- Includes tests: +15%
- Includes documentation: +10%

### Special Recognition

**Community Leadership:**
- Mentors new contributors: +50 points
- Organizes community events: +75 points
- Resolves conflicts positively: +25 points

**Technical Excellence:**
- Introduces innovative solution: +100 points
- Performance improvement >50%: +75 points
- Resolves long-standing issue: +50 points

## Calculation Formula

```
Total Score = Σ (Base Points × LOC Multiplier × Impact Multiplier × Time Multiplier) + Bonuses
```

## Example Calculations

### Example 1: Regular Contributor

**Contributions:**
- 3 minor features (50 × 3 = 150 points)
- 200 LOC average (1.2x multiplier)
- Standard impact (1.0x)
- 6 months active (+25% consistency)
- 5 code reviews (5 × 5 = 25 points)
- 10 helpful comments (3 × 10 = 30 points)

**Calculation:**
```
Code: 150 × 1.2 × 1.0 × 1.25 = 225
Reviews: 25
Community: 30
Total: 280 points
```

### Example 2: Security Researcher

**Contributions:**
- 1 high severity vulnerability (100 points)
- Responsible disclosure (+25% quality)
- Security documentation (30 points)
- 3 security reviews (15 × 3 = 45 points)

**Calculation:**
```
Security: 100 × 1.25 = 125
Documentation: 30
Reviews: 45
Total: 200 points
```

### Example 3: Early Core Developer

**Contributions:**
- 2 major features (75 × 2 = 150 points)
- 500+ LOC (2.0x multiplier)
- Core system (1.5x impact)
- First 3 months (+50% early bonus)
- Includes tests (+15% quality)
- Zero revisions (+5% quality)

**Calculation:**
```
Code: 150 × 2.0 × 1.5 × 1.5 × 1.15 × 1.05 = 817
Total: 817 points
```

## Point Caps and Limits

### Individual Caps

- **Maximum per PR**: 500 points (before multipliers)
- **Maximum per month**: 1,000 points (prevents gaming)
- **Maximum from one activity type**: 60% of total score

### Reasoning

Caps prevent:
- Gaming the system with spam contributions
- Domination by single contribution type
- Unfair advantage from one large contribution
- Score inflation

## Score Normalization

Before final allocation:

1. **Calculate raw scores** for all contributors
2. **Apply caps** to individual scores
3. **Remove outliers** (manual review of top 1%)
4. **Normalize to token pool**: Scale scores to available tokens

**Example:**
- Total raw points: 50,000
- Token pool: 10,000 tokens
- Conversion: 1 point = 0.2 tokens

## Transparency and Verification

### Public Data

All scoring data is public:
- Contribution list with point values
- Multipliers applied
- Final calculated scores
- Conversion rate to tokens

### Verification

Anyone can:
1. Review the scoring methodology
2. Check their own score calculation
3. Verify others' scores
4. Appeal discrepancies

### Audits

- Quarterly review of scoring accuracy
- Community input on methodology
- Adjustments based on feedback
- Versioned methodology (changes tracked)

## Appeals and Adjustments

### When to Appeal

- Contributions not counted
- Incorrect point values
- Multipliers not applied
- Technical errors in calculation

### Appeal Process

1. Open GitHub issue with tag `scoring-appeal`
2. Provide contribution links
3. Show expected vs. actual score
4. Wait for review (10 business days)

### Adjustments

Scores may be adjusted for:
- Proven calculation errors
- Previously uncounted contributions
- Misclassified contribution types
- Special circumstances (case-by-case)

## Future Methodology Updates

This methodology may evolve:

**Update Process:**
1. Proposal in GitHub Discussions
2. Community feedback (minimum 14 days)
3. Governance vote (if DAO active)
4. Implementation in next airdrop

**Versioning:**
- Each airdrop uses specific version
- Version noted in airdrop announcement
- No retroactive methodology changes

## Questions and Discussion

- **General Questions**: GitHub Discussions with tag `dao-scoring`
- **Score Disputes**: GitHub Issues with tag `scoring-appeal`
- **Methodology Feedback**: GitHub Discussions

---

**Methodology Version**: 1.0  
**Last Updated**: 2026-01-01  
**Next Review**: 2026-03-01
