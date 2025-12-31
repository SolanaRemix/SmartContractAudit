---
title: "GitAntivirus Security Guide"
description: "Security best practices, guidelines, and threat mitigation for GitAntivirus"
tags: ["security", "best-practices", "guidelines", "safety"]
seo_keywords: "security best practices, gitantivirus security, automation safety, secure deployment"
---

# 🛡️ GitAntivirus Security Guide

> Comprehensive security practices and guidelines for safe automation

## ═══════════════════════════════════════════════════════════════
## 🎯 Security Principles
## ═══════════════════════════════════════════════════════════════

### Core Principles

1. **🔒 Secure by Default**: All operations default to dry-run mode
2. **🔐 Minimal Permissions**: Request only required access scopes
3. **📝 Audit Everything**: Comprehensive logging of all operations
4. **🚫 No Secrets in Code**: All credentials via environment variables
5. **✅ Verify Before Trust**: Validate all inputs and outputs

## ═══════════════════════════════════════════════════════════════
## 🔐 Secrets Management
## ═══════════════════════════════════════════════════════════════

### ✅ DO: Proper Secrets Handling

```bash
# Store secrets in environment variables
export GH_TOKEN="ghp_your_token_here"
export CASTER_KEY="your_private_key"
export PROVIDER_URL="https://mainnet.base.org"

# Use GitHub repository secrets
# Settings → Secrets and variables → Actions → New secret

# Load from secure file (not committed)
source .env.local  # Add to .gitignore!

# Use secrets managers
# - GitHub Secrets
# - HashiCorp Vault
# - AWS Secrets Manager
# - Azure Key Vault
```

### ❌ DON'T: Insecure Practices

```bash
# NEVER commit secrets to git
echo "GH_TOKEN=abc123" >> config.json  # ❌ BAD

# NEVER hardcode credentials
const token = "ghp_abc123";  // ❌ BAD

# NEVER log secrets
console.log(`Token: ${process.env.GH_TOKEN}`);  // ❌ BAD

# NEVER share secrets in PRs
# "Use this token: ghp_abc123"  # ❌ BAD
```

### Checking for Leaked Secrets

```bash
# Run security scan
./scripts/master.sh scan

# Manual check with git
git grep -i "password\|secret\|api[_-]?key\|token" -- ':!*.md'

# Check git history
git log -p -S "password" --all

# Use git-secrets tool
git secrets --scan
```

## ═══════════════════════════════════════════════════════════════
## 🔑 Token Security
## ═══════════════════════════════════════════════════════════════

### GitHub Personal Access Token (PAT)

**Creating a Secure Token:**

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a descriptive name: "GitAntivirus Bot - <purpose>"
4. Set expiration: 90 days maximum
5. Select minimal scopes:
   - `repo` (for private repos)
   - `public_repo` (for public repos only)
   - `write:discussion` (if needed)
6. Generate and store securely

**Token Best Practices:**

```bash
# Rotate tokens regularly (every 90 days)
# Set token expiration
# Use fine-grained tokens when possible
# One token per use case
# Revoke unused tokens immediately

# Store token in secure location
mkdir -p ~/.secrets
chmod 700 ~/.secrets
echo "GH_TOKEN=ghp_..." > ~/.secrets/gitantivirus
chmod 600 ~/.secrets/gitantivirus

# Load token when needed
export $(cat ~/.secrets/gitantivirus | xargs)
```

### GitHub App Authentication (Recommended)

```javascript
// More secure than PAT for automated systems
import { createAppAuth } from "@octokit/auth-app";

const auth = createAppAuth({
  appId: process.env.APP_ID,
  privateKey: process.env.PRIVATE_KEY,
  installationId: process.env.INSTALLATION_ID,
});

const authentication = await auth({ type: "installation" });
```

## ═══════════════════════════════════════════════════════════════
## 🚦 Safe Deployment Practices
## ═══════════════════════════════════════════════════════════════

### Pre-Deployment Checklist

