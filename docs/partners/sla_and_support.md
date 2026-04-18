---
title: SLA and Support
description: Service level agreements and support options for partners
keywords: SLA, support, uptime, response time, service level agreement
---

# SLA and Support

This document outlines service level agreements (SLAs) and support commitments for SmartContractAudit partners.

## Service Level Agreements

### Uptime Commitments

| Tier | Monthly Uptime | Downtime Allowance | Credits |
|------|---------------|-------------------|---------|
| Bronze | 99.0% | ~7.2 hours | 10% |
| Silver | 99.5% | ~3.6 hours | 25% |
| Gold | 99.9% | ~43 minutes | 50% |
| Platinum | 99.95% | ~21 minutes | 100% |

**Measured**: Based on API availability monitoring
**Exclusions**: Scheduled maintenance (with 7-day notice)
**Credits**: Applied to next billing cycle

### Response Time SLAs

#### Critical Issues
*Service completely unavailable, data loss, security breach*

| Tier | Acknowledgment | First Response | Resolution Target |
|------|---------------|----------------|------------------|
| Bronze | 4 hours | 8 hours | 24 hours |
| Silver | 2 hours | 4 hours | 12 hours |
| Gold | 1 hour | 2 hours | 8 hours |
| Platinum | 30 minutes | 1 hour | 4 hours |

#### High Priority
*Major functionality impaired, significant performance degradation*

| Tier | Acknowledgment | First Response | Resolution Target |
|------|---------------|----------------|------------------|
| Bronze | 8 hours | 1 business day | 3 business days |
| Silver | 4 hours | 12 hours | 2 business days |
| Gold | 2 hours | 4 hours | 1 business day |
| Platinum | 1 hour | 2 hours | 12 hours |

#### Medium Priority
*Partial functionality affected, workarounds available*

| Tier | Acknowledgment | First Response | Resolution Target |
|------|---------------|----------------|------------------|
| Bronze | 1 business day | 2 business days | 5 business days |
| Silver | 12 hours | 1 business day | 3 business days |
| Gold | 4 hours | 8 hours | 2 business days |
| Platinum | 2 hours | 4 hours | 1 business day |

#### Low Priority
*Minor issues, feature requests, questions*

| Tier | Acknowledgment | First Response | Resolution Target |
|------|---------------|----------------|------------------|
| Bronze | 2 business days | 3 business days | Best effort |
| Silver | 1 business day | 2 business days | 7 business days |
| Gold | 8 hours | 1 business day | 5 business days |
| Platinum | 4 hours | 8 hours | 3 business days |

**Business Hours**: Monday-Friday, 9 AM - 5 PM PT (except holidays)
**24/7 Coverage**: Platinum tier only (for critical issues)

### Performance SLAs

#### API Response Times (95th percentile)

| Tier | Scan Request | Result Retrieval | Other Endpoints |
|------|-------------|------------------|----------------|
| Bronze | < 5 seconds | < 2 seconds | < 1 second |
| Silver | < 3 seconds | < 1 second | < 500ms |
| Gold | < 2 seconds | < 500ms | < 250ms |
| Platinum | < 1 second | < 250ms | < 100ms |

#### Scan Completion Times

| Contract Size | Target Time | SLA |
|--------------|------------|-----|
| < 100 lines | 30 seconds | 2 minutes |
| 100-500 lines | 2 minutes | 5 minutes |
| 500-1000 lines | 5 minutes | 15 minutes |
| 1000-5000 lines | 15 minutes | 45 minutes |
| > 5000 lines | 60 minutes | 3 hours |

**Note**: Complex contracts may take longer; estimates provided during submission

## Support Channels

### Email Support

**Available to**: All tiers

**Email addresses**:
- General: support@cuberai.example
- Technical: technical-support@cuberai.example
- Security: security@cuberai.example

**Response times**: Per SLA table above

### Partner Portal

**Available to**: All tiers

