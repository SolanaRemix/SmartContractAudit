# Data Retention Policy

## Overview

This document outlines the data retention policies for SmartContractAudit, including default retention periods, deletion procedures, and how to request data removal.

## Default Retention Periods

### Build and CI Artifacts

**Retention**: **90 days** (default)

Includes:
- Build outputs
- Test results
- Log files from CI/CD runs
- Workflow artifacts
- Security scan reports
- Temporary files

**Rationale**: Balance between debugging capabilities and storage costs.

### Source Code and Version Control

**Retention**: Indefinite (permanent)

Includes:
- Git commits and history
- Pull requests and reviews
- Code releases and tags
- Branch history

**Rationale**: Essential for project integrity, attribution, and historical reference.

### Issues and Discussions

**Retention**: Indefinite (permanent)

Includes:
- GitHub issues (open and closed)
- Pull request discussions
- GitHub Discussions posts
- Comments and reactions

**Rationale**: Valuable for project knowledge base and decision history.

### Analytics and Logs

**Retention**: 90 days (default)

Includes:
- Server access logs
- Error logs
- Usage analytics
- Performance metrics

**Rationale**: Sufficient for monitoring and troubleshooting while minimizing privacy impact.

### Security Data

**Retention**: Varies by type

- **Security advisories**: Indefinite (permanent)
- **Vulnerability reports**: 2 years after resolution
- **Security scan results**: 1 year
- **Incident response logs**: 3 years (compliance)

**Rationale**: Balance between security oversight and regulatory requirements.

### Documentation

**Retention**: Indefinite (permanent)

Includes:
- Project documentation
- API documentation
- Tutorials and guides
- Changelogs

**Rationale**: Core project resources that provide ongoing value.

### User Communications

**Retention**: Varies by type

- **Support emails**: 1 year after resolution
- **Community messages**: Indefinite (public forums)
- **Private communications**: 90 days unless actively relevant

**Rationale**: Support quality while respecting privacy.

## Automated Deletion

### CI/CD Artifact Cleanup

We automatically delete:

- GitHub Actions artifacts after **90 days**
- Workflow logs after **90 days**
- Temporary build files after **90 days**

### Log Rotation

- Server logs rotate and archive after **30 days**
- Archives deleted after **90 days**
- Critical security logs retained longer

### Branch Cleanup

- Feature branches may be deleted after merge
- Stale branches (inactive >6 months) may be cleaned
- Protected branches (main, release/*) retained indefinitely

## Data Deletion Requests

### How to Request Deletion

To request data deletion:

1. **Email**: privacy@cuberai.example
2. **Subject**: "Data Deletion Request - [Your GitHub Username]"
3. **Include**:
   - Your GitHub username
   - Specific data to be deleted
   - Reason for request (optional)
   - Verification of identity

### What Can Be Deleted

✅ **Can typically delete:**

- Personal information in issues/comments (redacted, not removed)
- Accidentally disclosed sensitive data
- Unused branches you created
- Your account from mailing lists
- Analytics data associated with your activity
- Cached artifacts with your data

❌ **Cannot typically delete:**

- Git commit history (integrity and attribution)
- Public contributions (project integrity)
- Merged code (derivative works)
- Historical project decisions
- Security incident records (compliance)
- Legal hold data

### Response Timeline

1. **Acknowledgment**: Within **5 business days**
2. **Assessment**: Within **10 business days**
3. **Action**: Within **30 days** (complex cases may take longer)
4. **Notification**: You'll be informed of action taken or limitations

### Limitations

Some data cannot be fully deleted due to:

- **Git's distributed nature**: Clones and forks retain history
- **Legal requirements**: Some data must be retained for compliance
- **Attribution rights**: Contributors have rights to attribution
- **Project integrity**: Removing data may break project history
- **Third-party systems**: Caches, archives, search engines

We will make reasonable efforts to:
- Redact sensitive information
- Remove from our systems where possible
- Provide guidance on external systems

## Retention Overrides

### Legal Hold

Data under legal hold is retained until:
- Legal matter is resolved
- Regulatory requirement ends
- Counsel authorizes release

### Security Incidents

Data related to active security incidents is retained until:
- Incident is fully resolved
- Investigation is complete
- Compliance period expires

### Compliance Requirements

Some data must be retained for compliance with:
- Open source license obligations
- Tax and financial regulations (if applicable)
- Data protection regulations (GDPR, CCPA, etc.)
- Contract obligations

## Archival Policy

### What We Archive

- Major release artifacts
- Significant project milestones
- Security advisories and patches
- Governance decisions
- Annual reports and statistics

### Archive Access

- Public archives available to community
- Private archives restricted to maintainers
- Security archives restricted to security team

### Archive Retention

- Archives retained indefinitely unless superseded
- May be migrated to new formats for preservation
- Access methods documented

## Data Minimization

We practice data minimization:

- Collect only necessary information
- Limit access to sensitive data
- Anonymize where possible
- Regular reviews of data practices
- Delete data when no longer needed

## Export Your Data

You can export your data:

- **GitHub data**: Use GitHub's data export tools
- **Analytics**: Request export via privacy@cuberai.example
- **Communications**: Request archive via privacy@cuberai.example

Exports provided in common formats (JSON, CSV, etc.).

## Updates to Retention Policy

We may update retention periods based on:

- Community feedback
- Legal requirements
- Storage constraints
- Security considerations

Changes announced in:
- Repository commits
- Release notes
- Email notifications (for significant changes)

## Contact

For data retention questions or deletion requests:

**Email**: privacy@cuberai.example

For security data concerns: security@cuberai.example  
For general questions: See CONTRIBUTING.md

## Compliance

This policy aims to comply with:

- GDPR (European Union)
- CCPA (California)
- Other applicable data protection laws

Specific regional requirements may apply based on your location.

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-01  
**Default Artifact Retention**: **90 days**
