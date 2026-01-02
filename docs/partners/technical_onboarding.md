---
title: Technical Onboarding
<<<<<<< HEAD
description: Get started with SmartContractAudit integration
keywords: onboarding, integration, setup, technical documentation
---

# Technical Onboarding Guide

Welcome! This guide will help you integrate SmartContractAudit into your development workflow.

## Quick Start

### 1. Prerequisites

- Git version 2.x+
- Node.js 20+ (for JavaScript tools)
- GitHub account
- Basic command-line knowledge

### 2. Repository Access

**Public Repository**: https://github.com/SolanaRemix/SmartContractAudit

```bash
# Clone the repository
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit
```

### 3. Basic Setup

```bash
# Review the README
cat README.md

# Check available scripts
ls -la scripts/

# Review configuration examples
cat .env.example
```

## Integration Options

### Option 1: GitHub Actions Workflow

Add SmartContractAudit to your CI/CD:

```yaml
# .github/workflows/security-audit.yml
name: Smart Contract Audit

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run SmartContractAudit
        run: |
          curl -sSL https://raw.githubusercontent.com/SolanaRemix/SmartContractAudit/main/scripts/audit.sh | bash
```

**Features**:
- Automated auditing on every PR
- Results posted as PR comments
- Artifacts uploaded for review
- Dry-run mode by default

### Option 2: Pre-commit Hook

Run checks before committing:

```bash
# Install pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
./scripts/audit.sh --fast
EOF

chmod +x .git/hooks/pre-commit
```

### Option 3: Manual Command Line

Run audits manually:

```bash
# Basic audit
./scripts/audit.sh

# With specific options
./scripts/master.sh scan --dry-run
```

### Option 4: API Integration (Enterprise)

For enterprise partners with API access:

```javascript
const { SmartContractAudit } = require('@smartcontractaudit/sdk');

const audit = new SmartContractAudit({
  apiKey: process.env.SCAUDIT_API_KEY
});

const results = await audit.scan({
  repository: 'owner/repo',
  branch: 'main'
});
```

**Note**: API access requires Silver tier or higher.

## Configuration

### Environment Variables

Create a `.env` file:

```bash
# Dry-run mode (recommended for initial setup)
DRY_RUN=true

# Bot pings (disable for quiet mode)
BOT_PINGS_ENABLED=false

# Organization allowlist (empty = restrictive)
ALLOWLIST_ORGS=""

# Maximum PRs per run
MAX_PRS_PER_RUN=3

# GitHub token (optional, for private repos)
# GITHUB_TOKEN=your_token_here
```

### Configuration File

Create `config/audit.json`:

```json
{
  "enabled": true,
  "dry_run": true,
  "scan_patterns": [
    "**/*.sol",
    "**/*.rs",
    "**/*.move"
  ],
  "exclude_patterns": [
    "node_modules/**",
    "test/**",
    ".git/**"
  ],
  "severity_threshold": "medium",
  "auto_fix": false
}
```

## Workflow Examples

### Example 1: DeFi Protocol

**Use Case**: Audit Solidity contracts before deployment

```yaml
name: Contract Audit

on:
  push:
    paths:
      - 'contracts/**/*.sol'

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Audit Contracts
        run: ./scripts/audit.sh contracts/
        
      - name: Check Results
        run: |
          if [ -f AUDIT-REPORT.md ]; then
            cat AUDIT-REPORT.md
          fi
```

### Example 2: Multi-Chain Project

**Use Case**: Audit contracts across multiple blockchains

```yaml
jobs:
  audit-solana:
    steps:
      - name: Audit Solana Contracts
        run: ./scripts/audit.sh --chain solana programs/
        
  audit-ethereum:
    steps:
      - name: Audit Ethereum Contracts
        run: ./scripts/audit.sh --chain ethereum contracts/
```

### Example 3: Continuous Monitoring

**Use Case**: Daily automated audits

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  scheduled-audit:
    steps:
      - name: Full Audit
        run: ./scripts/master.sh scan --full
