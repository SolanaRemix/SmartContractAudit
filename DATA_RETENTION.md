# Data Retention Policy

## Overview

<<<<<<< HEAD
<<<<<<< HEAD
This document defines how long different types of data are retained in the SmartContractAudit project and the process for requesting data deletion.

## Artifact Retention Periods

### Workflow Artifacts

**Default Retention: 90 days**

GitHub Actions artifacts include:

- Build outputs
- Test results
- Audit reports (AUDIT-REPORT.md)
- Scan logs (SMARTBRAIN.log)
- Quarantine directories (.quarantine/)
- Coverage reports

**Rationale**: Balances storage costs with troubleshooting needs.

### Log Files

**Standard Logs: 30 days**
- Application logs
- Debug logs
- Workflow run logs

**Security Logs: 180 days**
- Authentication logs
- Security scan results
- Vulnerability reports
- Incident response logs

**Rationale**: Security logs retained longer for compliance and investigation purposes.

### Release Artifacts

**Retention: Indefinite**

Stable release artifacts are retained permanently:

- Release binaries and packages
- Release notes and changelogs
- Version tags
- Release documentation

**Rationale**: Required for reproducibility and user access to specific versions.

### Git Repository Data

**Retention: Permanent (with caveats)**

Git commits, issues, and pull requests:

- Commits are part of permanent git history
- Closed issues and PRs remain accessible
- Discussions and comments are retained
- Some data can be redacted but not fully deleted

**Rationale**: Git's distributed nature and project history requirements.

### Temporary Files

**Retention: 24-48 hours**

Temporary processing files:

- Cache directories
- Intermediate build files
- Temporary scan results
- Session data

**Rationale**: Cleanup to manage storage and security.

## Storage Locations

Data is stored in:

