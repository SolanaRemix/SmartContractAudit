# Privacy Policy

## Overview

<<<<<<< HEAD
<<<<<<< HEAD
This document outlines the privacy and data handling practices for the SmartContractAudit project. We are committed to protecting privacy and handling data responsibly.

## Data Collection and Usage

### What We Collect

This project may collect:

- **Public Repository Data**: Information visible in public GitHub repositories
- **Issue and PR Data**: Publicly submitted issues and pull requests
- **Usage Statistics**: Anonymous analytics about tool usage (when applicable)
- **Error Reports**: Diagnostic information from failures (sanitized)

### What We DO NOT Collect

We **never** collect or store:

- Private keys or seed phrases
- API keys or authentication tokens
- Passwords or credentials
- Personal financial information
- Personally identifiable information (PII) without consent

## Critical Security Policy: No Plaintext Private Keys

### Absolute Prohibition

**We never store, log, or transmit plaintext private keys or sensitive cryptographic material.**

This policy applies to:

- Source code and configuration files
- Log files and error messages
- Audit reports and artifacts
- Temporary files and caches
- Database storage
- Network transmissions
- Memory dumps or debugging output

### Redaction Requirements

All automation and tooling must:

- **Detect** potential secrets before storage or transmission
- **Redact** sensitive data in logs and outputs
- **Sanitize** all public artifacts
- **Reject** PRs or commits containing secrets
- **Alert** on potential exposure incidents

Example redaction patterns:

```
Private Key: [REDACTED]
API Key: ***************
Mnemonic: [REDACTED - 12 words]
Secret: ********
```

### Handling Secret Exposure

If a secret is accidentally exposed:

1. **Immediate Action**: Rotate/revoke the compromised credential
2. **Notification**: Alert security team at security@cuberai.example
3. **Remediation**: Remove from git history using git-filter-repo or BFG
4. **Documentation**: Document incident and prevention measures
5. **Prevention**: Update detection rules to prevent recurrence

## Data Retention

### Artifact Retention

- **Default Retention**: 90 days for workflow artifacts
- **Log Files**: 30 days for standard logs
- **Security Logs**: 180 days for security-related logs
- **Release Artifacts**: Indefinite for stable releases

### Deletion Requests

To request deletion of your data:

1. Email privacy@cuberai.example
2. Specify the data to be deleted
3. Provide verification of ownership
4. We will respond within 14 days

Note: Some data (e.g., public git commits) cannot be deleted due to the distributed nature of git.

## Third-Party Services

This project may use:

- **GitHub**: Repository hosting and CI/CD
  - [GitHub Privacy Policy](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)
- **npm/PyPI**: Package distribution
- **CDNs**: Content delivery for documentation

Each service has its own privacy policy. We recommend reviewing them.

## Contributor Privacy

### Public Contributions

By contributing to this project:

- Your commits become part of public git history
- Your GitHub username is visible
- Contribution statistics may be public
- Communications in issues/PRs are public

### Protecting Your Privacy

As a contributor, you can:

- Use a pseudonymous GitHub account
- Use GitHub's private email feature
- Request removal of specific PII from documentation
- Opt out of contributor recognition lists

## Transparency Reports

We are committed to transparency:

- Security incidents are disclosed (after remediation)
- Data breaches are reported promptly
- Changes to this policy are announced

## Contact

For privacy concerns or questions:

**Email**: privacy@cuberai.example

Response time: 5-7 business days

For security issues, use: security@cuberai.example

## Automated Scanning

### Secret Detection

Our tools implement:

- Pre-commit hooks for secret detection (recommended)
- CI/CD scanning for exposed secrets
- Periodic audits of repository history
- Automated redaction in logs and artifacts

### Configurable Detection

Pattern detection includes:

- Private keys (RSA, EC, etc.)
- API keys and tokens
- Database credentials
- OAuth tokens
- JWT tokens
- Encryption keys
- Custom patterns (configurable)

## Compliance

This project aims to be compliant with:

- GDPR (for European contributors)
- CCPA (for California contributors)
- General data protection best practices

While this is an open-source project and not a commercial service, we strive to respect privacy rights globally.

## Data Minimization

We follow the principle of data minimization:

- Collect only what is necessary
- Retain data only as long as needed
- Delete data when no longer required
- Anonymize data when possible

## User Rights

You have the right to:

- **Access**: Request copies of your data
- **Rectification**: Request correction of inaccurate data
- **Erasure**: Request deletion (where technically feasible)
- **Portability**: Receive data in a portable format
- **Objection**: Object to processing of your data

To exercise these rights, contact privacy@cuberai.example.

## Children's Privacy

This project is not directed at children under 13. We do not knowingly collect information from children.

## Changes to This Policy

We may update this policy:

- Major changes are announced via GitHub
- Continued use constitutes acceptance
- Previous versions available in git history

## Related Policies

- [SECURITY.md](SECURITY.md) - Security and vulnerability disclosure
- [DATA_RETENTION.md](DATA_RETENTION.md) - Data retention specifics
- [GOVERNANCE.md](GOVERNANCE.md) - Project governance

---

**Last Updated**: 2026-01-01

**Contact**: privacy@cuberai.example
=======
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
=======
CyberAi is committed to protecting the privacy of our users and contributors. This document outlines our privacy practices, data handling policies, and your rights.

