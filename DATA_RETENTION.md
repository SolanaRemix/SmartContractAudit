# Data Retention Policy

## Overview

This document outlines how long different types of data are retained in the SmartContractAudit system and the processes for data deletion.

## Retention Periods

### Audit Artifacts

**Default Retention: 90 days**

Audit artifacts include:
- SMARTBRAIN.log files
- AUDIT-REPORT.md files
- .quarantine/ directory contents
- Scan results and findings

**After 90 days:**
- Automatically archived or deleted
- Users can request extended retention
- Critical security findings may be retained longer (anonymized)

### System Logs

**Default Retention: 30 days**

System logs include:
- Application logs
- Access logs
- Error logs
- Debug logs

**Characteristics:**
- Automatically sanitized (see PRIVACY.md)
- Rotated daily
- Compressed after 7 days
- Purged after 30 days

### Quarantine Data

**Default Retention: 30 days**

Quarantined files:
- Suspicious or malicious code samples
- Detected secrets (redacted, hashed only)
- Flagged artifacts

**After 30 days:**
- Automatically purged
- Only hashes retained for detection
- No plaintext or reversible data kept

### Audit Reports

**Retention: Until user deletion or 1 year**

Published audit reports:
- Retained with user consent
- Can be deleted on request
- Anonymized versions may be retained for research
- Public reports retained indefinitely (with permission)

### User Submissions

**Retention: Until processing complete + 7 days**

Code submitted for audit:
- Processed and analyzed
- Retained during audit period
- Deleted 7 days after report delivery
- Can be deleted immediately on request

### Scan Metadata

**Retention: 180 days**

Metadata includes:
- Scan timestamps
- File hashes (not content)
- Severity counts
- Configuration used

**Purpose:**
- Historical analysis
- Pattern detection
- Performance metrics

## Redaction and Hashing

### Private Keys

**Retention: NEVER**

- Private keys are never stored in any form
- Detected keys are immediately redacted
- Only cryptographic hashes retained for future detection
- Hashes retained for 1 year to prevent resubmission

### Secrets and Credentials

**Retention: Hashes only, 1 year**

- Plaintext never stored
- Hash stored for detection purposes
- Original secret cannot be recovered
- User notified for remediation

### Personal Identifiable Information (PII)

**Retention: Minimal, user-controlled**

- Email addresses: Until account deletion
- Names: Optional, user-controlled
- Contact info: Deletable on request
- No unnecessary PII collected

## Deletion Procedures

### Automatic Deletion

Automated processes run:
- **Daily**: Log rotation and compression
- **Weekly**: Expired quarantine purge
- **Monthly**: Artifact cleanup based on retention policy

### User-Requested Deletion

Users can request deletion of:

1. **Immediate deletion** (within 24 hours):
   - Submitted code
   - Audit reports (unpublished)
   - User account data

2. **Verification required** (within 7 days):
   - Published reports
   - Shared artifacts
   - Collaborative submissions

3. **Cannot delete**:
   - Anonymized aggregate statistics
   - Public security findings (already disclosed)
   - Legal compliance records

### Deletion Request Process

To request deletion:

1. **Submit request**: Email security@cuberai.example
2. **Verify identity**: Confirm ownership of data
3. **Specify scope**: What data to delete
4. **Receive confirmation**: Deletion confirmed within stated timeframe

## Data Archival

### Long-Term Archival

Some data may be archived beyond retention periods:

**Anonymized Research Data:**
- No personally identifiable information
- No reversible sensitive data
- Only statistical patterns
- Opt-in only

**Public Security Findings:**
- Publicly disclosed vulnerabilities
- CVE records
- Advisory publications
- Required for historical reference

**Legal Compliance:**
- Records required by law
- Audit trails for security incidents
- Minimal retention period required

## Exceptions and Extensions

### User-Requested Extension

Users can request extended retention for:
- Ongoing investigations
- Legal compliance
- Business requirements

**Process:**
- Submit extension request
- Specify duration needed
- Automatic expiry after extension period

### Regulatory Requirements

Some data may be retained longer when:
- Required by law
- Part of legal proceedings
- Security incident under investigation
- Regulatory audit in progress

## Geographic Considerations

Data retention may vary by region based on:
- Local data protection laws
- Regulatory requirements
- User location and preferences

## Backup and Recovery

### Backup Retention

- **Daily backups**: Retained 7 days
- **Weekly backups**: Retained 4 weeks
- **Monthly backups**: Retained 12 months

**Note:** Backups follow same retention and deletion policies as primary data.

### Recovery Process

In case of data loss:
- Recovery from most recent backup
- Retention policies apply to recovered data
- Users notified of any recovery events

## Transparency and Verification

### Audit Trail

All data operations logged:
- Creation timestamp
- Access history
- Modification events
- Deletion timestamp

### User Access

Users can:
- View retention status of their data
- Request data export before deletion
- Verify deletion completion
- Review access logs

## Configuration

### Default Configuration (config/repair.json)

```json
{
  "retention": {
    "artifacts": "90d",
    "logs": "30d",
    "quarantine": "30d",
    "reports": "1y"
  }
}
```

### Custom Retention

Organizations can configure custom retention periods:
- Longer retention for compliance
- Shorter retention for privacy
- Per-artifact-type policies
- Geographic-specific rules

## Updates to Policy

This retention policy may be updated to:
- Comply with new regulations
- Improve privacy protection
- Reflect technical changes
- Address user feedback

**Notification:**
- Users notified 30 days before changes
- Opt-out options provided
- Changes logged in repository

## Contact

Questions about data retention:

- **Email**: security@cuberai.example
- **Documentation**: See [PRIVACY.md](PRIVACY.md)
- **Issues**: GitHub issue tracker

Last updated: 2025-12-31

## Summary Table

| Data Type | Default Retention | Auto-Delete | User-Deletable |
|-----------|------------------|-------------|----------------|
| Private Keys | NEVER STORED | N/A | N/A |
| Secrets (hash) | 1 year | Yes | No |
| Audit Artifacts | 90 days | Yes | Yes |
| System Logs | 30 days | Yes | Request |
| Quarantine Files | 30 days | Yes | Yes |
| Audit Reports | 1 year | No | Yes |
| User Submissions | 7 days | Yes | Yes |
| Metadata | 180 days | Yes | Request |
| Backups | Up to 12 months | Yes | With primary data |