```

## Security Best Practices

### 1. Secrets Management

**Never commit secrets**:

```bash
# Use GitHub Secrets for sensitive data
# Access in workflow:
env:
  API_KEY: ${{ secrets.API_KEY }}
```

### 2. Dry-Run First

**Always test in dry-run mode**:

```bash
# Test without making changes
DRY_RUN=true ./scripts/master.sh scan
```

### 3. Review Before Deploy

**Manual review of findings**:

```bash
# Generate report
./scripts/audit.sh > audit-report.txt

# Review findings
cat audit-report.txt

# Address issues before proceeding
```

### 4. Least Privilege

**Minimal permissions in workflows**:

```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

## Testing Your Integration

### 1. Validate Configuration

```bash
# Check configuration
./scripts/audit.sh --validate-config

# Test dry-run mode
DRY_RUN=true ./scripts/audit.sh
```

### 2. Test with Sample Contracts

```bash
# Use test contracts
./scripts/audit.sh test/contracts/

# Verify results
ls -la AUDIT-REPORT.md
```

### 3. Verify CI/CD Integration

```bash
# Create test PR
git checkout -b test-audit
git commit --allow-empty -m "Test audit workflow"
git push origin test-audit

# Check GitHub Actions for workflow run
```
=======
description: Get started with SmartContractAudit technical integration
keywords: onboarding, integration, API, setup
---

# Technical Onboarding

## Welcome

This guide walks you through the technical onboarding process for SmartContractAudit partners.

## Prerequisites

Before starting:
- ✅ Partnership agreement signed
- ✅ Technical contact identified
- ✅ GitHub organization ready
- ✅ Development environment prepared
- ✅ Integration plan reviewed

## Onboarding Steps

### Step 1: Access Setup (Day 1)

**API Credentials**
```bash
# You'll receive:
API_KEY=sca_live_xxxx
API_SECRET=xxxx
PARTNER_ID=partner_xxxx
```

**GitHub Access**
- Added to partner GitHub team
- Access to private repositories
- CI/CD integration examples
- Technical documentation

**Development Environment**
- Staging API endpoint
- Testing webhooks
- Sample data
- Debug tools

### Step 2: Integration Planning (Week 1)

**Architecture Review**
- Review your architecture
- Identify integration points
- Plan API usage
- Design data flow

**Technical Kickoff**
- Meet engineering teams
- Review documentation
- Discuss timeline
- Set milestones

**Environment Setup**
```bash
# Install SDK
npm install @smartcontractaudit/sdk

# Configure
export SCA_API_KEY=your_key
export SCA_ENV=staging
```

### Step 3: Development (Week 2-3)

**Basic Integration**
```javascript
const SCA = require('@smartcontractaudit/sdk');

const client = new SCA({
  apiKey: process.env.SCA_API_KEY,
  environment: 'staging'
});

// Scan a repository
const result = await client.scan({
  repository: 'owner/repo',
  branch: 'main',
  options: {
    deepScan: true,
    includeTests: true
  }
});

console.log('Scan complete:', result.summary);
```

**Webhook Setup**
```javascript
// Receive scan results
app.post('/webhooks/sca', (req, res) => {
  const event = req.body;
  
  // Verify signature
  if (!SCA.verifyWebhook(req.headers, req.body)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Handle event
  switch (event.type) {
    case 'scan.completed':
      handleScanComplete(event.data);
      break;
    case 'vulnerability.found':
      handleVulnerability(event.data);
      break;
  }
  
  res.status(200).send('OK');
});
```

**Error Handling**
```javascript
try {
  const result = await client.scan(config);
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Handle rate limit
    await wait(error.retryAfter);
  } else if (error.code === 'INVALID_CONFIG') {
    // Fix configuration
    console.error('Config error:', error.message);
  } else {
    // Other errors
    console.error('Scan failed:', error);
  }
}
```

### Step 4: Testing (Week 3-4)

**Unit Tests**
```javascript
describe('SmartContractAudit Integration', () => {
  it('should scan repository successfully', async () => {
    const result = await client.scan({
      repository: 'test/sample'
    });
    
    expect(result.status).toBe('completed');
    expect(result.findings).toBeDefined();
  });
  
  it('should handle scan errors', async () => {
    await expect(
      client.scan({ repository: 'invalid' })
    ).rejects.toThrow('Repository not found');
  });
});
```

