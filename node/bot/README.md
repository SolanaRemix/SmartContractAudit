---
title: "Node Bot - Configuration & Usage"
description: "GitHub scanning bot for smart contract security - ethical automation with dry-run defaults"
tags: [bot, github, automation, security, ethics]
---

# 🤖 Node Bot - Smart Contract Security Scanner

## 🎯 Purpose

The Node Bot automatically discovers GitHub repositories containing smart contracts, analyzes them for security patterns, and can optionally generate draft pull requests with security improvements.

## 🔐 Ethical Design

This bot is designed with **ethics and safety first**:

- ✅ **Dry-run by default** - No PRs opened without explicit opt-in
- ✅ **No secrets in code** - All tokens via environment variables
- ✅ **Opt-in pings** - Mentions disabled by default
- ✅ **Conservative limits** - Max 3 PRs per run
- ✅ **Allowlist support** - Filter by organization
- ✅ **Star threshold** - Only target active repositories
- ✅ **Draft PRs only** - Never auto-merge

## 📋 Environment Variables

### Required for Live Mode

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `GH_TOKEN` or `GITHUB_TOKEN` | GitHub personal access token with `repo` and `pull_request` scopes | - | ✅ (for writes) |

### Optional Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `DRY_RUN` | Enable dry-run mode (no PRs created) | `true` |
| `BOT_PINGS_ENABLED` | Enable bot mentions in PRs | `false` |
| `ALLOWLIST_ORGS` | Comma-separated list of allowed organizations | `''` (all) |
| `MAX_PRS_PER_RUN` | Maximum PRs to create per run | `3` |
| `STAR_THRESHOLD` | Minimum stars for repo targeting | `10` |
| `SEARCH_KEYWORDS` | Custom search keywords | `smart contract solidity rust` |

## 🚀 Usage

### Dry-run Mode (Safe, Default)

```bash
cd node/bot
pnpm install
node index.js
```

This will:
- Search GitHub for matching repositories
- Filter by criteria (stars, allowlist)
- Log what would be done
- **NOT create any PRs**
- Save summary to `node/logs/summary.json`

### Live Mode (Requires Token)

```bash
# Set your GitHub token
export GH_TOKEN="ghp_your_token_here"

# Run in live mode
DRY_RUN=false node index.js
```

This will:
- Search and filter repositories
- Create **draft** pull requests
- Add security improvements
- Log all actions

### With Allowlist

```bash
# Only target specific organizations
ALLOWLIST_ORGS="SolanaRemix,smsdao,gxqstudio" DRY_RUN=false GH_TOKEN=xxx node index.js
```

### Enable Bot Pings (SolanaRemix only)

```bash
# Enable mentions (only works for SolanaRemix repos)
BOT_PINGS_ENABLED=true DRY_RUN=false GH_TOKEN=xxx node index.js
```

**Note:** Pings (@SolanaRemix) are only added when:
1. `BOT_PINGS_ENABLED=true` is set
2. Repository owner is `SolanaRemix`

## 📊 Output

### Console Output

The bot logs all operations to console with color-coded status:
- 🔍 Searching repositories
- ✅ Repository matches criteria
- ❌ Repository filtered out
- 📝 Would create PR (dry-run)
- ✅ PR created (live mode)

### Summary JSON

After each run, a summary is saved to `node/logs/summary.json`:

```json
{
  "timestamp": "2024-12-31T02:00:00.000Z",
  "dry_run": true,
  "bot_pings_enabled": false,
  "repos_scanned": 25,
  "repos_matched": 5,
  "prs_created": 0,
  "prs_would_create": 3,
  "allowlist_orgs": [],
  "max_prs_per_run": 3
}
```

## 🔧 Configuration File

The bot respects settings in `config/repair.json`:

```json
{
  "auto_apply": false,
  "dry_run_default": true,
  "allowlist_orgs": [],
  "max_prs_per_run": 3,
  "pings_enabled": false
}
```

## 🛡️ Safety Features

### Rate Limiting
- Respects GitHub API rate limits
- Automatic backoff on rate limit errors
- Conservative request patterns

### PR Safeguards
- All PRs created as **drafts**
- Never merges automatically
- Clear safety checklist in PR body
- Evidence sections for review

### Error Handling
- Graceful failure on API errors
- Comprehensive error logging
- No partial states left behind

## 🚦 How to Enable Bot Pings

Bot pings are **disabled by default** for ethical reasons. To enable:

1. Set environment variable:
   ```bash
   export BOT_PINGS_ENABLED=true
   ```

2. Ensure repository owner is `SolanaRemix`

3. Run the bot:
   ```bash
   DRY_RUN=false GH_TOKEN=xxx node index.js
   ```

**Important:** Pings will only appear in:
- Summary JSON (`node/logs/summary.json`)
- When owner is `SolanaRemix`
- Never spam multiple people

## 🎨 Customization

### Search Keywords

Modify search behavior:

```bash
SEARCH_KEYWORDS="solana anchor rust spl" node index.js
```

### Star Threshold

Target more active repositories:

```bash
STAR_THRESHOLD=100 node index.js
```

### PR Limits

Adjust PR creation limits:

```bash
MAX_PRS_PER_RUN=5 DRY_RUN=false GH_TOKEN=xxx node index.js
```

## 📚 Further Reading

- [PR Template](../PR_TEMPLATE.md) - Template used for bot-generated PRs
- [Node System Overview](../README.md) - Full node system documentation
- [SmartBrain Orchestrator](../../scripts/master.sh) - Multi-agent CLI

## 🐛 Troubleshooting

### No PRs Created in Live Mode

Check:
1. Is `DRY_RUN=false` set?
2. Is `GH_TOKEN` valid with correct scopes?
3. Have you hit the `MAX_PRS_PER_RUN` limit?
4. Do repositories meet the filter criteria?

### Rate Limit Errors

Wait for rate limit reset or:
1. Use authenticated requests (provide `GH_TOKEN`)
2. Reduce `MAX_PRS_PER_RUN`
3. Add delays between operations

### Permission Errors

Ensure `GH_TOKEN` has:
- `repo` scope (for private repos)
- `public_repo` scope (for public repos)
- `pull_request` scope (for creating PRs)

## 📞 Support

Issues? Questions? See the main repository README or open an issue on GitHub.

---

**Remember:** Always test in dry-run mode first! 🔒
