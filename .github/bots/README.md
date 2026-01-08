# Node BOT Templates

This directory contains configuration templates for SmartBrain autonomous agents (BOTs).

## Available Agents

### Agent A - Code Auditor
**File:** `agent-a-auditor.json`
- **Purpose:** Automated code quality and compliance auditing
- **Capabilities:** TypeScript/JavaScript/Solidity analysis, type checking, best practices enforcement
- **Mode:** Non-destructive (DRY_RUN=true by default)

### Agent B - Fixer & Optimizer
**File:** `agent-b-healer.json`
- **Purpose:** Automated issue detection and healing
- **Capabilities:** Port cleanup, dependency synchronization, build optimization
- **Mode:** Non-destructive (DRY_RUN=true by default)

### Agent X - Antivirus & Security Scanner
**File:** `agent-x-antivirus.json`
- **Purpose:** Security vulnerability detection and malware scanning
- **Capabilities:** Pattern matching for malicious code, secret detection, archive scanning
- **Mode:** Non-destructive (DRY_RUN=true by default)

## Configuration Structure

Each BOT configuration includes:

```json
{
  "name": "bot-name",
  "version": "1.0.0",
  "description": "Bot description",
  "type": "audit|heal|security",
  "config": {
    "dryRun": true,  // ALWAYS true by default
    // ... type-specific config
  },
  "triggers": {
    "events": [],
    "branches": [],
    "schedule": ""
  },
  "notifications": {},
  "reporting": {}
}
```

## Usage

These templates are referenced by:
1. GitHub Actions workflows (`.github/workflows/gitantivirus.yml`)
2. SmartBrain orchestrator (`scripts/master.sh`)
3. CI/CD pipeline automation

## Security Notes

⚠️ **IMPORTANT**: All BOTs operate in DRY_RUN mode by default
- No destructive operations are performed without explicit approval
- All changes are logged to `SMARTBRAIN.log`
- Suspicious files are quarantined to `.quarantine/` for review
- No secrets or credentials should be stored in these configurations

## Customization

To customize a BOT:
1. Copy the template to a new file
2. Modify the configuration parameters
3. Ensure `dryRun: true` remains set
4. Test in a safe environment before production use

## Integration

BOTs integrate with:
- GitHub Actions for CI/CD
- SmartBrain orchestrator for local execution
- Monitoring and alerting systems
- Security scanning tools
