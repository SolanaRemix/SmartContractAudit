# Governance

## Project Overview

SmartContractAudit is an open-source project focused on on-chain security automation and smart contract auditing. This document outlines how decisions are made and how the project is managed.

## Project Roles

### Maintainers

Maintainers have write access to the repository and are responsible for:
- Reviewing and merging pull requests
- Managing releases
- Triaging issues
- Enforcing the Code of Conduct
- Making technical decisions
- Managing security vulnerabilities

Current maintainers are listed in the repository's GitHub team settings.

### Contributors

Contributors are community members who contribute to the project through:
- Code contributions
- Documentation improvements
- Bug reports
- Feature requests
- Community support
- Testing and validation

All contributors must follow the [Contributing Guidelines](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md).

### Security Team

The security team is responsible for:
- Handling security vulnerability reports
- Coordinating security patches
- Publishing security advisories
- Maintaining security documentation

Contact: security@cuberai.example (placeholder)

## Decision-Making Model

### Technical Decisions

- **Minor changes**: Can be made by any maintainer or through approved PRs
- **Moderate changes**: Require approval from at least one maintainer
- **Major changes**: Require consensus among maintainers and community input

### Consensus Process

1. Propose change through GitHub issue or discussion
2. Allow time for community feedback (minimum 7 days for major changes)
3. Maintainers discuss and reach consensus
4. Decision is documented in the issue/PR
5. Implementation proceeds

### Conflict Resolution

If maintainers cannot reach consensus:
1. Extended discussion period
2. Seek additional community input
3. Final decision by project lead or majority vote among maintainers

## Release Process

### Version Numbering

We follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Cycle

- **Regular releases**: As needed based on accumulated changes
- **Security releases**: Expedited process for critical vulnerabilities
- **Pre-releases**: For testing major changes

### Release Checklist

1. Update version numbers
2. Update CHANGELOG
3. Run full test suite
4. Security review
5. Create release notes
6. Tag release
7. Publish packages
8. Announce release

See [RELEASE.md](RELEASE.md) for detailed release procedures.

## Security Responsibilities

### Security Owners

Maintainers serve as security owners and are responsible for:
- Monitoring security reports
- Coordinating vulnerability responses
- Reviewing security-sensitive code changes
- Maintaining security documentation

### Security Process

See [SECURITY.md](SECURITY.md) for full security policy and reporting procedures.

## Sponsor and Partner Influence

### Transparency

We value our sponsors and partners, but maintain project independence:
- Sponsors may propose features or priorities
- All contributions follow the same review process
- Technical decisions are made by maintainers based on project goals
- Financial support does not grant decision-making authority

### Partner Collaboration

Partners may receive:
- Priority support through established SLAs
- Dedicated communication channels
- Early access to pre-release features
- Custom integration assistance

See [docs/partners/](docs/partners/) for partnership information.

## Amendments

This governance document may be amended through:
1. Proposal via GitHub issue
2. Community discussion period (minimum 14 days)
3. Maintainer consensus
4. Pull request updating this document

## Questions?

For questions about governance, contact the maintainer team through:
- GitHub discussions
- Project mailing list
- security@cuberai.example (for sensitive matters)