## Information We Collect

### Automatically Collected Information

When you interact with our project, we may collect:

- **Repository interaction data**: Pull requests, issues, comments (via GitHub)
- **Usage analytics**: Tool usage patterns, error reports (if analytics enabled)
- **Log data**: IP addresses, timestamps, user agents (standard server logs)

### Information You Provide

- **Contribution data**: Code, documentation, commit messages
- **Identity information**: Name, email, GitHub username (via Git commits)
- **Communication**: Messages in issues, pull requests, discussions
- **Support requests**: Information provided when seeking help

### Information We Do Not Collect

- Payment information (handled by third-party payment processors)
- Private repository contents (unless explicitly shared)
- Passwords or authentication tokens
- Personal data beyond what's necessary for project participation

## How We Use Information

We use collected information to:

- Maintain and improve the project
- Communicate about updates, security issues, and releases
- Attribute contributions appropriately
- Respond to support requests
- Enforce Code of Conduct
- Detect and prevent security incidents
- Comply with legal obligations

## Data Sharing

### Public Information

The following information is public by nature:

- Git commits (name, email, commit messages)
- Pull requests, issues, and comments
- GitHub profile information
- Contributions and statistics

### Limited Sharing

We may share information with:

- **Service providers**: GitHub, hosting providers, analytics services
- **Security researchers**: When investigating security issues
- **Legal authorities**: When required by law or to protect rights

### What We Do Not Share

We do not:

- Sell or rent your personal information
- Share private communications without consent
- Use your data for advertising purposes
- Provide data to third parties for their marketing

## Data Redaction Policy

### Requesting Redaction

If you need to redact sensitive information accidentally disclosed:

1. **Contact us immediately**: privacy@cyberai.network
2. **Describe the information**: What needs to be redacted and where
3. **Provide context**: Why redaction is necessary

### Redaction Process

We will:

1. **Review the request** within 5 business days
2. **Assess feasibility**: Some Git history may require repository rewrite
3. **Take action**: Redact, remove, or provide guidance
4. **Notify you**: Confirm action taken or explain limitations

### Limitations

- Git history is distributed; complete removal may be impossible
- Public forks may retain the information
- Cached or archived versions may exist
- Some redactions may require rewriting project history

### What Can Be Redacted

- Accidentally committed secrets or credentials
- Personal information disclosed in error
- Private communications made public accidentally
- Sensitive business information

### What Cannot Be Redacted

- Public contributions made intentionally
- Attribution information (violates contributor rights)
- Information already widely distributed
- Historical context necessary for project integrity

## Data Retention

### Active Data

We retain active data as long as it's necessary for:

- Project maintenance and development
- Legal compliance
- Security and fraud prevention

### Archived Data

- **Release artifacts**: Indefinitely for version history
- **Closed issues/PRs**: Retained for project history
- **Logs**: Typically 90 days unless needed for investigation
- **Analytics**: Aggregated data retained indefinitely

### Data Deletion Requests

You may request deletion of personal data by contacting privacy@cyberai.network.

**Note**: Some data cannot be deleted due to:
- Legal requirements
- Security and fraud prevention
- Git commit attribution rights
- Project integrity and history

## Your Rights

Depending on your jurisdiction, you may have rights to:

- **Access**: Request copies of your personal data
- **Correction**: Request correction of inaccurate data
- **Deletion**: Request deletion of your data (where possible)
- **Portability**: Receive your data in a structured format
- **Objection**: Object to certain data processing
- **Restriction**: Request restricted processing

To exercise these rights, contact privacy@cyberai.network.

## Security

We implement reasonable security measures:

- Encrypted communications (HTTPS, SSH)
- Access controls and authentication
- Regular security audits
- Incident response procedures
- Secure development practices

However, no system is completely secure. Report security concerns to security@cyberai.network.

## Third-Party Services

We use third-party services that have their own privacy policies:

- **GitHub**: https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement
- **npm**: https://docs.npmjs.com/policies/privacy
- Payment processors: See FUNDING.yml for specific processors

## Cookies and Tracking

- **GitHub**: Uses cookies for functionality and analytics
- **Project website**: May use minimal cookies for functionality
- **Analytics**: May use anonymized analytics (can be disabled)

We do not use tracking cookies for advertising.

## Children's Privacy

This project is not directed at children under 13. We do not knowingly collect information from children. If you believe a child has provided information, contact privacy@cyberai.network.

## International Data Transfers

Data may be processed in countries where:

- Project maintainers are located
- Service providers operate
- Data centers are hosted

We rely on appropriate safeguards for international transfers.

## Changes to Privacy Policy

We may update this policy. Changes will be:

- Posted in the repository
- Announced in release notes for significant changes
- Effective immediately unless otherwise stated

Check back regularly for updates.
>>>>>>> origin/pr10

## Contact

For privacy questions, concerns, or requests:
<<<<<<< HEAD
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
>>>>>>> origin/pr9
=======

**Email**: privacy@cyberai.network

For security issues: security@cyberai.network  
For general questions: See CONTRIBUTING.md

## Effective Date

This privacy policy is effective as of **2026-01-01**.

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-01
>>>>>>> origin/pr10