- **GitHub**: Repository, issues, PRs, artifacts, workflows
- **GitHub Actions**: Workflow logs and artifacts (per GitHub's retention policy)
- **Local Caches**: Temporary files in CI/CD runners (ephemeral)

## Deletion Request Process

### How to Request Deletion

1. **Submit Request**
   - Email: privacy@cuberai.example
   - Subject: "Data Deletion Request - [Your Name/Handle]"

2. **Provide Details**
   - Specific data to be deleted
   - Location/URLs of the data
   - Reason for deletion (optional)
   - Proof of ownership/authorization

3. **Verification**
   - We verify the request is legitimate
   - May require confirmation from the GitHub account owner
   - Processing time: 14 business days

4. **Deletion**
   - We delete what is technically and legally feasible
   - Provide confirmation of deletion
   - Explain any data that cannot be deleted and why

### What Can Be Deleted

✅ **Can Usually Be Deleted:**
- Personally identifiable information in documentation
- Your email from git history (replaced with GitHub noreply)
- Specific comments or discussion posts
- Workflow artifacts (if not yet expired)
- Temporary caches and logs

### What Cannot Be Deleted

❌ **Cannot Be Deleted:**
- Git commit hashes and metadata (distributed across forks)
- Code contributions (part of permanent history)
- Public release artifacts
- Data required for legal/compliance purposes
- Data in third-party forks (outside our control)

### Redaction Alternative

For data that cannot be deleted:

- **Redaction**: Replace sensitive data with `[REDACTED]`
- **Anonymization**: Replace identifying information with pseudonyms
- **History Rewrite**: Use `git filter-repo` for severe cases (disruptive)

## Automated Cleanup

### Scheduled Cleanup Tasks

- **Daily**: Remove temp files older than 48 hours
- **Weekly**: Archive logs older than retention period
- **Monthly**: Clean up expired workflow artifacts
- **Quarterly**: Review and archive old closed issues

### Configuration

Retention periods can be configured in `config/repair.json`:

```json
{
  "artifact_retention_days": 90,
  "log_retention_days": 30,
  "security_log_retention_days": 180
}
```

## Exceptions and Overrides

### Legal Hold

Data may be retained beyond standard periods if:

- Required by law or legal process
- Part of ongoing investigation
- Subject to regulatory requirements
- Necessary for litigation

### User-Requested Extension

Users may request extended retention:

- Contact privacy@cuberai.example
- Provide justification
- Maximum extension: 1 year beyond standard period

## Data Minimization

We practice data minimization:

- Collect only necessary data
- Anonymize where possible
- Redact sensitive information automatically
- Delete data proactively when no longer needed

## Backup Retention

Backups follow retention policies:

- **Incremental Backups**: 30 days
- **Monthly Backups**: 1 year
- **Annual Backups**: 3 years

Deleted data is purged from backups during the next backup cycle.

## Third-Party Retention

Third-party services have their own policies:

- **GitHub**: See [GitHub's data retention policy](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)
- **npm/PyPI**: Package metadata retained indefinitely
- **CDNs**: Cached data typically 24-48 hours

## Audit Trail

We maintain audit trails for:

- Data deletion requests (5 years)
- Security incidents (7 years)
- Access logs (180 days)
- Retention policy changes (permanent)

## Policy Updates

This policy may be updated:

- Changes announced via GitHub
- 30-day notice for significant changes
- Previous versions available in git history

## Contact

For data retention questions or deletion requests:

**Email**: privacy@cuberai.example

**Response Time**: 5-7 business days

For urgent security-related deletion:

**Email**: security@cuberai.example

**Response Time**: 24-48 hours

## Related Documents

- [PRIVACY.md](PRIVACY.md) - Overall privacy policy
- [SECURITY.md](SECURITY.md) - Security policies
- [GOVERNANCE.md](GOVERNANCE.md) - Project governance

---

**Last Updated**: 2026-01-01

**Next Review**: 2026-07-01
=======
This document outlines SmartContractAudit's data retention practices, including how long we keep different types of data and how to request deletion.

## Default Retention Periods

### Artifacts and Scan Results

| Data Type | Default Retention | Configurable |
|-----------|------------------|--------------|
| Workflow artifacts | 90 days | Yes (30-400 days) |
| Scan logs | 90 days | Yes |
| Quarantine files | 90 days | Yes |
| Security reports | 90 days | Yes |
| Audit summaries | 90 days | Yes |

### Repository Data

| Data Type | Retention Period | Notes |
|-----------|-----------------|-------|
| Git commits | Indefinite | Part of repository history |
| Pull requests | Indefinite | GitHub controls retention |
| Issues | Indefinite | GitHub controls retention |
| Discussions | Indefinite | GitHub controls retention |

### User Data

| Data Type | Retention Period | Notes |
|-----------|-----------------|-------|
| Contributor info | Indefinite | From git history |
| Sign-off (DCO) | Indefinite | Legal requirement |
| Email addresses | Indefinite | From git commits |

### Temporary Data

| Data Type | Retention Period | Notes |
|-----------|-----------------|-------|
| Build caches | 7 days | Automatic cleanup |
| Temp files | 24 hours | Automatic cleanup |
| Session data | End of session | Not persisted |

## Configuring Retention

### GitHub Actions Artifacts

You can customize artifact retention in workflow files:

```yaml
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  with:
    name: scan-results
    path: .quarantine/
    retention-days: 90  # Adjust as needed (30-400)
```

### Organization Settings

Repository administrators can set default retention periods in GitHub organization settings.
=======
This document outlines the data retention policies for CyberAi, including default retention periods, deletion procedures, and how to request data removal.

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
>>>>>>> origin/pr10

## Data Deletion Requests

### How to Request Deletion

<<<<<<< HEAD
To request deletion of your data:

1. **Email**: privacy@cuberai.example (placeholder contact)
2. **Subject**: Data Deletion Request - [Your GitHub Username]
3. **Include**:
   - Your GitHub username
   - Type of data to delete
   - Reason for deletion (optional)
   - Verification of your identity

### What Can Be Deleted

✅ **Can be deleted**:
- Workflow artifacts (before retention expires)
- Scan logs and reports
- Quarantine files
- Cached data
- Session data

❌ **Cannot be deleted** (or requires special handling):
- Git commit history (immutable by design)
- Merged pull requests (GitHub retention policy)
- Signed-off commits (legal DCO requirement)
- Data required for legal/compliance purposes

### Deletion Process

1. **Request received** - We acknowledge within 2 business days
2. **Verification** - We verify your identity (typically via GitHub)
3. **Review** - We review what data can be deleted
4. **Deletion** - We delete eligible data within 14 days
5. **Confirmation** - We confirm completion via email

### Special Cases

#### Git History

Removing data from git history requires:
- Force-push capabilities (destructive operation)
- Coordination with all repository clones
- May not be possible for merged/public code

We can:
- Add data to .gitignore for future
- Redact secrets from logs
- Remove from active branches

#### Legal Holds

Some data may be retained longer if:
- Required by law or regulation
- Subject to legal proceedings
- Needed for security investigations
- Part of audit trails

## Automatic Cleanup

### Scheduled Cleanup

We automatically clean up:
- Expired artifacts (daily)
- Old temporary files (daily)
- Completed workflow logs (after retention period)
- Unused caches (weekly)

### Manual Cleanup

Repository maintainers can manually trigger cleanup:

```bash
# Clean old artifacts
gh api repos/:owner/:repo/actions/artifacts --paginate \
  | jq -r '.artifacts[] | select(.expired == true) | .id' \
  | xargs -I {} gh api -X DELETE repos/:owner/:repo/actions/artifacts/{}

# Clean local caches
rm -rf .cache/
rm -rf /tmp/smartcontract-*
```

## Data Export

### Requesting Your Data

To export your data:

1. **Email**: privacy@cuberai.example
2. **Subject**: Data Export Request - [Your GitHub Username]
3. **Include**: Specific data you want exported

We will provide:
- Machine-readable format (JSON/CSV)
- Within 30 days of request
- Via secure download link

### Self-Service Export

You can export some data yourself:
- Git repository: `git clone` or GitHub export
- Artifacts: Download from GitHub Actions UI
- Reports: Download from workflow runs

## Compliance

This retention policy complies with:
- GDPR (Right to erasure)
- CCPA (Right to deletion)
- GitHub Terms of Service
- Apache 2.0 License requirements

## Exceptions

Data retention may be extended for:
- Active security investigations
- Ongoing legal proceedings
- Regulatory compliance requirements
- With your explicit consent

## Updates to This Policy

We may update this policy to:
- Reflect new features
- Comply with regulations
- Improve data handling

Changes are effective 30 days after posting, unless:
- Required immediately by law
- Needed for security reasons

## Contact

For questions or requests regarding data retention:

- **Email**: privacy@cuberai.example (placeholder contact)
- **Response time**: Within 7 business days
- **Deletion requests**: Acknowledged within 2 business days

For security-related data inquiries, see [SECURITY.md](SECURITY.md).

---

Last updated: 2026-01-01
>>>>>>> origin/pr9
=======
To request data deletion:

1. **Email**: privacy@cyberai.network
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
- **Analytics**: Request export via privacy@cyberai.network
- **Communications**: Request archive via privacy@cyberai.network

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

**Email**: privacy@cyberai.network

For security data concerns: security@cyberai.network  
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
>>>>>>> origin/pr10
