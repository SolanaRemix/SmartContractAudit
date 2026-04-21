# Privacy Policy

## Overview

SmartContractAudit is committed to protecting privacy and handling data responsibly. This document outlines our data handling practices.

## Data Collection

### What We Don't Collect

We do **NOT** collect, store, or transmit:

- Private keys (never in plaintext or any form)
- Wallet mnemonics or seed phrases
- Passwords or credentials
- Personal identifying information without consent
- Sensitive smart contract details without authorization

### What We May Collect

When using the service, we may process:

- **Public blockchain data**: Publicly available on-chain information
- **Code submissions**: Smart contracts submitted for audit (with user consent)
- **Audit results**: Security findings and reports
- **Usage metrics**: Anonymous usage statistics for improvement
- **Logs**: System logs for debugging (sanitized, see below)

## Public Redaction Policy

### Private Key Protection

**Absolute Rule**: Private keys are NEVER stored in any form.

- Private keys detected in submissions are immediately redacted
- Only cryptographic hashes stored for detection purposes
- Original keys are never logged, cached, or transmitted
- Automated detection flags potential key leaks before storage

### Sensitive Data Handling

For any sensitive data detected:

1. **Immediate Redaction**: Data is redacted at ingestion
2. **Hash Storage**: Only cryptographic hashes stored for future detection
3. **Alert Generation**: Security team notified of detection
4. **User Notification**: Submitter alerted to remediate source
5. **No Plaintext**: Original sensitive data never persists

### Log Sanitization

All logs undergo automatic sanitization:

- Pattern matching for common secret formats
- Redaction before writing to disk
- Hash-based replacement for audit trail
- Regular expression filters for:
  - Private keys (various formats)
  - API tokens
  - Credentials
  - Email addresses (optional redaction)
  - IP addresses (optional redaction)

## Data Retention

See [DATA_RETENTION.md](DATA_RETENTION.md) for detailed retention policies.

**Summary:**
- Audit artifacts: 90 days default
- Logs: 30 days default
- Reports: Retained with user consent
- Personal data: Minimal retention, deletable on request

## Data Storage

### Security Measures

- **Encryption at rest**: All stored data encrypted
- **Encryption in transit**: TLS 1.3 for all communications
- **Access control**: Role-based access with principle of least privilege
- **Audit logging**: All data access logged for security
- **Geographic location**: Data stored in [REGION TO BE SPECIFIED]

### Third-Party Services

We may use third-party services for:

- Code hosting (GitHub)
- Artifact storage (temporary)
- Analytics (anonymous only)

These services have their own privacy policies and data handling practices.

## User Rights

### Access

Users have the right to:

- Request copies of their data
- Review audit reports
- Verify redaction of sensitive data
- Export results in standard formats

### Deletion

Users may request:

- Deletion of submitted code
- Removal of audit reports
- Purging of associated logs (within retention windows)

### Correction

Users may:

- Update contact information
- Correct metadata in reports
- Request re-audit if initial submission contained errors

## Data Sharing

### What We Share

- **Public Reports**: Only with explicit user consent
- **Security Findings**: Aggregate, anonymized statistics
- **Research Data**: De-identified data for security research (opt-in)

### What We Never Share

- Private keys or credentials (we don't have them)
- Unapproved audit results
- User code without permission
- Personal information without consent
- Data with third parties for marketing

## Compliance

We aim to comply with:

- GDPR (General Data Protection Regulation)
- CCPA (California Consumer Privacy Act)
- Industry best practices for security data handling

## Breach Notification

In the unlikely event of a data breach:

1. **Immediate Response**: Contain and investigate within 24 hours
2. **User Notification**: Affected users notified within 72 hours
3. **Authority Notification**: Regulators notified per legal requirements
4. **Transparency**: Public disclosure of incident and response
5. **Remediation**: Steps taken to prevent recurrence

## Cookies and Tracking

### GitHub Pages (if used)

The web interface may use:

- **Session cookies**: For functionality only
- **Analytics**: Optional, anonymous usage data
- **No tracking**: No cross-site tracking or advertising cookies

Users can disable cookies in browser settings.

## Children's Privacy

This service is not intended for users under 13 years of age. We do not knowingly collect data from children.

## International Data Transfers

Data may be processed in different jurisdictions. We ensure adequate safeguards through:

- Standard contractual clauses
- Encryption in transit and at rest
- Compliance with international frameworks

## Contact

For privacy questions or requests:

- **Email**: security@cuberai.example
- **Issue Tracker**: GitHub Issues (for non-sensitive questions)
- **Security Reports**: See [SECURITY.md](SECURITY.md)

## Changes to Policy

We may update this policy periodically. Changes will be:

- Posted on this page
- Announced in project updates
- Effective 30 days after posting

Last updated: 2025-12-31

## Transparency

This project is open source. You can:

- Review our code for data handling
- Audit our redaction mechanisms
- Verify our security practices
- Contribute improvements

We believe in privacy through transparency and technical implementation, not just policy.