**Features**:
- Ticket submission and tracking
- Knowledge base access
- Documentation
- API key management
- Usage dashboards
- Billing information

**URL**: https://partners.smartcontractaudit.example

### Chat Support

**Available to**: Silver tier and above

**Platforms**:
- Slack Connect (preferred)
- Discord (for open source partners)
- Microsoft Teams (enterprise)

**Hours**:
- Silver: Business hours
- Gold: Extended hours (6 AM - 8 PM PT)
- Platinum: 24/7

### Phone Support

**Available to**: Gold and Platinum tiers

**Numbers**:
- US: [To be provided]
- EU: [To be provided]
- APAC: [To be provided]

**Hours**:
- Gold: Business hours
- Platinum: 24/7 emergency hotline

### Dedicated Account Manager

**Available to**: Gold and Platinum tiers

**Responsibilities**:
- Strategic relationship management
- Quarterly business reviews
- Escalation point
- Roadmap discussions
- Success planning

**Contact**: Direct email and phone

### Technical Account Manager

**Available to**: Platinum tier

**Responsibilities**:
- Integration support
- Architecture guidance
- Performance optimization
- Custom development coordination
- Technical escalations

**Contact**: Direct access via Slack/Teams

## Support Scope

### Included Support

✅ **In Scope**:
- Product functionality questions
- API usage guidance
- Integration troubleshooting
- Bug reports and fixes
- Performance issues
- Security concerns
- Account management
- Billing questions

### Excluded Support

