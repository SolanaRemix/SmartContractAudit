---
title: "GitAntivirus Architecture"
description: "System architecture and design overview for GitAntivirus"
tags: ["architecture", "design", "system-design"]
seo_keywords: "gitantivirus architecture, smart contract security system, automation architecture"
---

# 🏗️ GitAntivirus Architecture

## System Overview

GitAntivirus is a distributed, automated security scanning system designed to identify and remediate vulnerabilities in smart contract repositories across GitHub.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GitAntivirus System                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐      ┌──────────────────┐                   │
│  │  SmartBrain      │◄────►│  Node Bot        │                   │
│  │  Orchestrator    │      │  System          │                   │
│  └────────┬─────────┘      └────────┬─────────┘                   │
│           │                         │                              │
│           │                         │                              │
│  ┌────────▼─────────────────────────▼─────────┐                   │
│  │         GitHub Actions Workflows           │                   │
│  └────────────────┬───────────────────────────┘                   │
│                   │                                                │
│  ┌────────────────▼───────────────────────────┐                   │
│  │         GitHub Repositories                │                   │
│  │  (Scanned, Analyzed, Improved)             │                   │
│  └────────────────────────────────────────────┘                   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. SmartBrain Orchestrator

**Purpose:** Central command and control for security operations.

**Architecture:**
```
SmartBrain
├── Agent A: Repository Scanner
│   └── File discovery, pattern matching
├── Agent B: Dependency Auditor
│   └── npm/pip audit, vulnerability detection
├── Agent C: Security Analyzer
│   └── Secret scanning, unsafe function detection
├── Agent D: Code Quality Checker
│   └── Linting, code metrics
├── Agent E: Test Coverage Analyzer
│   └── Test discovery, coverage analysis
└── Agent F: Health Monitor
    └── System diagnostics, resource monitoring
```

**Technology:**
- Language: Bash
- Dependencies: None (portable)
- Execution: Local or CI/CD

### 2. Node Bot System

**Purpose:** Automated repository discovery and PR creation.

**Architecture:**
```
Node Bot
├── Search Module
│   └── GitHub API integration
├── Analysis Module
│   └── Security issue detection
├── Filter Module
│   └── Allowlist, star threshold
└── PR Module
    └── Draft PR creation
```

**Technology:**
- Language: Node.js (ES Modules)
- Dependencies: @octokit/rest
- Execution: Scheduled or on-demand

**Data Flow:**
```
GitHub Search → Filter → Analyze → Generate Fix → Create PR (Draft)
     ↓            ↓         ↓           ↓              ↓
  Repo List → Filtered → Issues → PR Body → GitHub API
```

### 3. GitHub Actions Integration

**Purpose:** Continuous integration and security monitoring.

**Workflow Triggers:**
- Pull requests (opened, synchronize)
- Push to protected branches
- Scheduled (cron)
- Manual dispatch

**Pipeline Stages:**
```
1. Checkout → 2. Setup → 3. Install → 4. Scan → 5. Report → 6. Notify
```

## Security Architecture

### Authentication & Authorization

```
┌─────────────────┐
│  GitHub Token   │
│   (Secret)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Permission     │
│  Validation     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Allowlist      │
│  Check          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Operation      │
│  Execution      │
└─────────────────┘
```

### Dry-Run Architecture

All components support dry-run mode:

```
Operation Request
     ↓
Check DRY_RUN Flag
     ↓
┌────┴────┐
│ true    │ false
▼         ▼
Log       Execute
Action    Action
```

### Safety Layers

1. **Input Validation:** All parameters validated
2. **Rate Limiting:** Max operations per run
3. **Allowlist Filtering:** Org/repo restrictions
4. **Dry-Run Default:** Safe by default
5. **Audit Logging:** All operations logged

## Data Architecture

### Log Structure

```json
{
  "timestamp": "ISO-8601",
  "config": {
    "dryRun": true,
    "botPingsEnabled": false,
    "allowlistOrgs": []
  },
  "results": [
    {
      "repo": "owner/name",
      "analysis": { "issues": [], "recommendations": [] },
      "pr": { "created": false, "reason": "dry-run" }
    }
  ],
  "stats": {
    "total": 10,
    "analyzed": 10,
    "prsCreated": 0
  }
}
```

### Configuration Schema

```json
{
  "auto_apply": false,
  "dry_run_default": true,
  "allowlist_orgs": ["org1", "org2"],
  "max_prs_per_run": 3,
  "pings_enabled": false
}
```

## Deployment Architecture

### ENS Deployment Flow

```
Build Artifacts → Validate → Deploy to ENS
     ↓              ↓            ↓
  build/        Artifact     Caster CLI
talents.json    Validation   (gxqstudio.eth)
```

### Network Topology

```
┌─────────────────────────────────────────┐
│         Base Network (Layer 2)          │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │  ENS: gxqstudio.eth             │   │
│  │  ├── Contract Deployment        │   │
│  │  └── Talent Registry            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Provider: https://mainnet.base.org    │
└─────────────────────────────────────────┘
```

## Scalability Considerations

### Horizontal Scaling

- Multiple node bots can run independently
- Each bot respects global rate limits
- Coordination via allowlist configuration

### Performance Optimization

- GitHub API caching
- Parallel repository analysis
- Incremental scanning (delta detection)

### Rate Limiting

```
GitHub API: 5000 requests/hour (authenticated)
Bot Operations: Max 3 PRs/run
Agent Scans: Unlimited (local)
```

## Error Handling

### Failure Modes

1. **Network Failures:** Retry with exponential backoff
2. **API Errors:** Log and continue with next item
3. **Validation Failures:** Skip and report
4. **Permission Errors:** Dry-run fallback

### Recovery Strategies

```
Error Detected
     ↓
Check Severity
     ↓
┌────┴────┐
│ Fatal   │ Recoverable
▼         ▼
Exit      Log & Continue
with      (Retry if needed)
Error
```

## Monitoring & Observability

### Metrics

- Repositories scanned
- Issues detected
- PRs created
- API rate limit usage
- Execution time

### Logging Levels

- **INFO:** Normal operations
- **WARNING:** Non-fatal issues
- **ERROR:** Failures requiring attention
- **DEBUG:** Detailed diagnostics (verbose mode)

## Future Enhancements

1. **Machine Learning:** Pattern recognition for vulnerability detection
2. **Multi-Chain Support:** Expand beyond Solana/EVM
3. **Real-time Monitoring:** WebSocket-based live scanning
4. **Advanced Analytics:** Trend analysis, risk scoring
5. **Community Plugins:** Extensible agent system

---

## Technical Specifications

| Component | Language | Runtime | Dependencies |
|-----------|----------|---------|--------------|
| SmartBrain | Bash | Shell | None |
| Node Bot | JavaScript (ES6+) | Node.js 18+ | @octokit/rest |
| Workflows | YAML | GitHub Actions | Node.js 20 |
| Web UI | HTML/JS | Browser | Tailwind CSS |

---

*Architecture Version: 1.0.0*
*Last Updated: 2025-12-31*
