---
title: "System Architecture - CuberAi GitAntivirus"
description: "Technical architecture and design of the SmartBrain orchestrator and GitAntivirus automation system"
tags: [architecture, design, technical, system-design, smartbrain]
seo_keywords: "smart contract security architecture, automated scanning system, devsecops design"
geo:
  country: "global"
---

# 🏗️ System Architecture

## Overview

The **CuberAi GitAntivirus** system is built on a modular, multi-agent architecture designed for security, scalability, and ease of use. This document describes the technical design and architecture decisions.

## 🎯 Design Principles

1. **Safety First**: All operations default to non-destructive behavior (DRY_RUN=true)
2. **Modularity**: Independent agents that can work separately or together
3. **Transparency**: Comprehensive logging and reporting
4. **Flexibility**: Configuration via environment variables and config files
5. **Security**: No secrets in code, all tokens via environment

## 🧱 System Components

### 1. SmartBrain Orchestrator (`scripts/master.sh`)

The core command-line interface built with Bash, providing six specialized agents:

```
┌─────────────────────────────────────────────────────────┐
│                 SmartBrain Orchestrator                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Agent A  │  │ Agent B  │  │ Agent C  │            │
│  │  Scan    │  │  Audit   │  │  Health  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Agent D  │  │ Agent E  │  │ Agent F  │            │
│  │  Repair  │  │  Deploy  │  │Orchestrate│            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Agent A: Scan
- **Purpose**: Workspace discovery and file scanning
- **Input**: Workspace path
- **Output**: JSON log with file counts and types
- **Mode**: Read-only

#### Agent B: Audit
- **Purpose**: Security vulnerability detection
- **Input**: Project files and dependencies
- **Output**: JSON log with audit results
- **Tools**: npm/pnpm audit, cargo audit (when available)
- **Mode**: Read-only

#### Agent C: Health
- **Purpose**: System health monitoring
- **Input**: System environment
- **Output**: JSON log with tool versions and status
- **Mode**: Read-only

#### Agent D: Repair
- **Purpose**: Automated security fixes
- **Input**: config/repair.json, workspace
- **Output**: JSON log with repair actions
- **Mode**: Read or write (based on config)

#### Agent E: Deploy
- **Purpose**: Deployment preparation and validation
- **Input**: Build artifacts, environment config
- **Output**: JSON log with deployment status
- **Mode**: Configurable

#### Agent F: Orchestrate
- **Purpose**: Coordinate multiple agents
- **Flow**: Scan → Audit → Health
- **Output**: Combined results
- **Mode**: Delegates to other agents

### 2. GitAntivirus Workflow (`.github/workflows/gitantivirus.yml`)

GitHub Actions workflow for CI/CD integration:

```
┌──────────────────────────────────────────────────────┐
│              GitAntivirus Workflow                   │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Trigger: PR / Push / Manual                        │
│      ↓                                              │
│  1. Checkout                                        │
│      ↓                                              │
│  2. Setup Node.js + pnpm                            │
│      ↓                                              │
│  3. Install dependencies                             │
│      ↓                                              │
│  4. Make scripts executable                          │
│      ↓                                              │
│  5. Run SmartBrain agents:                          │
│     - SMSDAO Repair (dry-run)                       │
│     - Scan                                           │
│     - Audit                                          │
│     - Health                                         │
│      ↓                                              │
│  6. Upload artifacts                                 │
│      ↓                                              │
│  7. Add PR labels                                    │
│      ↓                                              │
│  8. Post PR comment (sticky)                        │
│      ↓                                              │
│  9. Add to project board (optional)                 │
│      ↓                                              │
│  10. Generate summary                                │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 3. Node Bot System (`node/`)

Automated GitHub repository scanner built with Node.js:

```
┌──────────────────────────────────────────────────────┐
│                   Node Bot System                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────┐          │
│  │  index.js (Main Bot)                 │          │
│  │  - Search GitHub repos                │          │
│  │  - Filter by criteria                 │          │
│  │  - Generate PRs (draft only)          │          │
│  └──────────────────────────────────────┘          │
│           ↓                                         │
│  ┌──────────────────────────────────────┐          │
│  │  @octokit/rest                        │          │
│  │  - GitHub API client                  │          │
│  │  - Rate limiting                       │          │
│  │  - Error handling                      │          │
│  └──────────────────────────────────────┘          │
│           ↓                                         │
│  ┌──────────────────────────────────────┐          │
│  │  PR_TEMPLATE.md                       │          │
│  │  - Standard PR body                   │          │
│  │  - Safety checklist                   │          │
│  │  - Evidence sections                  │          │
│  └──────────────────────────────────────┘          │
│           ↓                                         │
│  ┌──────────────────────────────────────┐          │
│  │  logs/summary.json                    │          │
│  │  - Execution summary                  │          │
│  │  - Stats and metrics                  │          │
│  └──────────────────────────────────────┘          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 4. Deployment Tools (`scripts/`)

#### deploy-caster.sh
- **Purpose**: Deploy to ENS on Base network
- **Input**: CASTER_KEY, PROVIDER_URL, artifact path
- **Output**: Deployment status
- **Safety**: DRY_RUN by default

#### update-talents.sh
- **Purpose**: Build deployment artifacts
- **Input**: package.json, source files
- **Output**: build/talents.json
- **Safety**: DRY_RUN by default

### 5. Configuration System

```
config/
└── repair.json          # Bot configuration
    ├── auto_apply       # Enable automatic repairs
    ├── dry_run_default  # Default dry-run mode
    ├── allowlist_orgs   # Allowed organizations
    ├── max_prs_per_run  # PR creation limit
    └── pings_enabled    # Enable bot mentions
