---
title: "GitAntivirus Security Practices"
description: "Security best practices and safety guidelines for GitAntivirus"
tags: ["security", "best-practices", "safety"]
seo_keywords: "gitantivirus security, security best practices, safe deployment"
---

# 🔐 GitAntivirus Security Practices

## Core Security Principles

### 1. 🛡️ Safe by Default

**Principle:** All operations default to non-destructive behavior.

**Implementation:**
```bash
# Default behavior (safe)
./scripts/master.sh audit  # DRY_RUN=true

# Explicit override required for writes
DRY_RUN=false ./scripts/master.sh audit
```

**Why it matters:** Prevents accidental modifications, data loss, or unauthorized actions.

---

### 2. 🔑 No Hardcoded Secrets

**Principle:** Never commit credentials, keys, or tokens to version control.

**What we protect:**
- GitHub tokens (`GH_TOKEN`, `GITHUB_TOKEN`)
- Private keys (`CASTER_KEY`)
- API endpoints with auth (`PROVIDER_URL`)
- Database credentials
- API keys

**Implementation:**
```bash
# ✅ CORRECT: Use environment variables
export GH_TOKEN=your_token_here
node bot/index.js

# ❌ WRONG: Never hardcode
GH_TOKEN="ghp_xxxxx" node bot/index.js  # Don't commit this!
```

**Storage recommendations:**
- Local: Use `.env` files (add to `.gitignore`)
- CI/CD: Use repository secrets
- Production: Use secret management services (Vault, AWS Secrets Manager)

---

### 3. 🎯 Least Privilege Access

**Principle:** Grant minimum permissions necessary for operation.

**GitHub Token Permissions:**

**Minimum (read-only):**
```
✅ repo:status
✅ public_repo (read)
```

**Bot operations (write):**
```
✅ repo (full)
✅ workflow (if updating actions)
✅ pull_requests:write
```

**Avoid:**
```
❌ admin:org
❌ delete_repo
❌ admin:repo_hook
```

**Setup:**
```bash
# Generate token at: https://github.com/settings/tokens
# Select only required scopes
export GH_TOKEN=your_minimal_scope_token
```

---

### 4. 🔍 Input Validation

**Principle:** Validate all inputs before processing.

**Bot filtering:**
```javascript
// Allowlist validation
if (config.allowlistOrgs.length > 0) {
  filtered = repos.filter(repo => 
    config.allowlistOrgs.includes(repo.owner.login)
  );
}

// Star threshold
filtered = filtered.filter(repo => 
  repo.stargazers_count >= config.starThreshold
);
```

**Script validation:**
```bash
# Check file exists before processing
if [[ ! -f "${ARTIFACT_PATH}" ]]; then
    log_error "Artifact not found"
    return 1
fi

# Validate JSON format
if ! jq empty "${ARTIFACT_PATH}" 2>/dev/null; then
    log_error "Invalid JSON"
    return 1
fi
```

---

### 5. 📊 Comprehensive Logging

**Principle:** Log all operations for audit trails.

**What we log:**
- All bot operations → `node/logs/summary.json`
- Agent execution → stdout with timestamps
- API interactions → success/failure status
- Configuration used → dry-run status, allowlist

**Example log:**
```json
{
  "timestamp": "2025-12-31T01:48:00Z",
  "config": {
    "dryRun": true,
    "botPingsEnabled": false,
    "allowlistOrgs": ["SolanaRemix"]
  },
  "results": [...],
  "stats": {
    "total": 10,
    "prsCreated": 0
  }
}
```

---

## Security Checklist

### Before Deployment

- [ ] Review all code changes
- [ ] Verify no secrets in commits
- [ ] Test with `DRY_RUN=true`
- [ ] Validate artifact contents
- [ ] Check token permissions
- [ ] Review allowlist settings
- [ ] Confirm rate limits

### During Operation

- [ ] Monitor logs for errors
- [ ] Check API rate limit usage
- [ ] Verify expected behavior
- [ ] Review created PRs/issues
- [ ] Monitor system resources

### After Operation

- [ ] Review summary logs
- [ ] Archive audit reports
- [ ] Rotate tokens if exposed
- [ ] Document any incidents
- [ ] Update allowlist as needed

---

## Secure Configuration

### Environment Variables

