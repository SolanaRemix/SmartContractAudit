# Pull Request Template

## Description

Brief description of the changes in this PR.

## Type of Change

Please check the relevant option:

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Test improvement

## Safety Checklist

**IMPORTANT**: Please verify before submitting:

- [ ] **DRY_RUN verified**: All potentially destructive operations default to DRY_RUN=true
- [ ] **No secrets committed**: No API keys, private keys, passwords, or sensitive data in code
- [ ] **No hardcoded credentials**: All credentials use environment variables or secure secrets
- [ ] **Artifacts reviewed**: All generated artifacts (logs, reports) reviewed and safe to commit
- [ ] **Non-destructive by default**: Auto-apply and auto-merge features disabled by default
- [ ] **Permissions reviewed**: Required permissions are minimal and explicitly documented

## Audit Artifacts Section

If this PR includes security scanning or audit features:

### Artifacts Generated
- [ ] SMARTBRAIN.log
- [ ] AUDIT-REPORT.md
- [ ] .quarantine/ directory
- [ ] Other (specify):

### Artifact Safety
- [ ] Artifacts do not contain secrets or sensitive data
- [ ] Artifacts are properly gitignored or sanitized
- [ ] Redaction policy followed for any included artifacts

## Testing

- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Existing tests updated if needed
- [ ] Manual testing completed

### Test Commands Run
```bash
# List commands you ran to test
```

## Changes Made

### Files Changed
- List key files and why they were changed

### Configuration Changes
- Any new environment variables?
- Any new dependencies?
- Any configuration file changes?

## Security Considerations

- [ ] No new security vulnerabilities introduced
- [ ] Security best practices followed
- [ ] Input validation added where necessary
- [ ] Output sanitization applied where necessary

## Documentation

- [ ] README updated (if needed)
- [ ] Code comments added for complex logic
- [ ] API documentation updated (if applicable)
- [ ] CHANGELOG updated (for releases)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Commits are signed off (DCO)
- [ ] PR title is clear and descriptive
- [ ] Linked related issues (closes #123, relates to #456)

## Additional Notes

Any additional context, decisions, or considerations for reviewers.

## Screenshots (if applicable)

Add screenshots for UI changes or visual features.

## Rollback Plan

If this is a significant change, describe how to roll back if issues arise:

```
Steps to rollback:
1. 
2. 
```

---

**For Reviewers:**
- [ ] Code quality approved
- [ ] Security implications reviewed
- [ ] Tests are adequate
- [ ] Documentation is clear
