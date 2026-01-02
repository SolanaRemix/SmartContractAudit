# Technical Onboarding

## Overview

This guide helps partners integrate CyberAi into their platforms, workflows, or infrastructure.

## Prerequisites

Before starting technical integration:

- [ ] Partnership agreement in place (or in progress)
- [ ] Technical contact designated
- [ ] Integration requirements documented
- [ ] Development environment ready
- [ ] Access to required resources

## Integration Options

### 1. GitHub Actions Integration

**Use Case**: CI/CD security scanning

**Setup Steps:**

1. **Add Workflow File** (`.github/workflows/security-scan.yml`):

```yaml
name: Security Scan
on: [pull_request, push]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run CyberAi
        uses: cyberai/cyberai-action@v1
        with:
          contracts-path: './contracts'
          severity-threshold: 'medium'
```

2. **Configure Secrets** (if needed):
   - `AUDIT_API_KEY` (for premium features)

3. **Test Integration**:
   - Create test PR
   - Verify scan runs
   - Check results format

**Documentation**: See GitHub Action README

---

### 2. CLI Integration

**Use Case**: Local development, custom workflows

**Installation:**

```bash
# npm
npm install -g @cyberai/cli

# or with pnpm
pnpm add -g @cyberai/cli
```

**Basic Usage:**

```bash
# Scan a directory
sca scan ./contracts

# Scan with specific config
sca scan ./contracts --config sca.config.json

# Output formats
sca scan ./contracts --format json > results.json
sca scan ./contracts --format sarif > results.sarif
```

**Configuration File** (`sca.config.json`):

```json
{
  "rules": {
    "reentrancy": "error",
    "overflow": "error",
    "access-control": "warn"
  },
  "exclude": [
    "node_modules/**",
    "test/**"
  ],
  "severity": "medium"
}
```

---

### 3. API Integration

**Use Case**: Custom platforms, advanced integrations

**Authentication:**

```bash
# Set API key
export SCA_API_KEY="your-api-key-here"
```

**Endpoints:**

```
POST /api/v1/scan
GET  /api/v1/scan/{id}
GET  /api/v1/scan/{id}/results
POST /api/v1/report
```

**Example Request:**

```bash
curl -X POST https://api.smartcontractaudit.example/v1/scan \
  -H "Authorization: Bearer $SCA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "base64-encoded-contract-code",
    "language": "solidity",
    "version": "0.8.0"
  }'
```

**Example Response:**

```json
{
  "scan_id": "scan_123abc",
  "status": "completed",
  "findings": [
    {
      "severity": "high",
      "type": "reentrancy",
      "line": 45,
      "message": "Potential reentrancy vulnerability",
      "recommendation": "Use ReentrancyGuard or checks-effects-interactions pattern"
    }
  ],
  "summary": {
    "critical": 0,
    "high": 1,
    "medium": 3,
    "low": 5
  }
}
```

**API Documentation**: [api-docs.smartcontractaudit.example](#)

---

### 4. IDE Plugin Integration

**Use Case**: Real-time development feedback

**Supported IDEs:**
- Visual Studio Code
- IntelliJ IDEA
- Sublime Text

**VS Code Installation:**

1. Open VS Code Extensions
2. Search "CyberAi"
3. Click Install
4. Configure API key in settings

**Configuration:**

```json
{
  "smartcontractaudit.apiKey": "your-key",
  "smartcontractaudit.autoScan": true,
  "smartcontractaudit.severityThreshold": "medium"
}
```

---

### 5. Docker Integration

**Use Case**: Containerized environments, custom deployments

**Pull Image:**

```bash
docker pull cyberai/scanner:latest
```

**Run Scan:**

```bash
docker run --rm \
  -v $(pwd)/contracts:/contracts \
  cyberai/scanner:latest \
  scan /contracts
```

**Docker Compose:**

```yaml
version: '3.8'
services:
  scanner:
    image: cyberai/scanner:latest
    volumes:
      - ./contracts:/contracts
    command: scan /contracts --format json
```

---

## Partner-Specific Integration

### For CI/CD Platforms

**Integration Checklist:**

- [ ] Marketplace listing prepared
- [ ] Authentication mechanism implemented
- [ ] Results display in platform UI
- [ ] Badge/status integration
- [ ] Webhook support for notifications
- [ ] Documentation published

**Sample Integration:**

```yaml
# Example: CircleCI
version: 2.1
orbs:
  sca: smartcontractaudit/sca@1.0.0

workflows:
  scan:
    jobs:
      - sca/scan:
          contracts-path: ./contracts
          api-key: $SCA_API_KEY
```

### For Audit Firms

**White-Label Deployment:**

1. **Self-Hosted Instance**:
   ```bash
   docker-compose up -d
   ```

2. **Custom Branding**:
   - Logo and colors in config
   - Custom email templates
   - Branded reports

3. **Custom Rules**:
   ```json
   {
     "custom_rules": [
       {
         "id": "firm-specific-rule",
         "pattern": "...",
         "severity": "high"
       }
     ]
   }
   ```

### For Blockchain Explorers

**API Integration:**

```javascript
// Example: Fetch scan results for contract
const response = await fetch(
  `https://api.smartcontractaudit.example/v1/contract/${address}/latest-scan`,
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  }
);