**Template `.env` file:**
```bash
# GitHub Authentication
GH_TOKEN=your_token_here

# Safety Settings
DRY_RUN=true
BOT_PINGS_ENABLED=false
ALLOWLIST_ORGS=SolanaRemix

# Rate Limiting
MAX_PRS_PER_RUN=3
STAR_THRESHOLD=10

# Deployment (if needed)
# CASTER_KEY=your_key
# PROVIDER_URL=https://mainnet.base.org
```

**Protect it:**
```bash
# Create .env
touch .env
chmod 600 .env  # Read/write owner only

# Add to .gitignore
echo ".env" >> .gitignore
```

---

## Common Security Pitfalls

### ❌ Pitfall 1: Exposed Secrets in Logs

**Problem:**
```bash
echo "Deploying with key: $CASTER_KEY"  # DON'T DO THIS
```

**Solution:**
```bash
echo "Deploying with key: ${CASTER_KEY:0:8}..."  # Show only prefix
```

### ❌ Pitfall 2: Overly Broad Tokens

**Problem:** Using admin tokens for read operations

**Solution:** Create specific tokens per use case

### ❌ Pitfall 3: Disabled Safety Checks

**Problem:**
```bash
# Skipping validation
DRY_RUN=false ./scripts/deploy-caster.sh  # No testing!
```

**Solution:**
```bash
# Always test first
./scripts/deploy-caster.sh --dry-run
# Review output, then:
DRY_RUN=false ./scripts/deploy-caster.sh
```

### ❌ Pitfall 4: Unrestricted Bot Access

**Problem:** No allowlist, scanning all repositories

**Solution:**
```bash
ALLOWLIST_ORGS="SolanaRemix,TrustedOrg" node bot/index.js
```

---

## Incident Response

### If a Secret is Exposed

1. **Immediately revoke** the exposed token/key
2. **Generate a new** credential
3. **Audit logs** for unauthorized usage
4. **Update all** systems using the old credential
5. **Document** the incident
6. **Review** security practices

### If Unauthorized PRs are Created

1. **Close** all unauthorized PRs
2. **Disable** the bot token
3. **Review** allowlist configuration
4. **Check** for token compromise
5. **Re-enable** with corrected settings

### If Rate Limits are Exceeded

1. **Reduce** `MAX_PRS_PER_RUN`
2. **Add delays** between operations
3. **Use authenticated** requests (higher limits)
4. **Schedule** scans during off-peak hours

---

## Security Audit Guidelines

### Self-Audit Checklist

**Code Review:**
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] Error handling implemented
- [ ] Dry-run mode functional
- [ ] Logging comprehensive

**Configuration:**
- [ ] Allowlist configured
- [ ] Rate limits set
- [ ] Tokens have minimal scope
- [ ] Pings disabled (unless needed)

**Documentation:**
- [ ] Security notes in PR descriptions
- [ ] README mentions safety features
- [ ] Examples use dry-run

---

## Best Practices Summary

### ✅ DO

- Use environment variables for secrets
- Test with dry-run first
- Apply allowlist filtering
- Log all operations
- Use minimal token permissions
- Review PRs before merging
- Monitor API rate limits
- Rotate credentials regularly

### ❌ DON'T

- Commit secrets to git
- Skip dry-run testing
- Use admin tokens unnecessarily
- Disable safety checks
- Ignore error logs
- Create PRs without review
- Exceed rate limits
- Share tokens between systems

---

## Compliance Notes

GitAntivirus is designed to help maintain security compliance:

- **SOC 2:** Audit logging, access controls
- **GDPR:** No personal data collection
- **ISO 27001:** Security best practices
- **OWASP:** Secure coding standards

---

## Resources

- [GitHub Token Security](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [Solidity Security Considerations](https://docs.soliditylang.org/en/latest/security-considerations.html)

---

## Security Contact

For security issues or questions:

1. Review documentation first
2. Check closed issues on GitHub
3. Create a private security advisory
4. Do NOT publicly disclose vulnerabilities

---

*Security Guide Version: 1.0.0*
*Last Updated: 2025-12-31*

```
═══════════════════════════════════════════════════════════════════════════
🔐 Security First | 🛡️ Safety Always
═══════════════════════════════════════════════════════════════════════════
```
