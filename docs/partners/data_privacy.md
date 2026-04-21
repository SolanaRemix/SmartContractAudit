---
title: Data Privacy for Partners
description: Privacy and security practices for partner integrations
keywords: privacy, security, compliance, data protection, GDPR
---

# Data Privacy for Partners

This document outlines data privacy and security practices for SmartContractAudit partners.

## Overview

We take data privacy seriously and maintain strict policies to protect partner and user data. This document details how data is collected, processed, stored, and protected in partner integrations.

## Data Collection

### What We Collect

From partner integrations:

**Technical Data**:
- Smart contract source code (temporarily, for scanning)
- API request metadata (timestamps, endpoints, parameters)
- Scan results and findings
- Usage metrics (aggregated)

**Account Data**:
- Partner organization information
- Technical contact details
- Billing information
- API keys and access tokens (hashed)

### What We Never Collect

**Absolutely prohibited**:
- Private keys or mnemonics (in any form)
- Wallet passwords or credentials
- User personal data (unless explicitly needed and authorized)
- Sensitive business information beyond scope
- Data from unauthorized sources

## Data Processing

### Scanning Process

1. **Submission**: Contract code sent via API
2. **Scanning**: Analyzed in isolated environment
3. **Results**: Findings generated and stored
4. **Cleanup**: Source code deleted after processing
5. **Retention**: Results retained per agreement (default 90 days)

### Processing Location

- **Primary**: [Region to be specified, e.g., US-East]
- **Backup**: [Backup region to be specified]
- **On-Premise**: Available for enterprise partners
- **Data Residency**: Configurable for compliance

### Third-Party Processing

We may use third-party services for:

- Cloud hosting (AWS/GCP/Azure)
- CDN services
- Analytics (anonymized only)
- Support ticketing

All third parties are vetted and contractually bound to our privacy standards.

## Data Storage

### Storage Duration

| Data Type | Default Retention | Configurable |
|-----------|------------------|--------------|
| Source Code | 24 hours | Yes (0-7 days) |
| Scan Results | 90 days | Yes (30-365 days) |
| API Logs | 30 days | Yes (7-90 days) |
| Audit Reports | 1 year | Yes |
| Account Data | Active + 30 days | No |
| Billing Records | 7 years | No (legal requirement) |

### Storage Security

**Encryption**:
- **At Rest**: AES-256 encryption
- **In Transit**: TLS 1.3
- **Key Management**: HSM-backed key storage
- **Access Control**: Role-based with MFA

**Infrastructure**:
- SOC 2 Type II certified facilities
- Physical security controls
- Network segmentation
- DDoS protection
- Regular security audits

## Data Sharing

### What We Share

**With Partners** (your data only):
- Scan results for your contracts
- Usage analytics for your account
- Billing information
- Support interactions

**Aggregate Data** (anonymized):
- Industry benchmarks
- Vulnerability trends
- Performance metrics

### What We Never Share

- Individual partner data with other partners
- Competitive intelligence
- Unaggregated user data
- Source code (except back to submitter)
- Any data without authorization

### Legal Disclosure

We may disclose data when:
- Required by law or legal process
- Necessary to protect rights or safety
- Part of business transfer (with notice)
- With explicit partner consent

We will:
- Challenge overbroad requests
- Notify partners when legally permitted
- Minimize disclosure scope
- Document all disclosures

## Privacy by Design

### Principles

1. **Minimize Collection**: Only collect necessary data
2. **Purpose Limitation**: Use data only for stated purposes
3. **Access Control**: Restrict access to need-to-know basis
4. **Transparency**: Clear communication about practices
5. **User Control**: Partners control their data
6. **Security**: Protect data with appropriate measures
7. **Accountability**: Regular audits and compliance checks

### Implementation

**Pseudonymization**:
- Internal IDs instead of identifying information
- Separate storage of identifying data
- Limited access to mapping tables

**Aggregation**:
- Statistical analysis on aggregated data
- Individual records not identifiable
- K-anonymity for datasets

**Redaction**:
- Automatic secret detection and redaction
- Hash-based replacement
- Irreversible anonymization

## Compliance

### Regulatory Frameworks

We comply with:

**GDPR** (General Data Protection Regulation):
- Lawful basis for processing
- Data subject rights
- Privacy by design and default
- Data protection impact assessments
- Breach notification procedures

