# SLA and Support

## Service Level Agreements

### Overview

This document outlines service level agreements (SLAs) and support commitments for SmartContractAudit partners.

**Note**: SLAs apply to paid partners at Gold tier and above. Community users receive best-effort support.

## Uptime SLA

### API Availability

**Target**: 99.9% uptime (monthly)

**Exclusions**:
- Scheduled maintenance (announced 7 days in advance)
- Force majeure events
- Third-party service failures
- User-caused issues

**Measurement**: Calculated monthly from our monitoring systems

**Credits** (for SLA violations):
- 99.5-99.9%: 10% monthly fee credit
- 99.0-99.5%: 25% monthly fee credit
- <99.0%: 50% monthly fee credit

**To Claim**: Email partners-support@cuberai.example with affected time period within 30 days

### Scheduled Maintenance

**Notification**: 7 days advance notice
**Frequency**: Monthly maximum
**Window**: Tuesday 2-4 AM UTC (2 hours max)
**Emergency**: Minimum 24 hours notice if possible

## Response Time SLA

### Support Ticket Response

| Severity | Bronze | Silver | Gold | Platinum | Custom |
|----------|---------|---------|-------|----------|---------|
| **Critical** | 2 days | 1 day | 4 hours | 1 hour | Custom |
| **High** | 5 days | 3 days | 1 day | 4 hours | Custom |
| **Medium** | 7 days | 5 days | 2 days | 1 day | Custom |
| **Low** | 10 days | 7 days | 5 days | 2 days | Custom |

**Business Hours**: Monday-Friday, 9 AM - 5 PM UTC (excluding holidays)

### Severity Definitions

**Critical**:
- Service completely unavailable
- Data loss or corruption
- Security breach
- Major functionality broken for all users

**High**:
- Major feature not working
- Significant performance degradation
- Security vulnerability (non-exploited)
- Affecting multiple users

**Medium**:
- Feature partially working
- Moderate performance issues
- Affecting individual users
- Workaround available

**Low**:
- Minor bugs
- Feature requests
- Documentation issues
- Cosmetic problems

## Resolution Time SLA

**Targets** (not guarantees):

| Severity | Target Resolution |
|----------|-------------------|
| **Critical** | 24 hours |
| **High** | 5 business days |
| **Medium** | 10 business days |
| **Low** | Best effort |

**Notes**:
- Complex issues may take longer
- Escalation available if targets missed
- Regular updates provided

## Support Channels

### By Partner Tier

**Bronze Sponsors**:
- GitHub Issues (public)
- GitHub Discussions
- Email (partners-support@cuberai.example)

**Silver Sponsors**:
- All Bronze channels
- Priority email support
- Community Slack/Discord

**Gold Sponsors**:
- All Silver channels
- Dedicated support channel
- Video call support (scheduled)

**Platinum Sponsors**:
- All Gold channels
- Dedicated Slack channel with core team
- On-call support (business hours)
- Annual on-site visit option

### Contact Methods

**Email**: partners-support@cuberai.example
- Include partner name, tier, and severity
- Attach logs, error messages, reproduction steps

