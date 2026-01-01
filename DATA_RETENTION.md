# Data Retention Policy

## Overview

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

## Data Deletion Requests

### How to Request Deletion

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
