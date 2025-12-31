---
title: "GitAntivirus Automation System"
description: "Overview of the GitAntivirus automation components and workflows"
tags: ["automation", "gitantivirus", "security"]
---

# 🤖 GitAntivirus Automation

## Overview

GitAntivirus provides a comprehensive automation system for smart contract security scanning, auditing, and remediation.

## Components

### 1. SmartBrain Orchestrator

Central command and control system for coordinating security agents.

**Location:** `scripts/master.sh`

**Capabilities:**
- Multi-agent coordination (Agents A-F)
- Repository scanning and analysis
- Dependency auditing
- Health monitoring
- Automated reporting

### 2. Node Bot

Distributed scanning node for GitHub repository discovery and automated PR creation.

**Location:** `node/bot/index.js`

**Capabilities:**
- Repository search and discovery
- Security issue detection
- Automated fix generation
- Draft PR creation
- Allowlist management

### 3. GitHub Actions Integration

CI/CD pipelines for continuous security monitoring.

**Location:** `.github/workflows/gitantivirus.yml`

**Triggers:**
- Pull requests (opened, synchronized)
- Push to main/develop
- Scheduled scans (daily)
- Manual workflow dispatch

## Safety Features

All automation components include:
- ✅ Dry-run mode by default
- ✅ No hardcoded secrets
- ✅ Allowlist filtering
- ✅ Rate limiting
- ✅ Comprehensive logging
- ✅ Opt-in notifications

## Quick Commands

```bash
# Full security scan
./scripts/master.sh full

# Run node bot (dry-run)
cd node/bot && pnpm start

# Deploy with safety checks
./scripts/deploy-caster.sh --dry-run
```

## Configuration

See [onboarding.md](./onboarding.md) for detailed setup instructions.
