---
title: SLA and Support
description: Service level agreements and support options for partners
keywords: SLA, support, uptime, response time
---

# SLA and Support

## Service Level Agreements

### Uptime Guarantee

**API Availability**:
- **Standard**: 99.5% uptime
- **Premium**: 99.9% uptime
- **Enterprise**: 99.95% uptime

**Calculation**: Monthly uptime excluding scheduled maintenance

**Credits**: If SLA not met:
- 99.0-99.5%: 10% credit
- 98.0-99.0%: 25% credit
- <98.0%: 50% credit

### Performance

**API Response Times** (p95):
- Scan initiation: <500ms
- Status check: <200ms
- Results retrieval: <1s

**Scan Completion**:
- Small repos (<100 files): <5 minutes
- Medium repos (100-1000 files): <15 minutes
- Large repos (>1000 files): <60 minutes

## Support Tiers

### Community Support (Free)

**Channels**:
- GitHub Issues
- Community Forum
- Documentation

**Response Time**:
- Best effort
- Community-driven
- No SLA

**Coverage**:
- Monday-Friday
- Business hours
- Public issues only

### Standard Support (Included)

**Channels**:
- Email support
- GitHub Issues (priority)
- Monthly office hours

**Response Times**:
| Severity | First Response | Resolution Target |
|----------|---------------|-------------------|
| Critical | 4 business hours | 48 hours |
| High | 8 business hours | 5 business days |
| Medium | 1 business day | 10 business days |
| Low | 2 business days | Best effort |

**Coverage**:
- Monday-Friday
- 9 AM - 5 PM EST
- Email and tickets

### Premium Support (Add-on)

**Channels**:
- Priority email
- Dedicated Slack channel
- Phone support
- Video calls

**Response Times**:
| Severity | First Response | Resolution Target |
|----------|---------------|-------------------|
| Critical | 1 hour | 24 hours |
| High | 4 hours | 48 hours |
| Medium | 8 hours | 5 business days |
| Low | 1 business day | 10 business days |

**Coverage**:
- Monday-Friday
- 6 AM - 8 PM EST
- Email, phone, Slack

### Enterprise Support (Custom)

**Channels**:
- All Premium channels
- Dedicated account manager
- Direct engineer access
- Emergency hotline

**Response Times**:
| Severity | First Response | Resolution Target |
|----------|---------------|-------------------|
| Critical | 15 minutes | 4 hours |
| High | 1 hour | 12 hours |
| Medium | 4 hours | 2 business days |
| Low | 8 hours | 5 business days |

**Coverage**:
- 24/7/365 for Critical
- Extended hours for others
- All channels available

## Severity Levels

### Critical (P0)

**Definition**: Complete service outage or security vulnerability

**Examples**:
- API completely down
- Data breach
- Critical security flaw
- All scans failing

**Requirements**:
- Business completely blocked
- No workaround available
- Immediate attention needed

### High (P1)

**Definition**: Major functionality impaired

**Examples**:
- API degraded performance
- Scan failures for specific repos
- Integration broken
- Critical feature not working

**Requirements**:
- Core functionality affected
- Limited or difficult workaround
- Significant impact

### Medium (P2)

**Definition**: Moderate impact, workaround available

**Examples**:
- Non-critical feature issue
- Performance degradation
- Intermittent errors
- Configuration issues

**Requirements**:
- Workaround available
- Moderate impact
- Not blocking

### Low (P3)

**Definition**: Minor issue or question

**Examples**:
- Documentation unclear
- Feature requests
- General questions
- Minor bugs

**Requirements**:
- Minimal impact
- Easy workaround
- Can wait for resolution

## Support Channels

### Email Support

**Address**: support@cuberai.example  
**Best for**: Non-urgent issues, detailed questions  
**Include**: Account ID, error messages, reproduction steps

### GitHub Issues

**Repository**: github.com/SolanaRemix/SmartContractAudit/issues  
**Best for**: Bug reports, feature requests  
**Label**: Use partner label for priority

### Slack Channel

**Available**: Premium+ tiers  
**Best for**: Quick questions, real-time discussion  
**Hours**: Based on support tier

### Phone Support

**Available**: Premium+ tiers  
**Best for**: Critical issues, urgent matters  
**Number**: Provided upon enrollment

### Video Calls

**Available**: Gold+ sponsors, Premium+ support  
**Best for**: Complex integrations, training  
**Schedule**: Via calendar link

## Scheduled Maintenance

**Frequency**: Monthly (first Sunday)  
**Duration**: 1-2 hours  
**Notice**: 7 days advance  
**Window**: 2 AM - 4 AM EST

**Emergency Maintenance**:
- Announced 1 hour before (if possible)
- Critical security patches
- Immediate fixes only

## Status & Monitoring

**Status Page**: status.smartcontractaudit.io

**Subscriptions**:
- Email notifications
- SMS alerts (Premium+)
- Webhook notifications
- RSS feed

**Metrics**:
- API uptime
- Response times
- Scan queue depth
- Incident history

## Escalation

### Standard Escalation Path

1. **Tier 1**: Support engineer (immediate)
2. **Tier 2**: Senior engineer (if unresolved in SLA)
3. **Tier 3**: Engineering lead (critical issues)
4. **Tier 4**: CTO/Leadership (business impact)

### Emergency Escalation

For critical issues:
- **Immediate**: Email emergency@cuberai.example
- **Phone**: Emergency hotline (Enterprise tier)
- **Automatic**: P0 tickets auto-escalate after 15 min

## Best Practices

### Reporting Issues

**Good Issue Report**:
```
Title: API returns 500 error on scan initiation

Severity: High
Account ID: partner_1234
Environment: Production

Description:
When initiating scans for repositories with >500 files,
API returns 500 Internal Server Error.

Reproduction:
1. POST /v1/scan with repository "large-repo"
2. Observe 500 response
3. Scan never starts

Expected: Scan should initiate successfully
Actual: 500 error received

Error message: "Internal Server Error"
Request ID: req_abc123
Timestamp: 2026-01-01T12:00:00Z

Impact: Cannot scan large repositories
Workaround: None found
```

### Effective Communication

- Be specific and detailed
- Include error messages
- Provide request IDs
- Share reproduction steps
- Indicate business impact
- Suggest workarounds tried

## SLA Credits

### Eligibility

Credits issued when:
- Uptime falls below guarantee
- Response time exceeds SLA
- Resolution target missed

### Calculation

```
Credit = (Guaranteed % - Actual %) × Monthly Fee
```

### Requesting Credits

1. Submit claim within 30 days
2. Include incident references
3. Provide impact documentation
4. Receive credit next billing cycle

**Maximum**: 50% of monthly fee

## Resources

- Status Page: [Link]
- Knowledge Base: [Link]
- API Documentation: [Link]
- Community Forum: [Link]

## Contact

**General Support**: support@cuberai.example  
**Account Issues**: accounts@cuberai.example  
**Emergency**: emergency@cuberai.example  
**Sales**: partnerships@cuberai.example

---

*Last updated: 2026-01-01*
