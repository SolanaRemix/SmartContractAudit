# Governance

## Project Overview

SmartContractAudit is an open-source project for automated smart contract security auditing with AI workers and on-chain automation. This document outlines how the project is governed and how decisions are made.

## Project Roles

### Maintainers

Maintainers have commit access to the repository and are responsible for:

- Reviewing and merging pull requests
- Triaging and responding to issues
- Making technical decisions for the project
- Ensuring code quality and security standards
- Managing releases
- Enforcing the code of conduct

**Current Maintainers:**
- [List to be maintained]

### Security Team

Security team members are responsible for:

- Reviewing security vulnerabilities
- Coordinating security disclosures
- Managing security advisories
- Ensuring security best practices

**Security Team:**
- [List to be maintained]

### Contributors

Anyone who submits a pull request, reports an issue, or participates in discussions is a contributor. Contributors are expected to:

- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)
- Follow the [Contributing Guidelines](CONTRIBUTING.md)
- Sign off commits with DCO
- Participate constructively

### Sponsors and Partners

Sponsors and partners provide financial or infrastructure support. They may:

- Influence the project roadmap through advisory input
- Request features or integrations (subject to maintainer approval)
- Receive priority support (per sponsorship tier)
- Access early releases and beta features

See [docs/partners/](docs/partners/) for more information on partnerships.

## Decision Making

### Consensus Model

For most decisions, we aim for consensus among maintainers:

1. **Proposal**: Issues or RFCs are opened for significant changes
2. **Discussion**: Community and maintainers discuss pros/cons
3. **Consensus**: Maintainers reach consensus (typically 2+ maintainer approvals)
4. **Implementation**: Changes are implemented and merged

### Lazy Consensus

For routine changes (bug fixes, documentation, minor features):

- Pull requests can be merged with 1 maintainer approval
- Allow 48 hours for other maintainers to review/object
- No objections = implied consensus

### Voting

If consensus cannot be reached, maintainers may vote:

- Simple majority (>50%) required
- All maintainers are invited to vote
- Voting period: 7 days
- Abstentions do not count toward total

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

### Release Cycle

- **Patch releases**: As needed for critical bugs
- **Minor releases**: Monthly or as features are ready
- **Major releases**: When breaking changes are necessary

### Release Procedure

1. Update version numbers
2. Update CHANGELOG.md
3. Create release branch
4. Run full test suite and security scans
5. Create GitHub release with notes
6. Tag release commit
7. Announce on community channels

## Roadmap and Feature Requests

### Roadmap

The project roadmap is maintained in:
- GitHub Projects
- Milestone planning
- Regular community updates

### Sponsor Influence

Sponsors may influence the roadmap through:

- **Feature Requests**: Submitted as issues, prioritized based on:
  - Community benefit
  - Technical feasibility
  - Alignment with project goals
  - Sponsor tier (advisory input)
  
- **Priority Support**: Higher-tier sponsors receive:
  - Earlier response to issues
  - Advisory access to maintainers
  - Input on release planning
  - Beta access to features

Final decisions remain with maintainers to ensure project integrity and community benefit.

## Becoming a Maintainer

Contributors may become maintainers through:

1. **Sustained Contributions**: Regular, high-quality contributions over 6+ months
2. **Technical Excellence**: Demonstrated expertise in relevant areas
3. **Community Engagement**: Helpful, constructive participation
4. **Trust**: Aligned with project values and governance
5. **Nomination**: Nominated by existing maintainer
6. **Consensus**: Approved by consensus of current maintainers

## Removing Maintainers

Maintainer status may be revoked for:

- Inactivity (no contributions in 12 months)
- Code of conduct violations
- Abuse of privileges
- Consensus of other maintainers

## Code Ownership

### CODEOWNERS

Specific areas of the codebase may have designated owners who:

- Automatically review PRs in their area
- Have expertise in that domain
- Help maintain code quality

CODEOWNERS file defines these areas.

### Security Ownership

Security-sensitive code requires review by security team members before merge.

## Amendments

This governance document may be amended by:

1. Opening a pull request with proposed changes
2. Discussion period (minimum 14 days)
3. Consensus or vote of maintainers
4. Approval by 2/3 majority if voting

## Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **Pull Requests**: Code contributions
- **Discussions**: Community Q&A, RFCs
- **Email**: security@cuberai.example (security only)

## Funding and Sponsorship

See [FUNDING.yml](.github/FUNDING.yml) for sponsorship options and [docs/partners/](docs/partners/) for partnership details.

## License

All contributions are licensed under Apache-2.0 as specified in [LICENSE](LICENSE).

## Questions

For questions about governance, contact the maintainers via GitHub Discussions or open an issue.