```bash
# 1. Always test in dry-run first
./scripts/deploy-caster.sh --dry-run

# 2. Verify artifact integrity
sha256sum build/talents.json

# 3. Test on testnet first
NETWORK=base-goerli ./scripts/deploy-caster.sh

# 4. Review transaction parameters
cat build/talents.json | jq .

# 5. Backup existing state
git commit -am "Pre-deployment backup"

# 6. Set spending limits
# Use wallet with limited funds

# 7. Monitor deployment
# Watch for transaction confirmation

# 8. Verify deployment
# Check on-chain data
```

### Deployment Security

```bash
# Use hardware wallet for production
export CASTER_KEY="ledger://..."

# Set gas limits
export MAX_GAS=500000

# Use multi-sig for critical operations
# Require 2-of-3 signatures

# Enable transaction simulation
export SIMULATE_FIRST=true

# Set deployment timeout
export DEPLOY_TIMEOUT=300

# Use deterministic deployments
export DETERMINISTIC=true
```

## ═══════════════════════════════════════════════════════════════
## 🤖 Bot Security
## ═══════════════════════════════════════════════════════════════

### Safe Bot Configuration

```bash
# Conservative defaults
export DRY_RUN=true              # Always start with dry-run
export BOT_PINGS_ENABLED=false   # Disable pings by default
export MAX_PRS_PER_RUN=3         # Limit PR creation
export RATE_LIMIT_BUFFER=0.2     # Stay under rate limits

# Restrictive allowlist
export ALLOWLIST_ORGS="YourOrgOnly"

# Monitor bot activity
tail -f node/logs/summary.json

# Set timeouts
export REQUEST_TIMEOUT=30000     # 30 seconds
export MAX_RETRIES=3
```

### Rate Limiting

```javascript
// Implement exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (error.status === 429) {  // Rate limit
        const delay = Math.pow(2, i) * 1000;
        await new Promise(r => setTimeout(r, delay));
      } else {
        throw error;
      }
    }
  }
}

// Check rate limit before operations
const rateLimit = await octokit.rest.rateLimit.get();
console.log(`Remaining: ${rateLimit.data.rate.remaining}`);
```

## ═══════════════════════════════════════════════════════════════
## 🔍 Vulnerability Scanning
## ═══════════════════════════════════════════════════════════════

### Automated Scanning

```bash
# Run GitAntivirus security scan
DRY_RUN=false ./scripts/master.sh scan

# Check for dependency vulnerabilities
npm audit
pnpm audit

# Scan Docker images (if applicable)
docker scan your-image:latest

# Use additional security tools
# - Snyk
# - Dependabot
# - GitHub Advanced Security
```

### Manual Security Review

```bash
# Check for common issues
git grep -E "eval\(|exec\(|system\("

# Look for insecure dependencies
npm outdated
pnpm outdated

# Review permissions
ls -la scripts/
# Should be: -rwxr-xr-x (executable)

# Check file ownership
find . -type f -perm 0777

# Review network calls
git grep -E "http://|ftp://"  # Should be https://
```

## ═══════════════════════════════════════════════════════════════
## 🛡️ Workflow Security
## ═══════════════════════════════════════════════════════════════

### GitHub Actions Security

```yaml
# Minimal permissions
permissions:
  contents: read      # Default to read-only
  pull-requests: write # Only when needed

# Pin action versions
- uses: actions/checkout@v4.1.1  # ✅ Specific version
# NOT: @v4 or @main                # ❌ Avoid floating tags

# Validate inputs
- name: Validate input
  run: |
    if [[ ! "${{ inputs.scan_type }}" =~ ^(scan|audit|health|full)$ ]]; then
      echo "Invalid scan_type"
      exit 1
    fi

# Use secrets properly
env:
  GH_TOKEN: ${{ secrets.GH_TOKEN }}  # ✅ Correct
# NOT: GH_TOKEN: ${{ secrets.GH_TOKEN }} in script # ❌ Logs secret

# Limit workflow triggers
on:
  pull_request:
    branches: [main]  # ✅ Specific branches
  # NOT: pull_request: # ❌ Too broad
```

