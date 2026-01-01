# Privacy Policy

## Overview

SmartContractAudit is committed to protecting user privacy and handling data responsibly. This document outlines our privacy practices and data handling policies.

## Data Collection

### What We Collect

When you use SmartContractAudit:
- **Repository data**: Code, commits, and metadata from repositories being scanned
- **Scan results**: Security findings and audit reports
- **Usage data**: Workflow execution logs and performance metrics
- **User data**: GitHub usernames and email addresses (from commits/contributions)

### What We DO NOT Collect

- Private keys or credentials (these should NEVER be committed)
- Personal financial information
- Browsing history outside repository interactions
- Data from private repositories (unless explicitly authorized)

## Public Redaction Policy

### Critical Rule: NO PLAINTEXT PRIVATE KEYS

**We NEVER store, log, or transmit plaintext private keys, passwords, or other secrets.**

If secrets are accidentally committed:
1. Keys are immediately revoked/rotated
2. Secrets are redacted from logs and artifacts
3. Git history may be rewritten (with user permission)
4. Affected parties are notified

### Redaction Process

We automatically redact:
- Private keys (various formats)
- API tokens and credentials
- Passwords and passphrases
- SSH keys
- Database connection strings

Detected secrets are:
- Replaced with `[REDACTED]` in logs
- Quarantined for secure handling
- Reported to repository owners
- Never transmitted to third parties

## Data Usage

We use collected data to:
- Perform security scans and audits
- Generate reports and recommendations
- Improve our scanning algorithms
- Provide support and troubleshooting
- Maintain system security and integrity

We DO NOT:
- Sell or share your data with third parties
- Use your code for training AI models (without permission)
- Share your security findings publicly (without your consent)

## Data Storage

- **Scan results**: Stored as GitHub Actions artifacts (configurable retention)
- **Logs**: Retained according to [DATA_RETENTION.md](DATA_RETENTION.md)
- **Security findings**: Stored in quarantine directories with restricted access
- **Configuration**: Stored in your repository (you control it)

## Data Sharing

### When We Share Data

We may share data only in these circumstances:
- **With your permission**: When you explicitly authorize sharing
- **Legal requirements**: When required by law or court order
- **Security purposes**: To report vulnerabilities to affected parties
- **Service providers**: With trusted providers under strict data protection agreements

### Third-Party Services

SmartContractAudit may integrate with:
- GitHub (repository hosting and CI/CD)
- Artifact storage providers
- Security scanning tools

Each integration follows its own privacy policy. We carefully vet all third parties.

## Your Rights

You have the right to:
- **Access**: Request access to your data
- **Correction**: Request correction of inaccurate data
- **Deletion**: Request deletion of your data
- **Portability**: Request export of your data
- **Opt-out**: Opt out of optional data collection

## Data Retention

See [DATA_RETENTION.md](DATA_RETENTION.md) for detailed retention policies.

Default retention periods:
- Scan artifacts: 90 days
- Workflow logs: 90 days
- Security findings: Until resolved or 1 year
- User contributions: Indefinite (part of git history)

## Security Measures

We protect your data with:
- Encrypted transmission (HTTPS/TLS)
- Access controls and authentication
- Regular security audits
- Incident response procedures
- Secure deletion of expired data

## Children's Privacy

SmartContractAudit is not intended for users under 13. We do not knowingly collect data from children.

## Changes to This Policy

We may update this privacy policy. Changes will be:
- Posted in this repository
- Announced in release notes
- Effective 30 days after posting (unless urgent security changes)

## Contact

For privacy questions, concerns, or requests:
- **Email**: privacy@cuberai.example (placeholder contact)
- **Response time**: Within 7 business days

For security matters, see [SECURITY.md](SECURITY.md).

## Compliance

We strive to comply with:
- GDPR (European Union)
- CCPA (California)
- Other applicable privacy regulations

## Transparency

We believe in transparency. This policy is open source and we welcome feedback through GitHub issues.

---

Last updated: 2026-01-01