const scanResults = await response.json();
// Display in explorer UI
```

**Badge Integration:**

```html
<!-- Security score badge -->
<img src="https://badges.smartcontractaudit.example/{address}/score.svg" alt="Security Score">
```

---

## Configuration

### Environment Variables

```bash
# Required
SCA_API_KEY=your-api-key

# Optional
SCA_API_URL=https://api.smartcontractaudit.example
SCA_LOG_LEVEL=info
SCA_DRY_RUN=false
SCA_CACHE_ENABLED=true
```

### Configuration File

Create `sca.config.json`:

```json
{
  "version": "1.0",
  "rules": {
    "enabled": ["reentrancy", "overflow", "access-control"],
    "disabled": ["style-warnings"]
  },
  "severity_threshold": "medium",
  "output": {
    "format": "json",
    "destination": "./scan-results/"
  },
  "notifications": {
    "webhook_url": "https://your-webhook.example/sca",
    "on_severity": ["high", "critical"]
  }
}
```

---

## Testing Your Integration

### Test Contracts

We provide test contracts with known vulnerabilities:

```bash
git clone https://github.com/CyberAi/CyberAi-test-contracts
cd CyberAi-test-contracts
sca scan ./contracts
```

Expected results: 10 high, 15 medium, 20 low severity findings

### Integration Tests

```bash
# Run integration test suite
npm run test:integration

# Verify API connectivity
sca test-connection --api-key $SCA_API_KEY

# Dry-run scan
sca scan ./test-contracts --dry-run
```

---

## Support

### Technical Support Channels

**Partners get priority support:**

- **Slack/Discord**: Private partner channel
- **Email**: partners-support@cyberai.network
- **GitHub Issues**: Tag with `partner-support`
- **Video Calls**: Schedule via partners-support@cyberai.network

### Response Times

- **Critical (service down)**: 4 hours
- **High (major issue)**: 1 business day
- **Medium**: 2 business days
- **Low**: 5 business days

### Escalation

If not resolved in SLA time:
1. Email partners-support@cyberai.network with "ESCALATION" in subject
2. Include original ticket number
3. CC: funding@cyberai.network

---

## Best Practices

### Security

- ✅ Store API keys in secrets management
- ✅ Use HTTPS for all API calls
- ✅ Rotate API keys regularly
- ✅ Validate webhook signatures
- ❌ Don't commit API keys to source control
- ❌ Don't share API keys between environments

### Performance

- ✅ Cache scan results appropriately
- ✅ Use incremental scanning when possible
- ✅ Implement rate limiting on your side
- ✅ Batch API requests when possible
- ❌ Don't scan on every file save (debounce)
- ❌ Don't overwhelm API with requests

### User Experience

- ✅ Show scan progress to users
- ✅ Provide clear error messages
- ✅ Link to detailed documentation
- ✅ Offer inline fixes when possible
- ❌ Don't block critical workflows
- ❌ Don't hide scan results from users

---

## Maintenance

### Updates

- **Breaking Changes**: 90 days notice minimum
- **New Features**: Announced in changelog
- **Deprecations**: 180 days before removal
- **Security Updates**: Immediate notification to partners

### Monitoring

Monitor these metrics:

- API response times
- Error rates
- Scan success rates
- User adoption
- False positive rates

### Feedback Loop

Partners should provide:

- Monthly usage statistics
- Feature requests
- Bug reports
- User feedback
- Integration challenges

---

## Documentation

### Required Documentation

Partners should document:

- [ ] How users enable the integration
- [ ] Configuration options
- [ ] Troubleshooting common issues
- [ ] Example workflows
- [ ] Support contact information

### We Provide

- API reference docs
- Integration examples
- SDK documentation
- Video tutorials
- Sample code repositories

---

## Go-Live Checklist

Before launching your integration:

- [ ] Integration tested end-to-end
- [ ] Error handling implemented
- [ ] User documentation complete
- [ ] Support process defined
- [ ] Monitoring in place
- [ ] Security review passed
- [ ] Performance tested under load
- [ ] Beta tested with select users
- [ ] Announcement materials ready
- [ ] Support team trained

---

## Contact

**Technical Onboarding**: partners-support@cyberai.network  
**API Access**: funding@cyberai.network  
**Bug Reports**: GitHub Issues with `partner` tag  
**Emergency Support**: partners-support@cyberai.network (subject: URGENT)

---

**Last Updated**: 2026-01-01  
**API Version**: v1  
**Documentation**: [docs.smartcontractaudit.example](#)
