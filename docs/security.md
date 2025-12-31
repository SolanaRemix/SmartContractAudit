---
title: "Security Practices - CuberAi GitAntivirus"
description: "Security guidelines, best practices, and safety features of the SmartBrain orchestrator"
tags: [security, best-practices, safety, guidelines]
seo_keywords: "smart contract security practices, secure automation, devsecops security"
geo:
  country: "global"
---

# 🔐 Security Practices

Comprehensive security guidelines for **CuberAi GitAntivirus** and the **SmartBrain orchestrator**.

## 🎯 Security-First Design

All components are designed with security as the primary concern:

- ✅ **Non-destructive by default** (DRY_RUN=true)
- ✅ **No secrets in code**
- ✅ **Minimal permissions**
- ✅ **Opt-in for sensitive operations**
- ✅ **Comprehensive logging**
- ✅ **Rate limiting**

## 🔒 Secret Management

### ❌ NEVER Do This

```bash
# DON'T hardcode secrets
export CASTER_KEY="sk_live_abc123"  # In a script file

# DON'T commit secrets
git add .env  # With secrets inside

# DON'T expose secrets in logs
echo "Token: $GH_TOKEN"  # Printed to console
```

### ✅ DO This Instead

```bash
# DO use environment variables (set locally)
export CASTER_KEY="sk_live_abc123"  # In terminal, not in files

# DO use GitHub repository secrets
# Settings → Secrets → Actions → New repository secret

# DO mask secrets in logs
echo "Token: ${GH_TOKEN:0:7}***"  # Shows only prefix
```

### GitHub Secrets Setup

1. Go to repository Settings
2. Navigate to Secrets and variables → Actions
3. Click "New repository secret"
4. Add secrets:
   - `BOT_GITHUB_TOKEN` (optional, for bot operations)
   - `PROJECT_URL` (optional, for project board integration)
   - `CASTER_KEY` (for ENS deployment)
   - `PROVIDER_URL` (for RPC access)

### Local Development

```bash
# Use .env file (add to .gitignore!)
echo "GH_TOKEN=ghp_xxx" > .env.local
echo ".env.local" >> .gitignore

# Load secrets before running
source .env.local
./scripts/master.sh scan
```

## 🛡️ Permission Model

### Workflow Permissions

The GitAntivirus workflow uses minimal permissions:

```yaml
permissions:
  contents: write        # For committing changes (future)
  pull-requests: write   # For PR comments and labels
  issues: write          # For issue management (optional)
```

**Why these permissions?**
- `contents: write` - Required for future auto-fix features
- `pull-requests: write` - For PR comments and labels
- `issues: write` - For issue tracking (optional)

### Bot Token Scopes

For the Node bot to create PRs, the GitHub token needs:

- ✅ `repo` scope (for private repositories)
- ✅ `public_repo` scope (for public repositories)
- ✅ `pull_request` scope (for creating PRs)

**Generate token:**
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo`, `pull_request`
4. Copy token (you won't see it again!)
5. Store as `GH_TOKEN` or `GITHUB_TOKEN`

### Least Privilege Principle

- **Read-only by default**: All agents start in read mode
- **Write operations require opt-in**: Set `DRY_RUN=false` explicitly
- **No elevated privileges**: Scripts run as current user
- **No sudo required**: All operations are user-space

## 🔐 DRY_RUN Mode

### How It Works

```bash
# Default: DRY_RUN=true (safe)
./scripts/master.sh repair
# Output: "DRY_RUN: Would apply repair"

# Explicit: DRY_RUN=false (writes enabled)
DRY_RUN=false ./scripts/master.sh repair
# Output: "Applying repair..."
```

### What's Protected

In DRY_RUN mode:
- ❌ No files modified
- ❌ No PRs created
- ❌ No deployments executed
- ❌ No external API calls (write operations)
- ✅ All operations logged
- ✅ Simulated results shown

### Override Safety

```bash
# Via environment variable
export DRY_RUN=false
./scripts/master.sh repair

# Via command-line flag
./scripts/master.sh repair --live

# One-time override
DRY_RUN=false ./scripts/master.sh repair
```

## 🔍 Audit Trail

### Log Everything

All operations create detailed logs:

```json
{
  "timestamp": "2024-12-31T02:00:00.000Z",
  "workspace": "/path/to/repo",
  "dry_run": true,
  "user": "runner",
  "operation": "scan",
  "results": { /* ... */ }
}
```

### Log Security

- ✅ Logs stored locally in `logs/`
- ✅ CI/CD artifacts retained for 30 days
- ✅ No secrets in logs
- ✅ Timestamps for all operations
- ✅ Machine-readable JSON format

### Log Rotation

```bash
# Manual cleanup (recommended)
find logs/ -name "*.json" -mtime +30 -delete

# Automated via cron
0 0 * * 0 find /path/to/repo/logs -mtime +30 -delete
```

## 🚨 Bot Safety Features

### Rate Limiting

```javascript
// Automatic GitHub API rate limiting
const config = {
  maxPrsPerRun: 3,  // Conservative limit
  starThreshold: 10, // Only target active repos
};
```

### Allowlist System

```json
{
  "allowlist_orgs": ["SolanaRemix", "smsdao", "gxqstudio"]
}
```

Only repositories from allowed organizations are processed.

### Draft PRs Only

```javascript
// Bot always creates draft PRs
await octokit.pulls.create({
  draft: true,  // Never auto-merged
  /* ... */
});
```

### Ping Control

```javascript
// Pings are opt-in AND owner-restricted
if (botPingsEnabled && repo.owner.login === 'SolanaRemix') {
  body += '\n\n📢 cc: @SolanaRemix\n';
}
```

**Default**: `BOT_PINGS_ENABLED=false`

## 🔐 Deployment Security

### Caster Deployment

```bash
# ❌ Don't hardcode
CASTER_KEY="sk_live_abc123" ./scripts/deploy-caster.sh

