# 🤖 GitAntivirus Bot - Automated Security Scanner (TEMPLATE)

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    🛡️  GitAntivirus Bot System                           ║
║                 Automated Smart Contract Security Scanner                 ║
║                              ⚠️  TEMPLATE ⚠️                               ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

## ⚠️ Important Notice

**This is a TEMPLATE implementation.** The bot includes placeholder code for PR creation that requires full implementation before it can create actual pull requests. The `createDraftPR()` function in `index.js` is a stub that needs to be completed with:

1. Repository forking logic
2. Branch creation
3. Commit and push operations
4. Actual PR creation via GitHub API

See inline comments in `index.js` for implementation details.

## 🎯 Overview

The GitAntivirus Bot automatically scans GitHub repositories for smart contract vulnerabilities, dependency issues, and security risks. It creates draft pull requests with security fixes while respecting safety boundaries.

## ⚙️ Default Behavior

**🧪 DRY-RUN MODE IS ENABLED BY DEFAULT**

The bot runs in **safe, read-only mode** by default:
- ✅ Searches and analyzes repositories
- ✅ Generates security reports
- ✅ Logs findings to `node/logs/summary.json`
- ❌ Does NOT create PRs or issues
- ❌ Does NOT ping maintainers
- ❌ Does NOT modify repositories

## 🔐 Environment Variables

### Required
- `GH_TOKEN` or `GITHUB_TOKEN` - GitHub personal access token (for write operations)

### Optional
- `DRY_RUN` (default: `true`) - Set to `false` for live operations
- `BOT_PINGS_ENABLED` (default: `false`) - Enable notifications
- `ALLOWLIST_ORGS` (default: empty) - Comma-separated list of allowed orgs
- `MAX_PRS_PER_RUN` (default: `3`) - Maximum PRs to create per run
- `STAR_THRESHOLD` (default: `10`) - Minimum stars for repo consideration
- `SEARCH_KEYWORDS` (default: `"smart contract,solidity,audit"`) - Search terms

## 📋 Configuration Examples

### Dry-Run Mode (Default)
```bash
# Just analyze, don't create PRs
node index.js
```

### Enable Live Operations
```bash
# Create actual PRs (requires GH_TOKEN with write access)
DRY_RUN=false GH_TOKEN=$YOUR_TOKEN node index.js
```

### Enable Notifications
```bash
# Enable pings (only for SolanaRemix org)
BOT_PINGS_ENABLED=true DRY_RUN=false GH_TOKEN=$YOUR_TOKEN node index.js
```

### Allowlist Specific Organizations
```bash
# Only scan specific organizations
ALLOWLIST_ORGS="SolanaRemix,smsdao" node index.js
```

## 🎭 Ethics & Safety

### Safety Mechanisms
1. **Dry-Run Default:** Bot is safe by default
2. **Rate Limiting:** Limited PRs per run prevent spam
3. **Allowlist System:** Respect organizational boundaries
4. **Opt-in Pings:** Notifications require explicit enablement
5. **Draft PRs Only:** All PRs created as drafts for review

### Best Practices
- ✅ Always test with `DRY_RUN=true` first
- ✅ Review generated PRs before enabling live mode
- ✅ Use minimal token permissions (repo, PR write only)
- ✅ Monitor logs for unexpected behavior
- ✅ Respect repository maintainer preferences
- ❌ Never spam repositories with PRs
- ❌ Never enable pings without permission
- ❌ Never use tokens with excessive permissions

## 🔔 Enabling Pings

**Pings are DISABLED by default** and only work when:
1. `BOT_PINGS_ENABLED=true` is explicitly set
2. Repository owner is `SolanaRemix`
3. A write-enabled token is provided

When enabled, the bot mentions:
- @SolanaRemix (organization)
- @smsdao (team)
- @SmartBrain (system account)

**⚠️ Only enable pings in repositories you own or have permission to notify!**

## 📊 Output

The bot generates:
- `node/logs/summary.json` - Detailed scan results
- Console logs with analysis details
- Draft PR bodies using `node/PR_TEMPLATE.md`

## 🚀 Quick Start

```bash
# Install dependencies
cd node/bot
pnpm install

# Run in safe mode (default)
pnpm start

# Run with custom settings
DRY_RUN=false GH_TOKEN=$TOKEN pnpm start
```

## 📁 File Structure

```
node/
├── bot/
│   ├── index.js          # Main bot logic
│   ├── package.json      # Dependencies
│   └── README.md         # This file
├── logs/
│   └── summary.json      # Scan results
├── PR_TEMPLATE.md        # PR body template
├── node.yml              # Workflow template
└── README.md             # Node system overview
```

## 🛠️ Development

```bash
# Install dev dependencies
pnpm install

# Run linter
pnpm lint

# Test dry-run
DRY_RUN=true node index.js

# Test with verbose logging
DEBUG=* node index.js
```

## ❓ Troubleshooting

### Bot doesn't create PRs
- ✅ Check `DRY_RUN` is set to `false`
- ✅ Verify `GH_TOKEN` has write permissions
- ✅ Confirm repositories match allowlist (if set)

### Pings not working
- ✅ Check `BOT_PINGS_ENABLED=true` is set
- ✅ Verify repository owner is `SolanaRemix`
- ✅ Ensure token has repo write access

### Rate limit errors
- ✅ Reduce `MAX_PRS_PER_RUN` value
- ✅ Add delays between operations
- ✅ Use authenticated requests (not anonymous)

## 📞 Support

For issues, questions, or contributions:
- See [autom/onboarding.md](../../autom/onboarding.md)
- Check [docs/security.md](../../docs/security.md)
- Review [docs/usage.md](../../docs/usage.md)

---

```
═══════════════════════════════════════════════════════════════════════════
🤖 GitAntivirus Bot - Safe by Default | Powerful When Enabled
═══════════════════════════════════════════════════════════════════════════
```

*Built with ❤️ for security and 🛡️ for safety*
