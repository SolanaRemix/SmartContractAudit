# Pull Request

## Description

<!-- Provide a clear and concise description of your changes -->

## Type of Change

<!-- Check all that apply -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement
- [ ] Test addition/improvement
- [ ] CI/CD update
- [ ] Security fix

## Related Issues

<!-- Link related issues using #issue-number -->

Fixes #
Relates to #

## Changes Made

<!-- List the main changes in bullet points -->

- 
- 
- 

## Testing

<!-- Describe the testing you've done -->

- [ ] All existing tests pass
- [ ] Added new tests for new functionality
- [ ] Tested manually (describe how)
- [ ] Tested in development environment
- [ ] No tests needed (documentation only)

**Test Details:**


## Security Checklist

<!-- This is required for all PRs -->

- [ ] No secrets, API keys, or credentials committed
- [ ] All scripts default to DRY_RUN=true or equivalent safe mode
- [ ] No destructive operations without explicit confirmation
- [ ] Input validation added where applicable
- [ ] Security implications considered and documented
- [ ] Dependencies checked for known vulnerabilities
- [ ] Code follows secure coding best practices

**DRY_RUN Verification:**
- [ ] Verified that DRY_RUN=true is the default
- [ ] Confirmed no auto-apply fixes or auto-merge
- [ ] BOT_PINGS_ENABLED=false or equivalent

## Documentation

- [ ] README updated (if needed)
- [ ] Code comments added for complex logic
- [ ] API documentation updated (if applicable)
- [ ] CHANGELOG.md updated (if release-worthy change)
- [ ] Breaking changes documented
- [ ] Migration guide provided (if breaking change)

## Code Quality

- [ ] Code follows project style guidelines
- [ ] Linting passes (run `npm run lint` or equivalent)
- [ ] All commits are signed off (DCO: `git commit -s`)
- [ ] Commit messages are clear and descriptive
- [ ] No unnecessary console.log or debug code
- [ ] Code is well-structured and maintainable

## Checklist Before Review

- [ ] Self-reviewed the code
- [ ] Checked for typos and errors
- [ ] Verified all CI checks pass
- [ ] Ready for maintainer review

## Additional Context

<!-- Add any other context, screenshots, or information -->

## Screenshots (if applicable)

<!-- Add screenshots for UI changes -->

## Deployment Notes

<!-- Any special deployment considerations? -->

## Reviewer Notes

<!-- Anything specific you want reviewers to focus on? -->

---

## For Maintainers

**Review Checklist:**
- [ ] Code quality acceptable
- [ ] Tests adequate
- [ ] Security considerations addressed
- [ ] Documentation sufficient
- [ ] No secrets or credentials
- [ ] DRY_RUN defaults confirmed
- [ ] Breaking changes acceptable (if any)
- [ ] Ready to merge

**Post-Merge:**
- [ ] Update CHANGELOG if significant
- [ ] Tag for release (if applicable)
- [ ] Announce (if major feature)
