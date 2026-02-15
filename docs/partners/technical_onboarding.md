---
title: Technical Onboarding
description: Getting started with SmartContractAudit integration
keywords: onboarding, integration, API, setup, technical, development
---

# Technical Onboarding

This guide helps partners integrate SmartContractAudit into their workflows, platforms, and products.

## Prerequisites

Before starting, ensure you have:

- [ ] Partnership agreement signed
- [ ] Account credentials received
- [ ] API keys generated (if applicable)
- [ ] Access to partner portal
- [ ] Technical point of contact designated

## Quick Start

### 1. Access Setup

**Partner Portal**: https://partners.smartcontractaudit.example

1. Log in with provided credentials
2. Generate API keys
3. Configure webhooks (optional)
4. Set up team access

### 2. Environment Setup

```bash
# Install CLI tool
npm install -g @smartcontractaudit/cli

# Authenticate
smartcontractaudit login --api-key YOUR_API_KEY

# Verify connection
smartcontractaudit status
```

### 3. First Scan

```bash
# Scan a smart contract
smartcontractaudit scan ./contracts/Token.sol

# View results
smartcontractaudit results --latest
```

## Integration Paths

### Path A: CI/CD Integration

**Ideal for**: Automated scanning in development pipeline

**Steps**:

1. **Add GitHub Action** (or equivalent):

```yaml
# .github/workflows/security-scan.yml
name: Smart Contract Security Scan

on:
  pull_request:
    paths:
      - 'contracts/**'
  push:
    branches:
      - main

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: SmartContractAudit Scan
        uses: smartcontractaudit/scan-action@v1
        with:
          api-key: ${{ secrets.SCA_API_KEY }}
          path: './contracts'
          fail-on: 'high'
          
      - name: Upload Results
        uses: actions/upload-artifact@v3
        with:
          name: audit-report
          path: audit-report.md
```

2. **Configure secrets** in repository settings

3. **Test workflow** with a PR

**Supported CI/CD Platforms**:
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI
- Travis CI
- Azure DevOps
- Bitbucket Pipelines

### Path B: API Integration

**Ideal for**: Custom tools, platforms, and services

**API Endpoint**: `https://api.smartcontractaudit.example/v1`

**Authentication**: Bearer token in Authorization header

**Example Request**:

```bash
curl -X POST https://api.smartcontractaudit.example/v1/scan \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "source_code": "contract Token { ... }",
    "language": "solidity",
    "options": {
      "severity_threshold": "medium",
      "dry_run": false
    }
  }'
```

**Response**:

```json
{
  "scan_id": "scan_abc123",
  "status": "completed",
  "findings": [
    {
      "id": "finding_001",
      "severity": "high",
      "type": "reentrancy",
      "location": "Token.sol:45",
      "description": "Potential reentrancy vulnerability",
      "recommendation": "Use ReentrancyGuard pattern"
    }
  ],
  "summary": {
    "high": 1,
    "medium": 3,
    "low": 5
  }
}
```

**API Documentation**: [Full API docs to be provided]

### Path C: Web Interface Embed

**Ideal for**: Embedding audit functionality in web apps

**Widget Code**:

```html
<script src="https://cdn.smartcontractaudit.example/widget.js"></script>
<div id="sca-widget" data-api-key="YOUR_API_KEY"></div>
<script>
  SmartContractAudit.init({
    element: '#sca-widget',
    apiKey: 'YOUR_API_KEY',
    theme: 'dark'
  });
</script>
```

**Configuration Options**:
- Theme (light/dark)
- Language support
- Severity filters
- Custom branding (enterprise)

### Path D: CLI Integration

**Ideal for**: Developer tools, local development

**Installation**:

```bash
npm install -g @smartcontractaudit/cli
# or
pip install smartcontractaudit-cli
# or
brew install smartcontractaudit
```

**Usage**:

```bash
# Scan contracts
sca scan ./contracts

# Watch for changes
sca watch ./contracts

# Generate report
sca report --format pdf --output audit.pdf

# Configure
sca config set api-key YOUR_KEY
sca config set severity-threshold high
```

### Path E: IDE Plugin

**Ideal for**: Real-time feedback during development

**Supported IDEs**:
- VS Code
- IntelliJ IDEA
- Vim/Neovim
- Sublime Text

**VS Code Example**:

1. Install extension: "SmartContractAudit"
2. Configure API key in settings
3. Open `.sol` file
4. Automatic scanning on save
5. Inline warnings and suggestions

## Configuration

### API Keys

**Generation**:
1. Log in to partner portal
2. Navigate to API Keys
3. Create new key with appropriate scope
4. Store securely (never commit to code)

**Key Types**:
- **Read-only**: View reports, no scanning
- **Scan**: Perform scans, view results
- **Admin**: Full account access

**Security Best Practices**:
- Rotate keys every 90 days
- Use environment variables
- Separate keys per environment
- Monitor usage for anomalies

### Webhooks

**Setup**:
1. Configure webhook URL in partner portal
2. Choose events to receive:
   - `scan.completed`
   - `scan.failed`
   - `finding.critical`
   - `report.generated`

3. Verify webhook signature

**Webhook Payload Example**:

```json
{
  "event": "scan.completed",
  "timestamp": "2025-12-31T12:00:00Z",
  "data": {
    "scan_id": "scan_abc123",
    "status": "completed",
    "findings_count": {
      "high": 1,
      "medium": 3,
      "low": 5
    },
    "report_url": "https://api.../reports/scan_abc123"
  },
  "signature": "sha256=..."
}
```

