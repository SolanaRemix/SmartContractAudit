<<<<<<< HEAD
# Project Governance

## Overview

This document defines the governance model for the SmartContractAudit project, including roles, responsibilities, decision-making processes, and how the project is maintained and evolved.
=======
# Governance

## Project Overview

SmartContractAudit is an open-source project focused on on-chain security automation and smart contract auditing. This document outlines how decisions are made and how the project is managed.
>>>>>>> origin/pr9

## Project Roles

### Maintainers

<<<<<<< HEAD
Maintainers have elevated privileges and responsibilities:

- **Responsibilities**:
  - Review and merge pull requests
  - Triage and manage issues
  - Make architectural decisions
  - Release management and versioning
  - Security incident response
  - Define and enforce coding standards
  - Mentor contributors

- **Privileges**:
  - Write access to the repository
  - Ability to merge pull requests
  - Manage releases and tags
  - Access to deployment credentials (when applicable)

- **Becoming a Maintainer**:
  - Demonstrate sustained contributions over time
  - Show technical expertise and judgment
  - Exhibit commitment to project values and code of conduct
  - Nomination by existing maintainer and majority approval

### Contributors

Contributors actively participate in the project:

- **Responsibilities**:
  - Submit quality pull requests
  - Follow contribution guidelines
  - Respond to feedback on contributions
  - Adhere to the code of conduct

- **Recognition**:
  - Credit in release notes
  - Potential DAO eligibility (see docs/dao/)
  - Community recognition

### Community Members

Anyone using, discussing, or following the project:

- **Rights**:
  - Report issues and suggest features
  - Participate in discussions
  - Use the software under the license terms
  - Vote on community proposals (if eligible)

## Decision-Making Model

### Consensus-Based Decision Making

Most decisions are made through lazy consensus:

1. **Proposal**: A proposal is made via issue, PR, or discussion
2. **Discussion**: Community members provide feedback
3. **Consensus**: If no objections after reasonable time (typically 72 hours for minor changes, 7 days for major changes), proposal proceeds
4. **Objection Handling**: Objections are discussed; compromise is sought

### Voting for Major Decisions

For significant changes, formal voting may be required:

- **Major decisions include**:
  - Changes to governance model
  - Architectural changes affecting multiple components
  - Changes to project license
  - Addition or removal of maintainers
  - Major refactoring or breaking changes

- **Voting process**:
  - Requires majority approval from maintainers
  - Voting period: minimum 7 days
  - Ties are resolved by project founder/lead maintainer

### Urgent Security Decisions

Security fixes may bypass normal consensus:

- Security maintainers can make urgent decisions
- Changes are reviewed post-merge
- Community is notified after responsible disclosure

## Release Process

### Versioning

We follow semantic versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

### Release Checklist

1. Update CHANGELOG.md with all changes
2. Update version numbers in relevant files
3. Run full test suite and security scans
4. Create release branch if needed
5. Tag release with version number
6. Build and test release artifacts
7. Publish release notes on GitHub
8. Update documentation
9. Announce release to community

See [RELEASE.md](RELEASE.md) for detailed release procedures.

## Security Governance

### Security Owners

Security maintainers have special responsibilities:

- **Responsibilities**:
  - Manage security vulnerability reports
  - Coordinate security releases
  - Perform security reviews
  - Maintain security documentation

- **Current Security Contacts**: security@cuberai.example

### Security Process

- All security issues go through [SECURITY.md](SECURITY.md) process
- Security fixes may be fast-tracked
- Coordinated disclosure with reporters
- Security advisories published for significant vulnerabilities

## Conflict Resolution

1. **Direct Discussion**: Parties attempt to resolve directly
2. **Mediation**: Maintainers mediate if needed
3. **Project Lead Decision**: Final decision by project lead if unresolved
4. **Code of Conduct**: Violations handled per [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Sponsor and Partner Influence

### Sponsor Recognition

Sponsors and partners are recognized and appreciated:

- Listed in FUNDING.yml and partner documentation
- Logo placement on website (where applicable)
- Recognition in release announcements
- Access to partner onboarding resources

### Decision Independence

**Important**: Financial contributions do not grant:

- Voting rights beyond regular contributors
- Veto power over technical decisions
- Priority in feature requests beyond normal prioritization
- Exemption from code of conduct

Sponsors may:

- Suggest features and priorities
- Participate as regular contributors
- Request technical support (per sponsorship tier)
- Provide input on roadmap discussions

## Amendments

This governance document may be amended:

- Proposed changes submitted as PR to this file
- Discussion period: minimum 14 days
- Requires 2/3 majority approval from maintainers
- Community input welcomed but not binding

## Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General discussion and Q&A
- **Pull Requests**: Code contributions and reviews
- **Security Reports**: security@cuberai.example

## Project Values

- **Transparency**: Open development and decision-making
- **Quality**: High standards for code and documentation
- **Security**: Security-first approach to development
- **Community**: Welcoming and inclusive environment
- **Sustainability**: Long-term project health and maintainability

## Related Documents

- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) - Community standards
- [SECURITY.md](SECURITY.md) - Security policies
- [RELEASE.md](RELEASE.md) - Release procedures
- [docs/partners/](docs/partners/) - Partner and sponsor information

---

Last updated: 2026-01-01
=======
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
>>>>>>> origin/pr9