# ✅ Use environment
export CASTER_KEY="sk_live_abc123"  # In terminal only
./scripts/deploy-caster.sh

# ✅ Or GitHub secrets (CI/CD)
# Stored securely in GitHub repository settings
```

### ENS Deployment Checklist

Before deploying:
- [ ] Secrets set securely (not in code)
- [ ] Artifact validated (`build/talents.json`)
- [ ] Network configured correctly (Base)
- [ ] ENS name verified (`gxqstudio.eth`)
- [ ] DRY_RUN tested first
- [ ] Backup of current deployment

### Artifact Validation

```bash
# Validate before deploying
./scripts/update-talents.sh
cat build/talents.json | jq
# Review content before proceeding
```

## 🛡️ Dependency Security

### Package Audits

```bash
# Automatic audits via SmartBrain
./scripts/master.sh audit

# Manual audits
cd node/bot
pnpm audit

# Fix vulnerabilities
pnpm audit --fix
```

### Dependency Pinning

```json
{
  "dependencies": {
    "@octokit/rest": "^20.0.2"  // Allows patch updates
  }
}
```

### Lock Files

- ✅ Commit `pnpm-lock.yaml`
- ✅ Run `pnpm install --frozen-lockfile` in CI
- ✅ Review dependency changes in PRs

## 🔒 GitHub Actions Security

### Workflow Isolation

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
  # No dangerous triggers like issue_comment
```

### Safe Checkout

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0  # Full history for analysis
    persist-credentials: false  # Don't persist token
```

### Environment Isolation

```yaml
env:
  DRY_RUN: ${{ github.event.inputs.dry_run || 'true' }}
  # Default to safe mode
```

## 🔐 Code Security

### Input Validation

```bash
# Validate inputs
if [[ ! "$PORT" =~ ^[0-9]+$ ]]; then
    log_error "Invalid port number"
    exit 1
fi
```

### Path Sanitization

```bash
# Use absolute paths
WORKSPACE="${WORKSPACE:-$(pwd)}"
LOG_DIR="${LOG_DIR:-./logs}"

# Validate paths exist
if [[ ! -d "$WORKSPACE" ]]; then
    log_error "Workspace not found: $WORKSPACE"
    exit 1
fi
```

### Command Injection Prevention

```bash
# ❌ Unsafe
eval "git commit -m $MESSAGE"

# ✅ Safe
git commit -m "$MESSAGE"
```

## 🚨 Incident Response

### If Secrets Are Leaked

1. **Revoke immediately**:
   - GitHub: Regenerate personal access token
   - Caster: Rotate deployment keys
   - RPC: Update provider credentials

2. **Remove from history**:
   ```bash
   # Use BFG Repo-Cleaner or git-filter-repo
   git filter-repo --strip-blobs-bigger-than 1M
   ```

3. **Notify team**:
   - Create incident report
   - Document exposure window
   - Review access logs

4. **Update procedures**:
   - Add to `.gitignore`
   - Update documentation
   - Train team members

### If Unauthorized PR Created

1. **Close PR immediately**
2. **Review bot configuration**:
   ```bash
   cat config/repair.json
   ```
3. **Check allowlist**:
   ```json
   {
     "allowlist_orgs": ["SolanaRemix"]  // Restrict
   }
   ```
4. **Disable bot temporarily**:
   ```bash
   # Set MAX_PRS_PER_RUN to 0
   MAX_PRS_PER_RUN=0 node index.js
   ```

## ✅ Security Checklist

### Before Deployment
- [ ] No secrets in code
- [ ] DRY_RUN tested
- [ ] Logs reviewed
- [ ] Permissions minimal
- [ ] Artifacts validated
- [ ] Backup created

### Before Enabling Bot
- [ ] Allowlist configured
- [ ] MAX_PRS_PER_RUN set
- [ ] BOT_PINGS_ENABLED=false
- [ ] Token scopes minimal
- [ ] Rate limits understood

### Regular Maintenance
- [ ] Review logs weekly
- [ ] Audit dependencies monthly
- [ ] Rotate tokens quarterly
- [ ] Update documentation
- [ ] Test disaster recovery

## 🔐 Best Practices Summary

1. **Default to Safe**: DRY_RUN=true always
2. **Secrets External**: Never in code
3. **Minimal Permissions**: Only what's needed
4. **Audit Everything**: Comprehensive logging
5. **Rate Limit**: Conservative defaults
6. **Allowlist**: Restrict targets
7. **Draft PRs**: Never auto-merge
8. **Opt-in Pings**: Disabled by default
9. **Validate Inputs**: Check all user data
10. **Regular Reviews**: Security audits

## 📚 Further Reading

- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Node.js Security Checklist](https://github.com/goldbergyoni/nodebestpractices#6-security-best-practices)

## 🆘 Security Support

Found a security vulnerability?

1. **Do NOT create a public issue**
2. Email: security@smartcontractaudit.example (placeholder)
3. Use GitHub Security Advisory (private disclosure)
4. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

---

**Security Policy Version**: 1.0.0  
**Last Updated**: 2024-12-31  
**Security Contact**: See repository security policy
