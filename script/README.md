# Script Directory

This directory contains automation scripts for the SmartContractAudit system.

## Scripts

### scan.js
Main scanning script for running contract and wallet audits.

**Usage:**
```bash
node scan.js --address <address> --chain <chain> [options]
```

**Options:**
- `--address` - Contract or wallet address to scan
- `--chain` - Blockchain network (ethereum, bsc, polygon, etc.)
- `--modules` - Comma-separated list of modules to use
- `--output` - Output format (json, html, pdf)
- `--depth` - Trace depth for wallet scanning
- `--file` - File containing addresses to scan

### notify.js
Sends notifications to configured channels (Slack, Discord, Telegram, Email).

**Usage:**
```bash
node notify.js --message "<message>" --severity <level>
node notify.js --report <path-to-report>
```

**Options:**
- `--message` - Notification message
- `--severity` - Severity level (critical, high, medium, low, info)
- `--report` - Path to scan report JSON

### repair.js
Auto-repair engine that generates fixes for detected vulnerabilities.

**Usage:**
```bash
node repair.js --report <path-to-report> --source <path-to-source>
```

**Options:**
- `--report` - Path to scan report JSON
- `--source` - Path to source code file
- `--create-pr` - Create pull request with fixes

## Automation

These scripts are used by GitHub Actions workflows for:
- Continuous monitoring (Auditor Bot)
- Automated repairs (Auto-Repair)
- PR security checks
- Deep scans

## Examples

**Scan a contract:**
```bash
node scan.js --address 0x123... --chain ethereum
```

**Send notification:**
```bash
node notify.js --message "Critical vulnerability detected" --severity critical
```

**Generate fixes:**
```bash
node repair.js --report reports/latest.json --source contracts/Token.sol
```

## Integration

Scripts can be integrated into:
- CI/CD pipelines
- Cron jobs
- Custom automation workflows
- Monitoring systems
