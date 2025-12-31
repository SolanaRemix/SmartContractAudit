# 🤖 GitAntivirus BOT - Behavior & Configuration

## ═══════════════════════════════════════════════════════════════
## 🎯 Purpose
## ═══════════════════════════════════════════════════════════════

The GitAntivirus BOT is an ethical automation tool that discovers repositories in need of security improvements and prepares draft pull requests with security enhancements. 

**🔒 SAFETY FIRST**: The bot operates in **dry-run mode by default** and will not create PRs or ping users unless explicitly configured.

## ═══════════════════════════════════════════════════════════════
## 🚀 Quick Start
## ═══════════════════════════════════════════════════════════════

```bash
# Install dependencies
pnpm install

# Run in dry-run mode (default, safe)
node index.js

# Run with live mode (requires token)
DRY_RUN=false GH_TOKEN=your_token node index.js
```

## ═══════════════════════════════════════════════════════════════
## ⚙️ Environment Variables
## ═══════════════════════════════════════════════════════════════

### Required for Write Operations
- `GH_TOKEN` or `GITHUB_TOKEN`: GitHub Personal Access Token with `repo` and `pull_request` scopes

### Optional Configuration
- `DRY_RUN` (default: `true`): Set to `false` to enable actual PR creation
- `BOT_PINGS_ENABLED` (default: `false`): Set to `true` to enable user mentions
- `ALLOWLIST_ORGS` (default: `""`): Comma-separated list of GitHub organizations to target
- `MAX_PRS_PER_RUN` (default: `3`): Maximum number of PRs to create per execution
- `SEARCH_KEYWORDS` (default: `"solana,smart-contract,audit"`): Keywords for repository discovery
- `MIN_STARS` (default: `10`): Minimum stars for repository consideration

### Example Configuration

```bash
# Dry-run mode (safe, no PRs created)
export DRY_RUN=true
node index.js

# Live mode for specific organization
export DRY_RUN=false
export GH_TOKEN=ghp_your_token_here
export ALLOWLIST_ORGS=SolanaRemix,smsdao
export BOT_PINGS_ENABLED=true
export MAX_PRS_PER_RUN=5
node index.js
```

## ═══════════════════════════════════════════════════════════════
## 🎭 Bot Behavior
## ═══════════════════════════════════════════════════════════════

### Discovery Phase
1. **Search**: Finds repositories matching configured keywords
2. **Filter**: Applies allowlist and minimum star criteria
3. **Analyze**: Checks for existing security workflows
4. **Prioritize**: Ranks candidates by need and impact

### Action Phase (DRY_RUN=false only)
1. **Prepare**: Generates PR content from template
2. **Create**: Opens draft PR with security improvements
3. **Label**: Adds appropriate labels (security, automation, etc.)
4. **Document**: Logs all actions to `node/logs/summary.json`

### Notification Behavior
- **Default**: No pings, no mentions (respectful)
- **When BOT_PINGS_ENABLED=true AND repo owner is SolanaRemix**: 
  - Includes single @SolanaRemix mention in summary
  - No spam, no excessive pings
  - Always in draft PR state

## ═══════════════════════════════════════════════════════════════
## 🛡️ Ethics & Best Practices
## ═══════════════════════════════════════════════════════════════

### ✅ DO:
- Run in dry-run mode first
- Test with your own repositories
- Respect rate limits
- Create draft PRs initially
- Provide clear documentation
- Log all actions transparently

### ❌ DON'T:
- Spam repositories with unwanted PRs
- Ping users without permission
- Bypass organization allowlists
- Ignore rate limits
- Create PRs without proper testing

## ═══════════════════════════════════════════════════════════════
## 🔓 Enabling Pings
## ═══════════════════════════════════════════════════════════════

Pings are **disabled by default** to respect repository owners. To enable:

1. **Set environment variable**:
   ```bash
   export BOT_PINGS_ENABLED=true
   ```

2. **Configure in config/repair.json**:
   ```json
   {
     "pings_enabled": true
   }
   ```

3. **Requirements**:
   - Must be owner or explicit collaborator
   - Repository must be in allowlist
   - DRY_RUN must be false
   - Valid GH_TOKEN required

## ═══════════════════════════════════════════════════════════════
## 📊 Monitoring & Logs
## ═══════════════════════════════════════════════════════════════

All bot activity is logged to:
- `node/logs/summary.json` - Execution summary
- Console output - Real-time progress
- GitHub Actions logs (when run in workflow)

### Log Structure
```json
{
  "timestamp": "2025-12-31T01:40:00Z",
  "mode": "dry_run",
  "repositories_scanned": 50,
  "prs_created": 0,
  "pings_sent": 0,
  "errors": []
}
```

## ═══════════════════════════════════════════════════════════════
## 🆘 Troubleshooting
## ═══════════════════════════════════════════════════════════════

### Issue: No repositories found
- **Solution**: Adjust SEARCH_KEYWORDS or MIN_STARS

### Issue: Rate limit exceeded
- **Solution**: Wait for rate limit reset or use GitHub App auth

### Issue: Cannot create PR
- **Solution**: Verify GH_TOKEN has correct scopes (repo, pull_request)

### Issue: Pings not working
- **Solution**: Check BOT_PINGS_ENABLED and repository owner

## ═══════════════════════════════════════════════════════════════
## 📞 Support
## ═══════════════════════════════════════════════════════════════

For issues or questions:
- Open an issue in the repository
- Contact @SolanaRemix or @smsdao
- Review documentation in `/docs`

---

**Remember**: With great automation comes great responsibility. Use wisely! 🧠✨