**Signature Verification**:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}
```

## Testing

### Sandbox Environment

**Endpoint**: `https://sandbox.smartcontractaudit.example`

**Characteristics**:
- Free for partners
- No rate limits
- Test data only
- Identical API to production

**Usage**:

```bash
# Set environment
export SCA_ENV=sandbox
export SCA_API_KEY=sandbox_key_...

# Run tests
npm test
```

### Test Contracts

Sample contracts provided for testing:

```bash
# Clone test repository
git clone https://github.com/SmartContractAudit/test-contracts.git

# Scan test contracts
sca scan test-contracts/vulnerable/
sca scan test-contracts/secure/
```

**Test Scenarios**:
- Reentrancy vulnerabilities
- Integer overflow/underflow
- Access control issues
- Unprotected self-destruct
- Delegatecall issues

## Rate Limits

### By Tier

| Tier | Scans/day | API Calls/min | Concurrent Scans |
|------|-----------|---------------|------------------|
| Bronze | 100 | 10 | 2 |
| Silver | 500 | 30 | 5 |
| Gold | 2,000 | 100 | 10 |
| Platinum | 10,000 | 500 | 50 |
| Custom | Custom | Custom | Custom |

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1672531200
```

### Handling Rate Limits

```javascript
async function scanWithRetry(contract, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await scan(contract);
    } catch (error) {
      if (error.status === 429) {
        const resetTime = error.headers['x-ratelimit-reset'];
        const waitTime = resetTime - Date.now()/1000;
        await sleep(waitTime * 1000);
      } else {
        throw error;
      }
    }
  }
}
```

## Support During Onboarding

### Dedicated Support

Partners receive:

- **Kick-off call**: 60-minute technical overview
- **Slack/Discord channel**: Direct access to engineering team
- **Documentation**: Private technical docs
- **Code reviews**: Review of integration code
- **Pair programming**: Available for complex integrations

### Timeline

Typical onboarding timeline:

| Week | Activity |
|------|----------|
| 1 | Account setup, API key generation, kick-off call |
| 2 | Development environment setup, first test scan |
| 3 | Integration development, testing |
| 4 | Staging deployment, validation |
| 5 | Production deployment, monitoring |
| 6 | Optimization, training, go-live |

### Checkpoints

- [ ] Week 1: Kick-off completed, access granted
- [ ] Week 2: First successful test scan
- [ ] Week 3: Integration code reviewed
- [ ] Week 4: Staging tests passing
- [ ] Week 5: Production deployment
- [ ] Week 6: Go-live and monitoring

## Monitoring and Observability

### Dashboards

Partners have access to:

- **Usage Dashboard**: API calls, scans, quota
- **Performance Metrics**: Response times, success rates
- **Security Dashboard**: Findings trends, severity distribution
- **Billing Dashboard**: Usage-based billing details

### Alerts

Configure alerts for:

- High-severity findings
- API errors or downtime
- Rate limit warnings
- Unusual activity patterns
- Integration failures

### Logs

Access to:

- API request logs (30-day retention)
- Scan history
- Webhook delivery logs
- Error logs and stack traces

## Troubleshooting

### Common Issues

**Authentication Errors**:
```
Error: 401 Unauthorized
Solution: Verify API key is correct and not expired
```

**Rate Limit Exceeded**:
```
Error: 429 Too Many Requests
Solution: Implement exponential backoff, upgrade tier
```

**Scan Timeouts**:
```
Error: 504 Gateway Timeout
Solution: Break large contracts into smaller chunks
```

### Debug Mode

Enable verbose logging:

```bash
# CLI
sca scan --debug ./contracts

# API
curl ... -H "X-Debug: true"
```

### Support Channels

- **Slack/Discord**: Real-time help during onboarding
- **Email**: technical-support@cuberai.example
- **Portal**: Submit tickets with priority queue
- **Office Hours**: Weekly Q&A sessions for partners

## Best Practices

### Security

- Never commit API keys to repositories
- Use environment variables or secret management
- Rotate keys regularly
- Monitor usage for anomalies
- Enable IP whitelisting (enterprise)

### Performance

- Cache scan results where appropriate
- Use webhooks instead of polling
- Batch similar scans
- Implement exponential backoff for retries
- Monitor rate limits proactively

### Integration Quality

- Handle all error cases gracefully
- Provide clear feedback to users
- Log errors for debugging
- Test in sandbox first
- Validate before production deployment

## Next Steps

After technical onboarding:

1. **Production Deployment**: Move from sandbox to production
2. **Training**: Schedule team training sessions
3. **Marketing**: Plan co-marketing announcements
4. **Feedback**: Provide integration feedback
5. **Optimization**: Iterate based on usage patterns

## Resources

- **API Documentation**: [Link to be provided]
- **SDK Libraries**: GitHub repositories
- **Sample Code**: Integration examples
- **Video Tutorials**: Onboarding videos
- **Changelog**: API and feature updates

## Contact

Technical onboarding questions:

- **Email**: technical-onboarding@cuberai.example
- **Slack**: #partner-onboarding channel
- **Schedule**: [Calendar link for technical calls]

---

*Technical documentation updated regularly. Check partner portal for latest API versions and features.*