### Environment Isolation

```bash
# Use separate environments
# - Development: dev.example.com
# - Staging: staging.example.com
# - Production: example.com

# Different tokens per environment
export DEV_GH_TOKEN="..."
export PROD_GH_TOKEN="..."

# Network segregation
# - Development: Base Goerli
# - Production: Base Mainnet
```

## ═══════════════════════════════════════════════════════════════
## 📊 Audit & Monitoring
## ═══════════════════════════════════════════════════════════════

### Logging Best Practices

```bash
# Comprehensive logging
LOG_LEVEL=debug ./scripts/master.sh full

# Log rotation
# Keep logs for 30 days maximum
find node/logs -name "*.json" -mtime +30 -delete

# Redact sensitive data
cat log.json | jq 'del(.token, .private_key)'

# Centralized logging (for production)
# - Splunk
# - ELK Stack
# - CloudWatch
```

### Monitoring Checklist

```bash
# Monitor bot activity
watch -n 60 'cat node/logs/summary.json | jq ".prs_created"'

# Track workflow runs
gh run list --workflow=gitantivirus.yml --limit 10

# Alert on failures
# Set up GitHub webhooks or notifications

# Review security alerts
# GitHub Security → Code scanning alerts

# Check dependencies
pnpm audit --audit-level=moderate
```

## ═══════════════════════════════════════════════════════════════
## 🚨 Incident Response
## ═══════════════════════════════════════════════════════════════

### If Secret is Leaked

```bash
# 1. Immediately revoke the token
# GitHub Settings → Developer settings → Revoke

# 2. Rotate credentials
# Generate new token with minimal scopes

# 3. Review access logs
# Check for unauthorized access

# 4. Update secret in repository
# GitHub Settings → Secrets → Update

# 5. Scan history for secret
git log -S "leaked_secret" --all

# 6. Consider rewriting history (careful!)
git filter-branch --tree-filter 'rm -f .env' HEAD

# 7. Document incident
# Create incident report

# 8. Notify stakeholders
# If production credentials were leaked
```

### If Unauthorized PR Created

```bash
# 1. Close PR immediately
gh pr close <pr-number>

# 2. Revoke bot token
# GitHub Settings → Revoke token

# 3. Review bot logs
cat node/logs/summary.json

# 4. Check allowlist
cat config/repair.json

# 5. Update security measures
export ALLOWLIST_ORGS="OnlyTrustedOrg"

# 6. Enable additional monitoring
export BOT_APPROVAL_REQUIRED=true
```

## ═══════════════════════════════════════════════════════════════
## ✅ Security Checklist
## ═══════════════════════════════════════════════════════════════

### Before Enabling Live Mode

- [ ] All scripts tested in dry-run mode
- [ ] Secrets stored securely (not in code)
- [ ] Token has minimal required scopes
- [ ] Allowlist configured correctly
- [ ] Rate limits configured
- [ ] Logging enabled
- [ ] Monitoring set up
- [ ] Incident response plan documented
- [ ] Team members trained
- [ ] Backup and rollback plan ready

### Regular Security Maintenance

- [ ] Rotate tokens every 90 days
- [ ] Review and update dependencies monthly
- [ ] Audit bot activity weekly
- [ ] Review access logs daily
- [ ] Update security documentation
- [ ] Test incident response procedures
- [ ] Review and update allowlist
- [ ] Scan for new vulnerabilities

## ═══════════════════════════════════════════════════════════════
## 📚 Additional Resources
## ═══════════════════════════════════════════════════════════════

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Bash Security Guidelines](https://google.github.io/styleguide/shellguide.html#s9-security)

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-31  
**Classification**: Public  
**Status**: Production Ready

**Remember**: Security is not a one-time setup, it's a continuous process! 🛡️✨