**CCPA** (California Consumer Privacy Act):
- Consumer rights to know and delete
- Opt-out of sale (not applicable - we don't sell)
- Non-discrimination
- Disclosure requirements

**SOC 2 Type II**:
- Security controls
- Availability guarantees
- Processing integrity
- Confidentiality
- Privacy

**ISO 27001** (in progress):
- Information security management
- Risk assessment and treatment
- Security controls implementation

### Industry Standards

- **PCI DSS**: For payment data handling
- **NIST Framework**: Cybersecurity best practices
- **CIS Controls**: Security configuration
- **OWASP**: Web application security

## Partner Responsibilities

### Data Protection Obligations

Partners must:

- **Secure API Keys**: Store keys securely, rotate regularly
- **Authorize Submissions**: Only scan authorized code
- **Respect User Privacy**: Comply with applicable privacy laws
- **Report Incidents**: Notify us of any security concerns
- **Maintain Compliance**: Ensure own compliance with regulations
- **Limit Access**: Restrict data access to necessary personnel

### Data Processing Agreement

Partners agree to:

- Process data per our instructions
- Maintain confidentiality
- Implement appropriate security
- Assist with data subject requests
- Notify of breaches promptly
- Delete/return data upon termination

## Data Subject Rights

Users whose data is processed have rights to:

### Access
- Request copy of their data
- Receive data in portable format
- Understand how data is used

### Correction
- Update inaccurate information
- Complete incomplete data
- Maintain accuracy

### Deletion ("Right to be Forgotten")
- Request deletion of data
- Exceptions: legal obligations, legitimate interests
- Verification required

### Restriction
- Limit processing in certain circumstances
- Object to processing
- Opt-out of marketing (not applicable)

### Portability
- Receive data in machine-readable format
- Transfer to another controller
- Where technically feasible

Partners must:
- Forward data subject requests to us within 2 business days
- Cooperate in fulfilling requests
- Maintain records of requests

## Security Measures

### Technical Controls

**Access Control**:
- Multi-factor authentication (MFA)
- Role-based access control (RBAC)
- Principle of least privilege
- Regular access reviews

**Network Security**:
- Firewalls and IDS/IPS
- Network segmentation
- VPN for administrative access
- DDoS mitigation

**Application Security**:
- Secure coding practices
- Regular security testing
- Vulnerability management
- Dependency scanning

**Monitoring**:
- 24/7 security monitoring
- Intrusion detection
- Anomaly detection
- Incident response procedures

### Organizational Controls

**Personnel**:
- Background checks
- Security training
- Confidentiality agreements
- Access termination procedures

**Policies**:
- Information security policy
- Acceptable use policy
- Incident response plan
- Business continuity plan

**Audits**:
- Annual third-party audits
- Internal security assessments
- Penetration testing
- Compliance reviews

## Breach Notification

### Our Commitment

In event of a data breach affecting partner data:

**Within 24 hours**:
- Initial assessment
- Containment measures
- Internal notification

**Within 72 hours**:
- Partner notification
- Regulatory notification (if required)
- Public disclosure (if required)

**Ongoing**:
- Investigation updates
- Remediation progress
- Prevention measures

### Notification Content

Breach notifications include:

- Nature and scope of breach
- Data types affected
- Number of affected records
- Actions taken
- Recommended partner actions
- Contact information for questions

### Partner Obligations

Partners must:
- Report suspected breaches to us immediately
- Cooperate in investigation
- Take recommended remediation steps
- Notify their users if required

## Cross-Border Data Transfers

### Mechanisms

For international data transfers:

**EU-US Data Privacy Framework**: [To be certified]

**Standard Contractual Clauses**: Available for GDPR compliance

**Adequacy Decisions**: Compliant with approved jurisdictions

**On-Premise Solutions**: Keep data in specific regions

### Partner Options

Partners can request:

- Specific data residency
- Regional processing only
- On-premise deployment
- Data localization

## Subprocessors

We use subprocessors for:

| Service | Provider | Location | Purpose |
|---------|----------|----------|---------|
| Cloud Hosting | [TBD] | [Region] | Infrastructure |
| CDN | [TBD] | Global | Content delivery |
| Support | [TBD] | [Region] | Customer service |
| Analytics | [TBD] | [Region] | Usage metrics |

**Notification**: Partners notified 30 days before new subprocessors

**Objection**: Partners may object to new subprocessors

**List**: Updated list maintained in partner portal

## Privacy Impact Assessments

We conduct DPIAs for:

- New features with privacy implications
- Significant processing changes
- New data types collected
- Changes in third-party services

Results shared with:
- Gold and Platinum partners (summary)
- Enterprise partners (full report)
- Regulators (as required)

## Contact and DPO

### Data Protection Officer

**Email**: dpo@cuberai.example
**Role**: Privacy compliance and data subject requests

### Privacy Questions

**General**: privacy@cuberai.example
**Partners**: partner-privacy@cuberai.example
**Security**: security@cuberai.example

### Supervisory Authority

For EU/EEA partners, supervisory authority:
[To be specified based on primary establishment]

## Updates

This privacy policy updated:
- As needed for regulatory changes
- Annually at minimum
- Before implementing significant changes

**Partner Notification**:
- Email notification
- 30-day notice period
- Option to terminate if unacceptable

Last updated: 2025-12-31

---

*This document is part of our partnership agreement. Partners should review with legal counsel. For questions, contact partner-privacy@cuberai.example.*