❌ **Out of Scope**:
- Custom development (billable)
- Third-party integrations (unless documented)
- Smart contract development advice
- General blockchain education
- Partner's internal infrastructure
- End-user support (partner's users)
- Code review (outside scanning)

**Note**: Out-of-scope items may be available as paid services

## Incident Management

### Severity Definitions

**Critical (P0)**:
- Complete service outage
- Data breach or loss
- Security vulnerability
- Affects all users

**High (P1)**:
- Major functionality unavailable
- Significant performance degradation
- Affects multiple partners
- Revenue impact

**Medium (P2)**:
- Partial functionality impaired
- Workarounds available
- Limited user impact
- Minor performance issues

**Low (P3)**:
- Cosmetic issues
- Feature requests
- Documentation errors
- Minor bugs

### Escalation Process

**Level 1**: Support Engineer
- Initial triage and troubleshooting
- Resolution of common issues
- Documentation of complex issues

**Level 2**: Senior Engineer
- Complex technical issues
- Integration problems
- Performance optimization
- Escalations from Level 1

**Level 3**: Engineering Team
- Product bugs
- Architecture issues
- Security concerns
- Code-level fixes

**Level 4**: Leadership
- Service outages
- Major incidents
- Business-critical issues
- Emergency escalations

### Partner Escalation

Partners can escalate via:

1. **Account Manager** (Gold/Platinum)
2. **Email**: escalations@cuberai.example
3. **Emergency Hotline** (Platinum, critical only)
4. **Partner Portal** (mark as urgent)

**When to escalate**:
- SLA at risk
- Inadequate response
- Business-critical impact
- Urgent security concerns

## Maintenance Windows

### Scheduled Maintenance

**Frequency**: Monthly (typically)
**Duration**: 1-4 hours
**Notice**: 7 days advance
**Window**: Sundays, 2-6 AM PT

**Communication**:
- Email notification
- Status page update
- In-app notification
- API headers (upcoming maintenance)

### Emergency Maintenance

**When**: Critical security or stability issues
**Notice**: As much as possible (minimum 2 hours)
**Duration**: Minimized
**Communication**: Real-time updates

### Zero-Downtime Deployments

Most updates deployed without downtime:
- Feature releases
- Bug fixes
- Performance improvements
- Minor updates

## Status and Monitoring

### Status Page

**URL**: https://status.smartcontractaudit.example

**Information**:
- Current system status
- Incident history
- Scheduled maintenance
- Performance metrics
- Subscribe for alerts

**Components Monitored**:
- API endpoints
- Web interface
- Scanning service
- Authentication service
- Webhook delivery

### Monitoring and Alerts

**Real-time Monitoring**:
- Uptime (1-minute intervals)
- Response times
- Error rates
- Queue depths
- Resource utilization

**Alerting**:
- Partners notified of issues affecting them
- Status page updates
- Email notifications
- Slack/Discord updates (if configured)

## Credits and Refunds

### Service Credits

**Calculation**:
```
Credit = (Monthly Fee / 30 / 24) × Hours Down
```

**Example**:
- Gold tier: $5,000/month
- Outage: 2 hours
- Credit: ($5,000 / 30 / 24) × 2 = $13.89

**Application**:
- Automatically calculated
- Applied to next invoice
- Must request within 30 days
- Maximum: 100% of monthly fee

### Refund Policy

**Pro-rated Refunds**:
- Annual plans: Unused months refunded
- Cancellation: 30-day notice required
- First month: Full refund if < 14 days

**No Refunds**:
- Service credits (in lieu of refunds)
- Monthly subscriptions
- Usage-based charges already incurred

## Support Best Practices

### For Partners

**Effective Support Requests**:
- Clear description of issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details
- Error messages/logs
- Impact assessment
- Urgency justification

**Example Good Request**:
```
Subject: [Critical] API 500 errors on scan submission

Description: Receiving consistent 500 errors when submitting 
scans via API since 2025-12-31 10:00 AM PT.

Impact: All production scans failing. ~50 customers affected.

Reproduction:
1. POST to /v1/scan
2. Sample payload: {...}
3. Response: 500 Internal Server Error

Environment:
- API Key: pk_test_EXAMPLE_NOT_A_REAL_KEY
- Endpoint: api.smartcontractaudit.example
- Request ID: req_xyz123

Urgency: Critical - production down, revenue impact
```

### Response Expectations

**What We Provide**:
- Acknowledgment within SLA
- Regular status updates
- Clear communication
- Root cause analysis (post-mortem)
- Prevention steps

**What We Need**:
- Accurate information
- Timely responses
- Testing cooperation
- Feedback on resolutions

## Training and Onboarding

### Included Training

**All Tiers**:
- Self-service documentation
- Video tutorials
- Webinar recordings

**Silver and Above**:
- Live onboarding session (1 hour)
- Q&A sessions (monthly)

**Gold and Above**:
- Custom training sessions (2/year)
- Dedicated onboarding (4 hours)
- Best practices workshop

**Platinum**:
- On-site training (2/year)
- Custom curriculum
- Executive briefings
- Ongoing education program

### Additional Training

**Available as Add-on**:
- Advanced technical training
- Security best practices
- Integration workshops
- Team enablement

**Pricing**: $2,000-$5,000 per day

## Feedback and Improvement

### Satisfaction Surveys

**After Each Ticket**:
- Resolution satisfaction
- Response time
- Support quality

**Quarterly**:
- Overall satisfaction
- Product feedback
- Feature requests
- Improvement suggestions

### Continuous Improvement

**We Use Feedback To**:
- Improve support processes
- Enhance documentation
- Prioritize features
- Train support team
- Refine SLAs

**Partner Advisory Board**:
- Quarterly meetings
- Gold and Platinum partners
- Product direction input
- Support policy feedback

## Contact

### Support Contacts

- **General Support**: support@cuberai.example
- **Technical**: technical-support@cuberai.example
- **Escalations**: escalations@cuberai.example
- **Account Management**: accounts@cuberai.example

### Emergency Contacts

- **Critical Issues**: [Phone number - Platinum only]
- **Security Incidents**: security@cuberai.example (monitored 24/7)
- **Status Page**: https://status.smartcontractaudit.example

---

*SLAs and support terms effective 2025-12-31. Subject to partnership agreement. For questions, contact your account manager or support@cuberai.example.*
