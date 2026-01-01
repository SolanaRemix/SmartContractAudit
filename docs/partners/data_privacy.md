---
title: Data Privacy for Partners
description: How we handle partner and user data
keywords: privacy, data protection, GDPR, compliance
---

# Data Privacy for Partners

## Overview

SmartContractAudit is committed to protecting the privacy of our partners and their users. This document outlines our data practices for partner integrations.

## Data Collection

### What We Collect

**From Partner Integration**:
- Repository URLs and metadata
- Scan configurations
- API usage statistics
- Integration performance metrics
- Error logs (no sensitive data)

**From End Users** (via partner integration):
- GitHub usernames (public)
- Scan results
- Security findings
- Usage patterns

### What We DON'T Collect

- ❌ Private keys or credentials
- ❌ User passwords
- ❌ Financial information
- ❌ Personal identifiable information (beyond GitHub username)
- ❌ Private repository code (unless authorized)

## Data Usage

### How We Use Data

1. **Service Delivery**
   - Perform security scans
   - Generate reports
   - Provide recommendations

2. **Service Improvement**
   - Improve scan accuracy
   - Optimize performance
   - Develop new features

3. **Analytics**
   - Aggregated usage statistics
   - Performance metrics
   - Anonymized trend analysis

4. **Communication**
   - Service notifications
   - Security alerts
   - Product updates

### How We DON'T Use Data

- ❌ Sell to third parties
- ❌ Train AI models (without permission)
- ❌ Share publicly (unless findings require disclosure)
- ❌ Use for advertising
- ❌ Share with competitors

## Data Storage

### Where Data is Stored

- **Primary**: AWS (US-East-1)
- **Backup**: AWS (EU-West-1)
- **Logs**: Encrypted cloud storage
- **Artifacts**: GitHub Actions (90-day retention)

### Security Measures

- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Access controls (RBAC)
- Regular security audits
- SOC 2 compliance (in progress)

### Retention Periods

| Data Type | Retention | Notes |
|-----------|-----------|-------|
| Scan results | 90 days | Configurable |
| API logs | 30 days | Aggregated after |
| Metrics | 1 year | Anonymized |
| Security findings | Until resolved | Critical data |
| User accounts | Active + 30 days | After deletion request |

## Data Sharing

### When We Share Data

**With Partners**:
- You receive your integration's data
- Aggregated metrics (anonymized)
- Security findings for your users

**With Third Parties**:
- Infrastructure providers (AWS, GitHub)
- Analytics tools (anonymized)
- Security tools (hashed data)

**Legal Requirements**:
- Court orders
- Law enforcement (valid warrants)
- Regulatory compliance

### When We DON'T Share

- Never sell user data
- Never share with competitors
- Never public disclosure without permission
- Never unauthorized access

## Partner Responsibilities

### Data Protection

Partners must:
- ✅ Protect API credentials
- ✅ Use HTTPS for all communications
- ✅ Implement access controls
- ✅ Follow security best practices
- ✅ Comply with applicable laws (GDPR, CCPA, etc.)

### User Privacy

Partners must:
- ✅ Provide privacy notice to users
- ✅ Obtain consent for data processing
- ✅ Honor user data requests
- ✅ Report data breaches promptly
- ✅ Implement data minimization

### Data Processing Agreement

All partners must sign a Data Processing Agreement (DPA) covering:
- Processing scope and purpose
- Data subject rights
- Security measures
- Sub-processors
- Breach notification
- Audit rights

## User Rights

### Rights We Support

**Access**: Users can request their data  
**Correction**: Users can correct inaccurate data  
**Deletion**: Users can request data deletion  
**Portability**: Users can export their data  
**Objection**: Users can object to processing  

### How to Exercise Rights

1. **Via Partner**: Users contact partner directly
2. **Direct Request**: Email privacy@cuberai.example
3. **Automated**: Through API (coming soon)

**Response Time**: 30 days maximum

## Compliance

### Regulations

We comply with:
- **GDPR** (European Union)
- **CCPA** (California)
- **LGPD** (Brazil)
- **PIPEDA** (Canada)
- Other applicable laws

### Certifications

- SOC 2 Type II (in progress)
- ISO 27001 (planned)
- Privacy Shield (if applicable)

## Incident Response

### Data Breach Notification

If a breach occurs:
1. **Discovery**: Detect and contain (immediate)
2. **Assessment**: Determine impact (24 hours)
3. **Notification**: Notify partners (72 hours)
4. **Remediation**: Fix vulnerabilities
5. **Report**: Document lessons learned

### Partner Notification

Partners receive:
- Breach description
- Affected data types
- Impact assessment
- Remediation steps
- Support resources

## Best Practices

### For Partners

**Secure Integration**:
```javascript
// ✅ Good: Secure credential storage
const apiKey = process.env.SCA_API_KEY;

// ❌ Bad: Hardcoded credentials
const apiKey = "sca_live_xxxx";
```

**Data Minimization**:
```javascript
// ✅ Good: Request only needed data
const result = await client.scan({
  repository: 'owner/repo',
  fields: ['summary', 'critical_findings']
});

// ❌ Bad: Request everything
const result = await client.scan({
  repository: 'owner/repo',
  fields: ['*']
});
```

**User Consent**:
```javascript
// ✅ Good: Check consent before scanning
if (user.hasConsentedToScan()) {
  await client.scan(config);
}

// ❌ Bad: Scan without consent
await client.scan(config);
```

## Privacy by Design

We build privacy into our products:

- **Data Minimization**: Collect only what's needed
- **Purpose Limitation**: Use data only for stated purpose
- **Storage Limitation**: Delete when no longer needed
- **Access Controls**: Restrict access to authorized users
- **Encryption**: Protect data at rest and in transit
- **Transparency**: Clear privacy policies
- **User Control**: Easy access to privacy settings

## Subprocessors

We use these subprocessors:

| Service | Purpose | Location |
|---------|---------|----------|
| AWS | Infrastructure | US, EU |
| GitHub | Code hosting | Global |
| Datadog | Monitoring | US |
| Sentry | Error tracking | US |

Partners are notified of changes 30 days in advance.

## Contact

For privacy questions:

📧 **General**: privacy@cuberai.example  
📧 **DPA requests**: legal@cuberai.example  
📧 **Data requests**: data-requests@cuberai.example  
🔒 **Security**: security@cuberai.example

## Resources

- [Main Privacy Policy](../../PRIVACY.md)
- [Data Retention Policy](../../DATA_RETENTION.md)
- [Security Policy](../../SECURITY.md)
- DPA Template: Contact legal team

---

*Last updated: 2026-01-01*