**GitHub Issues**: [github.com/SolanaRemix/SmartContractAudit/issues](https://github.com/SolanaRemix/SmartContractAudit/issues)
- Use template
- Tag: `partner-support`
- Link to partnership

**Slack/Discord**: (Invited after partnership begins)
- Direct message or channel post
- @mention support team for urgent issues

**Emergency**: security@cuberai.example (security issues only)

## Support Scope

### Included Support

✅ **Covered**:
- Bug fixes and issue resolution
- API and integration questions
- Configuration assistance
- Feature usage guidance
- Performance optimization help
- Security vulnerability reports
- Documentation clarification

❌ **Not Covered** (available as custom services):
- Custom feature development
- On-site training (except Platinum annual)
- Code review of your implementations
- Architecture consulting
- Third-party integration debugging
- General development support

### Escalation Path

If issue not resolved within SLA:

1. **Email**: partners-support@cuberai.example with "ESCALATION" in subject
2. **Include**: Original ticket number, timeline, impact
3. **Escalation Review**: Within 4 hours (business hours)
4. **Executive Contact**: If still unresolved, escalate to funding@cuberai.example

## Performance SLA

### API Performance

**Target Response Times** (95th percentile):

- Scan initiation: <2 seconds
- Status check: <500ms
- Results retrieval: <3 seconds
- Report generation: <10 seconds

**Throughput**:
- Minimum 100 requests/minute per partner
- Higher limits available (contact us)

### Rate Limits

**Default Limits**:

| Tier | Requests/Hour | Concurrent Scans |
|------|---------------|------------------|
| Bronze | 100 | 2 |
| Silver | 500 | 5 |
| Gold | 2,000 | 10 |
| Platinum | 10,000 | 25 |
| Custom | Custom | Custom |

**Exceeding Limits**:
- HTTP 429 (Too Many Requests)
- Retry-After header provided
- Contact us to increase limits

## Data SLA

### Backup and Recovery

**Backups**:
- Daily automated backups
- 30-day retention
- Encrypted storage
- Geographically distributed

**Recovery**:
- RPO (Recovery Point Objective): 24 hours
- RTO (Recovery Time Objective): 4 hours

### Data Retention

**Active Data**: Duration of partnership + 30 days  
**Backups**: 30 days rolling  
**Logs**: 90 days  
**Aggregate Analytics**: Indefinitely (anonymized)

See [DATA_RETENTION.md](/DATA_RETENTION.md) for details.

## Security SLA

### Vulnerability Response

| Severity | Response | Patch Target |
|----------|----------|--------------|
| **Critical** | 4 hours | 7 days |
| **High** | 1 day | 14 days |
| **Medium** | 3 days | 30 days |
| **Low** | 5 days | 60 days |

**Notification**:
- Partners notified within response time
- Security advisory published after patch
- Coordinated disclosure process

### Security Updates

- Zero-day vulnerabilities: Immediate notification
- Dependency updates: Monthly
- Security patches: As needed
- Annual security audit results shared with Platinum partners

## Maintenance Windows

### Planned Maintenance

**Advance Notice**: 7 days minimum  
**Frequency**: Once per month maximum  
**Duration**: 2 hours maximum  
**Time**: Tuesday 2-4 AM UTC (lowest traffic)

**Communication**:
1. Email to all partners (7 days before)
2. Status page update (7 days before)
3. Reminder (24 hours before)
4. Start notification
5. Completion notification

### Emergency Maintenance

**Notice**: 24 hours when possible, less if critical security issue  
**Duration**: As short as possible  
**Communication**: Immediate notification via all channels

## Monitoring and Status

### Public Status Page

**URL**: [status.smartcontractaudit.example](#)

**Shows**:
- Current system status
- Planned maintenance
- Incident history
- Performance metrics
- Uptime statistics

**Subscribe**: Email or RSS feed for notifications

### Partner Dashboard

Gold and Platinum partners get access to:
- Real-time API metrics
- Usage statistics
- Error rates
- Performance graphs
- Historical data

## Feedback and Improvement

### Quarterly Business Reviews

**Gold and Platinum Partners**:
- Scheduled quarterly call
- Review metrics and SLA performance
- Discuss feature requests
- Gather feedback
- Plan ahead

### Support Satisfaction

We measure:
- Response time compliance
- Resolution time
- Partner satisfaction (surveys)
- Issue recurrence

**Goal**: >90% satisfaction rating

## Dispute Resolution

### Process

1. **Informal Resolution**: Contact your partner liaison or partners-support@cuberai.example
2. **Formal Review**: If unresolved, escalate to funding@cuberai.example
3. **Executive Review**: CTO and partner executive discuss
4. **Mediation**: Third-party mediation if needed (costs shared)
5. **Arbitration**: Binding arbitration per partnership agreement

**Timeline**: Good faith effort to resolve within 30 days

### SLA Credit Disputes

1. **Submit Claim**: partners-support@cuberai.example within 30 days
2. **Provide Evidence**: Logs, timestamps, impact description
3. **Review**: We investigate within 10 business days
4. **Decision**: Credit issued or denial with explanation
5. **Appeal**: To funding@cuberai.example if disputed

## Termination

### SLA Upon Termination

**30-Day Wind-Down**:
- Support continues for 30 days
- Data export assistance provided
- Migration support available
- Final invoicing and credits

**Immediate Termination** (for cause):
- Support ends immediately
- Data export provided (if compliant with terms)
- No refunds
- Credits void

## Exceptions and Force Majeure

SLAs don't apply during:

- Acts of God (natural disasters)
- War, terrorism, civil unrest
- Government actions or regulations
- Internet backbone failures
- Third-party service failures (beyond our control)
- Cyber attacks (while being mitigated)
- Partner-caused issues

**Notification**: We'll communicate cause and expected resolution

## Contact

**Support**: partners-support@cuberai.example  
**Escalation**: funding@cuberai.example  
**Emergency**: security@cuberai.example  
**Billing**: funding@cuberai.example

**Phone**: (Available for Platinum partners upon request)

---

**Last Updated**: 2026-01-01  
**SLA Version**: 1.0  
**Review Cycle**: Quarterly  
**Next Review**: 2026-04-01
