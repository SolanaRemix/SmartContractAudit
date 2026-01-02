# Release Process

## Overview

This document describes the release process for CyberAi, including planning, testing, deployment, and communication.

## Release Types

### Semantic Versioning

We follow [Semantic Versioning 2.0.0](https://semver.org/):

- **MAJOR** (X.0.0): Breaking changes, major features
- **MINOR** (0.X.0): New features, backward compatible
- **PATCH** (0.0.X): Bug fixes, backward compatible

**Examples**:
- `v1.0.0` → `v2.0.0`: Breaking API changes
- `v1.0.0` → `v1.1.0`: New scan rules added
- `v1.0.0` → `v1.0.1`: Bug fix in parser

### Release Cadence

- **Major**: Annually (e.g., v2026.01.01 format for calendar versioning)
- **Minor**: Quarterly or as needed
- **Patch**: As needed for bugs and security
- **Security**: Immediately when critical

## Release Planning

### Proposal Phase

1. **Feature Proposals**: GitHub Discussions, Issues
2. **Community Input**: 14-day minimum discussion
3. **Roadmap Update**: Add to roadmap after consensus
4. **Milestone Creation**: GitHub milestone with target date

### Roadmap Management

**Public Roadmap**:
- GitHub Projects board
- Quarterly planning documents
- Community input welcomed
- No guarantees on timeline

**Priority Criteria**:
1. Security fixes (highest)
2. Breaking bugs
3. Community-requested features
4. Maintainer priorities
5. Nice-to-have features

## Release Checklist

See [RELEASE.md](../RELEASE.md) for detailed checklist.

**Summary**:
- [ ] All planned features merged
- [ ] Tests passing
- [ ] Security scans clean
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version numbers updated
- [ ] Release notes drafted
- [ ] Community notified

## Testing Requirements

### Pre-Release Testing

**Automated Tests**:
- Unit tests: 100% pass required
- Integration tests: 100% pass required
- Security scans: No critical/high issues
- Linting: All checks pass

**Manual Testing**:
- Smoke tests on major workflows
- Test installations on major platforms
- Verify documentation accuracy
- Check examples and tutorials

### Beta Testing

**For Major/Minor Releases**:
1. **Beta Release**: 2 weeks before GA
2. **Beta Testers**: Partners, community volunteers
3. **Feedback Period**: 1-2 weeks
4. **Bug Fixes**: Address critical feedback
5. **RC (Release Candidate)**: If major changes made

### Test Environments

- Development: Continuous integration
- Staging: Pre-release testing
- Production: Stable releases

## Release Process

### 1. Code Freeze

**When**: 1 week before release  
**What**: No new features, bug fixes only  
**Communication**: Announce in Discussions

### 2. Version Update

```bash
# Update version in all files
npm version major|minor|patch
# or manually update:
# - package.json
# - README.md badges
# - Documentation version refs
```

### 3. CHANGELOG Update

Format:
```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- New feature 1 (#123)
- New feature 2 (#456)

### Changed
- Updated dependency X to v2.0 (#789)

### Fixed
- Bug fix 1 (#234)
- Bug fix 2 (#567)

### Security
- Security fix for vulnerability (#890)
```

### 4. Create Release Branch

```bash
git checkout -b release/vX.Y.Z
git push origin release/vX.Y.Z
```

### 5. Build and Test

```bash
# Install dependencies
npm install

# Run full test suite
npm test

# Run security scans
npm run security-scan

# Build release artifacts
npm run build

# Verify build
npm run verify-build
```

### 6. Create Git Tag

```bash
# Create annotated tag
git tag -a vX.Y.Z -m "Release vX.Y.Z"

# Push tag
git push origin vX.Y.Z
```

### 7. GitHub Release

**Draft Release**:
1. Go to GitHub Releases
2. Click "Draft a new release"
3. Select tag: vX.Y.Z
4. Set as **DRAFT** initially
5. Add release title: "CyberAi vX.Y.Z"
6. Copy CHANGELOG content
7. Attach build artifacts
8. Add installation instructions
9. Save as draft

**Review**:
- All maintainers review
- Final approval needed
- Publish when ready

### 8. Publish Packages

**npm** (if applicable):
```bash
npm publish
```

**Docker**:
```bash
docker build -t cyberai/scanner:vX.Y.Z .
docker push cyberai/scanner:vX.Y.Z
docker tag cyberai/scanner:vX.Y.Z cyberai/scanner:latest
docker push cyberai/scanner:latest
```

### 9. Update Documentation

- Docs site deployment
- Update version in all docs
- Update installation instructions
- Publish API documentation

### 10. Announcements

**Channels**:
1. GitHub Discussions (pinned)
2. GitHub Release published
3. Social media (Twitter, LinkedIn)
4. Partner newsletter
5. Discord/Slack announcements
6. Blog post (for major releases)

**Template**:
```markdown
🎉 CyberAi vX.Y.Z Released!

Highlights:
- [Major feature 1]
- [Major feature 2]
- [Security improvements]

📦 Install: npm install -g @cyberai/cli
📖 Docs: [link]
📝 Changelog: [link]
🐛 Report issues: [link]

Thank you to all contributors! 🙏
```

## Post-Release

### Monitoring

**First 24 Hours**:
- Watch GitHub issues for bug reports
- Monitor social media mentions
- Check download/install metrics
- Verify CI/CD integrations work

**First Week**:
- Address critical bugs immediately
- Collect feedback
- Update FAQ if needed
- Prepare patch if necessary

### Hotfix Process

**For Critical Bugs**:
1. Create hotfix branch from release tag
2. Fix bug, add test
3. Update version (patch bump)
4. Fast-track testing
5. Release ASAP
6. Announce security/critical nature

```bash
git checkout -b hotfix/vX.Y.Z+1 vX.Y.Z
# Make fixes
git commit -m "Fix critical bug"
git tag -a vX.Y.Z+1 -m "Hotfix for critical bug"
```

### Retrospective

**Within 1 Week After Release**:
- Team retrospective meeting
- What went well?
- What could improve?
- Action items for next release
- Update release process docs

## Communication

### Pre-Release

**2 Weeks Before**:
- Announce upcoming release
- Highlight major changes
- Call for testing volunteers
- Feature freeze announcement

**1 Week Before**:
- Beta release (if applicable)
- Reminder of upcoming release
- Known issues documented

### Release Day

**Announcements**:
- GitHub Release published
- Discussion post
- Social media
- Partner email
- Community channels

**Content**:
- What's new
- Breaking changes (if any)
- Installation instructions
- Link to full changelog
- Thank contributors

### Post-Release

**Follow-Up**:
- Thank community for feedback
- Address questions
- Hotfix announcements if needed
- Metrics and success stories

## Release Roles

### Release Manager

**Responsibilities**:
- Coordinate release process
- Ensure checklist completion
- Make go/no-go decisions
- Primary release communications

**Rotation**: Maintainers rotate

### Contributors

- Submit PRs for milestone
- Respond to reviews
- Update documentation
- Test beta releases

### Community

- Test beta releases
- Report bugs
- Provide feedback
- Help others with upgrade

## Version Support

### Support Policy

- **Latest Major**: Full support
- **Previous Major**: Security fixes for 1 year
- **Older Versions**: Community support only

**Example**:
- v2.0.0 released: Full support
- v1.x.x: Security fixes until v2.1.0
- v0.x.x: No official support

### End of Life

**6 Months Notice**:
- Announce EOL date
- Encourage upgrades
- Document migration path
- Final security scan before EOL

## Emergency Releases

### Security Releases

**Process**:
1. Fix developed privately
2. Coordinated disclosure timeline
3. Release prepared in private
4. Security advisory drafted
5. Release published with advisory
6. Disclosure follows responsible timeline

**Timeline**:
- Critical: 7 days target
- High: 14 days target
- Coordinated with security researchers

### Rollback Plan

**If Major Issues Discovered**:
1. Assess severity
2. Communicate issue immediately
3. Prepare hotfix or rollback
4. Release fix ASAP
5. Post-mortem and prevention

**Rollback Steps**:
```bash
# Unpublish bad version (npm)
npm unpublish @cyberai/cli@vX.Y.Z

# Revert Docker tags
docker tag cyberai/scanner:vX.Y.Z-1 cyberai/scanner:latest
docker push cyberai/scanner:latest
```

## Calendar Versioning

### Annual Major Releases

**Format**: v2026.01.01 (YYYY.MM.DD)

**Benefits**:
- Clear age of release
- Predictable schedule
- Easy mental model

**Still Use SemVer for Minor/Patch**:
- v2026.01.01 (January 1, 2026 release)
- v2026.01.02 (patch)
- v2026.02.00 (minor, February update)

## Resources

- [RELEASE.md](../RELEASE.md) - Detailed release checklist
- [CHANGELOG.md](../CHANGELOG.md) - Version history
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contributing guidelines
- [GitHub Releases](https://github.com/CyberAi/CyberAi/releases)

## Questions

**Release Questions**: GitHub Discussions  
**Release Manager**: Current maintainer rotation  
**Emergency**: security@cyberai.network

---

**Last Updated**: 2026-01-01  
**Next Major Release**: v2026.01.01  
**Current Version**: Check GitHub releases
