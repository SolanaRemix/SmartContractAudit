# Data Privacy for Partners

## Overview

This document outlines how SmartContractAudit handles data in partnership contexts, extending our main [PRIVACY.md](/PRIVACY.md) policy.

## Data Shared with Partners

### What We Share

**Aggregate Data Only** (default):
- Total scans performed
- General usage statistics
- Anonymized vulnerability trends
- No user-identifiable information

**Individual Data** (with explicit user consent):
- Scan results for their own contracts
- Their own API usage metrics
- Their own support tickets

### What We DON'T Share

❌ **Never Shared Without Consent:**
- User personal information
- Email addresses
- Payment information
- Individual usage patterns
- Private repository contents
- Scan results from other users
- Contract source code (unless published)

## Partner Data Collection

### Data Partners May Collect

Partners integrating our tools may collect:
- Usage within their platform
- Integration performance metrics
- User feedback on integration
- Error logs and diagnostics

**Requirements:**
- Partners must have their own privacy policy
- Users must be informed of data collection
- Consent required for non-essential data
- Data minimization principles applied

### Partner Privacy Obligations

Partners must:
- ✅ Maintain their own compliant privacy policy
- ✅ Respect user privacy rights
- ✅ Secure all user data
- ✅ Allow users to opt-out of analytics
- ✅ Delete user data on request
- ✅ Not sell or share user data
- ✅ Comply with GDPR, CCPA, and applicable laws

## Data Processing Agreements

### When Required

A Data Processing Agreement (DPA) is required for partners who:
- Process user data on our behalf
- Receive any personal information
- Handle scan results containing sensitive code
- Operate in regulated industries

### DPA Contents

Our DPA covers:
- Data types processed
- Processing purposes
- Security measures
- Subprocessor list
- Data breach notification
- Audit rights
- Data retention
- International transfers

**Request DPA**: privacy@cuberai.example

## User Consent

### Consent Requirements

For sharing user data with partners:

**Required:**
- Clear explanation of what's shared
- Why it's being shared
- Which partner receives it
- Opt-in consent (not pre-checked)
- Easy opt-out mechanism

**Example Consent Text:**
> "Allow [Partner Name] to receive your scan results to provide enhanced analysis. [Partner Name]'s privacy policy applies to data they receive. [Link to partner privacy policy]"

### Revocation

Users can revoke consent:
- Immediately effective
- Data sharing stops
- Previously shared data handled per retention policies
- No penalty or service degradation

## Data Retention

### Our Retention

**Partner-related data:**
- Partnership agreements: 7 years after termination
- API usage logs: 90 days
- Support tickets: 2 years
- Aggregate statistics: Indefinitely (anonymized)

### Partner Retention

Partners must:
- Define retention periods
- Delete data when no longer needed
- Honor user deletion requests
- Document retention policy

## Security Requirements

### Minimum Standards

Partners handling user data must:

**Technical:**
- ✅ Encryption in transit (TLS 1.2+)
- ✅ Encryption at rest
- ✅ Access controls and authentication
- ✅ Regular security audits
- ✅ Vulnerability management
- ✅ Secure API keys and credentials

**Organizational:**
- ✅ Security policies documented
- ✅ Employee training
- ✅ Incident response plan
- ✅ Background checks for data access
- ✅ Compliance certifications (if applicable)

### Breach Notification

Partners must notify us within **24 hours** of discovering:
- Data breach affecting our users
- Unauthorized access to systems
- Loss of data integrity
- Compliance violations

**Contact**: security@cuberai.example

## International Data Transfers

### EU/EEA Partners

For partners in EU/EEA:
- Standard Contractual Clauses (SCCs) required
- Privacy Shield no longer valid
- GDPR compliance mandatory
- Data Protection Impact Assessment (DPIA) for high-risk processing

### Other Jurisdictions

- Compliance with local data protection laws
- Adequate safeguards for transfers
- Documentation of transfer mechanisms
- User notification of transfers

## User Rights

### Rights We Facilitate

For data shared with partners, users have rights to:

- **Access**: See what data partners have
- **Correction**: Fix inaccurate data
- **Deletion**: Request data deletion
- **Portability**: Receive data in portable format
- **Objection**: Object to certain processing
- **Restriction**: Limit processing

**How to Exercise**: privacy@cuberai.example

### Partner Cooperation

Partners must:
- Respond to our requests for user data (30 days)
- Support user rights requests
- Provide data for portability requests
- Delete data when requested
- Document actions taken

## Compliance

### Regulations

Partners must comply with:

- **GDPR** (EU)
- **CCPA/CPRA** (California)
- **LGPD** (Brazil)
- **PIPEDA** (Canada)
- **Other applicable laws**

### Certifications

Partners handling sensitive data should have:
- SOC 2 Type II (preferred)
- ISO 27001 (preferred)
- Industry-specific certifications
- Regular third-party audits

Not required but strongly encouraged for high-tier partners.

## Audit Rights

### Our Audit Rights

We reserve the right to:
- Audit partner data practices annually
- Request documentation of compliance
- Require remediation of issues
- Terminate partnership for violations

### Partner Audit Rights

Partners may:
- Request our compliance documentation
- Audit our data practices (reasonable notice)
- Verify security measures
- Review subprocessors

## Prohibited Uses

Partners must NOT:

❌ Sell user data to third parties  
❌ Use data for advertising without consent  
❌ Profile users without consent  
❌ Share data with unauthorized parties  
❌ Combine with other datasets without consent  
❌ Use for purposes beyond agreement  
❌ Retain data beyond agreed period  

Violations may result in immediate termination.

## Transparency

### Public Disclosure

We publicly disclose:
- List of partners
- General data sharing practices
- Privacy policy updates
- Breach notifications (if legally required)

### Partner Obligations

Partners must disclose:
- Their privacy policy
- Use of our data/services
- Subprocessors used
- International transfers

## Subprocessors

### Our Subprocessors

Current list:
- GitHub (code hosting, CI/CD)
- [Cloud Provider] (infrastructure)
- [Analytics Provider] (anonymized analytics)

Updated list: [subprocessors.md](#)

### Partner Subprocessors

Partners must:
- List all subprocessors
- Get our approval for new subprocessors
- Ensure subprocessor compliance
- Maintain subprocessor agreements

## Contact

### General Privacy Questions
**Email**: privacy@cuberai.example  
**Response Time**: 5 business days

### Partner Data Requests
**Email**: partners-privacy@cuberai.example  
**Response Time**: 2 business days

### Data Breach
**Email**: security@cuberai.example  
**Response Time**: Immediate

### DPA Requests
**Email**: privacy@cuberai.example  
**Include**: Partner name, data types, processing description

---

**Last Updated**: 2026-01-01  
**Policy Version**: 1.0  
**Applies To**: All partners handling user data  
**Review Cycle**: Quarterly