**Integration Tests**
- Test with sample repositories
- Verify webhook delivery
- Test error scenarios
- Load testing
- Security testing

**Staging Validation**
- Full end-to-end tests
- Performance benchmarks
- Security review
- UX validation

### Step 5: Launch Preparation (Week 4)

**Production Setup**
```bash
# Production credentials
API_KEY=sca_live_prod_xxxx
API_ENDPOINT=https://api.smartcontractaudit.io/v1
```

**Monitoring Setup**
- Configure alerts
- Set up dashboards
- Error tracking
- Performance monitoring

**Documentation**
- Update user docs
- Create integration guide
- Prepare support materials
- Train support team

**Launch Checklist**
- [ ] Production credentials configured
- [ ] All tests passing
- [ ] Monitoring active
- [ ] Documentation complete
- [ ] Support team trained
- [ ] Rollback plan ready
- [ ] Go-live approved

### Step 6: Go Live (Week 5)

**Deployment**
- Deploy to production
- Enable features gradually
- Monitor closely
- Gather feedback

**Support Activation**
- Support team on standby
- Escalation path clear
- Known issues documented
- FAQ updated

**Announcement**
- Press release (if applicable)
- Blog post
- Social media
- Email announcement

## API Reference

### Authentication

```bash
# API Key Authentication
curl -H "Authorization: Bearer $API_KEY" \
  https://api.smartcontractaudit.io/v1/scan
```

### Scanning

**Start Scan**
```bash
POST /v1/scan
{
  "repository": "owner/repo",
  "branch": "main",
  "options": {
    "deepScan": true,
    "rules": ["security", "best-practices"]
  }
}
```

**Get Results**
```bash
GET /v1/scan/:scanId
```

**List Scans**
```bash
GET /v1/scans?repository=owner/repo&limit=10
```

### Webhooks

**Subscribe**
```bash
POST /v1/webhooks
{
  "url": "https://your-app.com/webhooks/sca",
  "events": ["scan.completed", "vulnerability.found"]
}
```

**Event Types**
- `scan.started`
- `scan.completed`
- `scan.failed`
- `vulnerability.found`
- `vulnerability.fixed`

## SDKs & Libraries

### Official SDKs
- **Node.js**: `npm install @smartcontractaudit/sdk`
- **Python**: `pip install smartcontractaudit`
- **Go**: `go get github.com/smartcontractaudit/go-sdk`
- **Rust**: `cargo add smartcontractaudit`

### Community SDKs
- Ruby, PHP, Java (community-maintained)
- Check GitHub for latest

## Rate Limits

### Standard Limits
- **Free tier**: 100 scans/month
- **Partner tier**: 1,000 scans/month
- **Enterprise**: Custom limits