```

## 🔄 Data Flow

### Scan Flow
```
User/CI → master.sh scan → File system → JSON log → Artifacts
```

### Audit Flow
```
User/CI → master.sh audit → Package managers → JSON log → Artifacts
```

### Bot Flow
```
Scheduler → bot/index.js → GitHub API → Filter → PR Template → Draft PR
                                                      ↓
                                                 logs/summary.json
```

### CI/CD Flow
```
PR/Push → GitHub Actions → GitAntivirus Workflow → SmartBrain Agents
              ↓
          Artifacts + PR Comments + Labels
```

## 🔐 Security Architecture

### Secrets Management
- ❌ No secrets in code
- ✅ Environment variables only
- ✅ GitHub repository secrets for CI/CD
- ✅ Local environment for manual runs

### Permission Model
- **Workflow permissions**: contents:write, pull-requests:write
- **Bot token scopes**: repo, pull_request (optional)
- **Default mode**: Read-only (DRY_RUN=true)

### Allowlist System
```javascript
// config/repair.json
{
  "allowlist_orgs": ["SolanaRemix", "smsdao", "gxqstudio"]
}
```

Only repositories from allowlisted organizations are targeted.

## 📊 Logging Architecture

### Log Format
All logs use consistent JSON structure:
```json
{
  "timestamp": "ISO 8601",
  "workspace": "path",
  "dry_run": boolean,
  "operation_specific_data": {}
}
```

### Log Storage
- **Local**: `logs/` directory
- **CI/CD**: GitHub Actions artifacts
- **Retention**: 30 days (configurable)

### Log Types
- `scan-*.json`: Workspace scan results
- `audit-*.json`: Security audit results
- `health-*.json`: System health status
- `repair-*.json`: Repair operations log
- `deploy-*.json`: Deployment status
- `summary.json`: Bot execution summary

## 🌐 Web Control Panel (`web/`)

Lightweight GitHub Pages dashboard:

```
web/
├── index.html          # Dashboard shell
├── billing.html        # Order page (Stripe placeholder)
└── README.md          # Deployment guide
```

**Technology Stack**:
- HTML5
- Tailwind CSS (CDN)
- Vanilla JavaScript
- No backend (static only)

## 🔌 Integration Points

### GitHub API
- Repository search
- PR creation
- Issue management
- Artifacts upload

### Package Managers
- npm/pnpm audit
- cargo audit
- Custom scanners (extensible)

### External Services (Optional)
- Caster (ENS deployment)
- GitHub Projects
- Stripe (billing placeholder)

## 📈 Scalability Considerations

### Rate Limiting
- GitHub API: 5000 req/hr (authenticated)
- Bot limit: 3 PRs per run (configurable)
- Automatic backoff on rate limit errors

### Parallel Processing
- Agents can run independently
- Workflow steps run sequentially (by design)
- Bot processes repos sequentially (safe)

### Resource Usage
- SmartBrain: Minimal (Bash script)
- Node Bot: Low (Node.js, single process)
- Workflow: GitHub's runners (managed)

## 🔧 Extensibility

### Adding New Agents
```bash
# In scripts/master.sh

agent_new() {
    log_info "🆕 Agent NEW: Description..."
    # Implementation
}

# Add to case statement
case "$COMMAND" in
    new)
        agent_new
        ;;
esac
```

### Custom Workflows
Copy and modify `.github/workflows/gitantivirus.yml`:
- Change triggers
- Add custom steps
- Modify agent sequence

### Bot Customization
Edit `node/bot/index.js`:
- Change search keywords
- Adjust filter criteria
- Customize PR template

## 🧪 Testing Strategy

### Unit Testing (Future)
- Agent functions
- Bot logic
- Helper utilities

### Integration Testing
- Workflow validation
- End-to-end bot flow
- CI/CD pipeline

### Manual Testing
- Dry-run mode testing
- Live mode (controlled)
- Multiple repository types

## 📊 Monitoring

### Metrics Collected
- Scan counts (files, contracts, configs)
- Audit findings
- Health status
- Repair actions
- PR statistics

### Observability
- Console output (color-coded)
- JSON logs (machine-readable)
- GitHub Actions summary
- Artifacts (downloadable)

## 🚀 Deployment Architecture

### GitHub Pages (Static Site)
```
Repository → GitHub Pages → web/ directory
```

### ENS Deployment (Caster)
```
Artifacts → deploy-caster.sh → Caster → Base Network → ENS
```

## 📝 Configuration Hierarchy

Priority (highest to lowest):
1. Command-line flags (`--dry-run`, `--live`)
2. Environment variables (`DRY_RUN`, `VERBOSE`)
3. Config file (`config/repair.json`)
4. Built-in defaults (safe by design)

## 🔄 Future Enhancements

### Planned Features
- [ ] Database integration for history
- [ ] Advanced analytics dashboard
- [ ] Real-time monitoring
- [ ] Slack/Discord notifications
- [ ] Custom rule engine
- [ ] Machine learning integration

### Extensibility Points
- Plugin system for custom agents
- Webhook support for external integrations
- Custom report generators
- Multi-language support

---

**Architecture Version**: 1.0.0  
**Last Updated**: 2024-12-31  
**Maintainer**: SmartContractAudit Team