### Rate Limit Headers
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200
```

### Handling Rate Limits
```javascript
if (response.status === 429) {
  const retryAfter = response.headers['retry-after'];
  await sleep(retryAfter * 1000);
  // Retry request
}
```

## Best Practices

### Performance
- Cache results when possible
- Use webhooks instead of polling
- Batch requests when available
- Implement exponential backoff

### Security
- Store API keys securely
- Use environment variables
- Verify webhook signatures
- Implement HTTPS only
- Rotate keys regularly

### Reliability
- Implement retry logic
- Handle errors gracefully
- Monitor API health
- Set up alerting
- Plan for downtime
>>>>>>> origin/pr9

## Troubleshooting

### Common Issues

<<<<<<< HEAD
**Issue**: Script permission denied
```bash
# Solution: Make scripts executable
chmod +x scripts/*.sh
```

**Issue**: Missing dependencies
```bash
# Solution: Install required tools
npm install   # If using Node.js tools
```

**Issue**: API rate limits
```bash
# Solution: Add GitHub token
export GITHUB_TOKEN=your_token
```

**Issue**: False positives
```bash
# Solution: Configure exclusions
# Add to config/audit.json:
{
  "exclude_patterns": ["path/to/exclude/**"]
}
```

### Getting Help

- **Documentation**: Check /docs directory
- **GitHub Issues**: Report problems
- **Partner Support**: Email support@cuberai.example (partners only)
- **Community**: GitHub Discussions

## Advanced Configuration

### Custom Scanning Rules

Create `config/custom-rules.json`:

```json
{
  "rules": [
    {
      "id": "no-hardcoded-addresses",
      "pattern": "0x[a-fA-F0-9]{40}",
      "severity": "high",
      "message": "Hardcoded address detected"
    }
  ]
}
```

### Integration with Other Tools

**Combine with existing security tools**:

```yaml
- name: Run Slither
  run: slither .
  
- name: Run SmartContractAudit
  run: ./scripts/audit.sh
  
- name: Run Custom Checks
  run: npm run security-check
```

## Performance Optimization

### For Large Repositories

```bash
# Scan specific paths only
./scripts/audit.sh contracts/

# Use parallel scanning (if supported)
PARALLEL=true ./scripts/audit.sh

# Cache results
CACHE_ENABLED=true ./scripts/audit.sh
```

### For CI/CD

```yaml
# Cache dependencies
- uses: actions/cache@v3
  with:
    path: ~/.cache
    key: audit-cache-${{ hashFiles('**/*.sol') }}
```

## Next Steps

1. **Complete Setup**: Finalize configuration
2. **Run First Audit**: Execute audit in dry-run mode
3. **Review Results**: Analyze findings
4. **Integrate**: Add to CI/CD pipeline
5. **Monitor**: Set up continuous auditing
6. **Optimize**: Fine-tune configuration

## Partner-Specific Features

### Silver+ Partners

- **Priority Support**: Dedicated technical contact
- **Custom Rules**: Tailored scanning rules
- **Integration Assistance**: Hands-on setup help

### Gold+ Partners

- **Custom Workflows**: Bespoke CI/CD integration
- **Private Deployments**: On-premise options
- **Training Sessions**: Team onboarding

### Platinum Partners

- **Dedicated Engineer**: Named technical resource
- **Custom Development**: Feature development
- **24/7 Support**: Round-the-clock assistance

## Resources

### Documentation

- [README.md](../../README.md) - Project overview
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - Contribution guide
- [SECURITY.md](../../SECURITY.md) - Security policy

### Partner Resources

- [SLA and Support](sla_and_support.md)
- [Data Privacy](data_privacy.md)
- [Use Cases](use_cases.md)

### External Resources

- GitHub Actions Documentation
- Smart Contract Security Best Practices
- Blockchain Development Guides

## Feedback

We value your feedback:

- **Technical Issues**: GitHub Issues
- **Feature Requests**: GitHub Discussions
- **Partner Support**: support@cuberai.example
- **General Feedback**: partners@cuberai.example

---

**Last Updated**: 2026-01-01  
**Version**: 1.0

Welcome aboard! We're excited to have you as a partner. 🎉
=======
**"Invalid API key"**
- Verify key is correct
- Check key hasn't expired
- Ensure using production key for production

**"Rate limit exceeded"**
- Check rate limit headers
- Implement backoff strategy
- Upgrade plan if needed

**"Webhook not received"**
- Verify endpoint is accessible
- Check webhook signature
- Review webhook logs
- Test with curl

### Debug Mode

```javascript
const client = new SCA({
  apiKey: API_KEY,
  debug: true  // Enable debug logging
});
```

### Support

For technical issues:
- **Email**: tech-support@cuberai.example
- **Slack**: #partner-support
- **Response time**: See SLA
- **Emergency**: emergency@cuberai.example

## Resources

- **API Documentation**: [Link]
- **SDK Documentation**: [Link]
- **Code Examples**: GitHub repo
- **Community Forum**: [Link]
- **Status Page**: [Link]

## Next Steps

After completing onboarding:
1. Review [SLA and support](sla_and_support.md)
2. Check [data privacy](data_privacy.md) policies
3. Explore [use cases](use_cases.md)
4. Join partner community

---

*Last updated: 2026-01-01*
>>>>>>> origin/pr9
