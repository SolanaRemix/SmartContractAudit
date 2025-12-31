# SmartBrain Orchestrator Documentation

## Overview

The SmartBrain Orchestrator (`scripts/master.sh`) is a comprehensive automation framework that coordinates multiple autonomous agents to maintain code quality, security, and system health.

## Architecture

### Multi-Agent System

```
SmartBrain Orchestrator
├── Agent A: Code Auditor
├── Agent B: Fixer & Optimizer
├── Agent C: Security & Compliance
├── Agent F: Health Monitor
└── Agent X: Antivirus Scanner
```

### Agent Responsibilities

#### Agent A - Code Auditor
- **Purpose**: Automated code quality analysis
- **Operations**:
  - Runs audit scripts
  - Executes linting
  - Performs testing
  - Generates audit reports
- **Output**: `AUDIT-REPORT.md`

#### Agent B - Fixer & Optimizer
- **Purpose**: System maintenance and optimization
- **Operations**:
  - Cleans hanging processes on ports 3000-3010, 4000
  - Ensures dependency synchronization
  - Runs healing scripts
  - Optimizes build processes
- **Safety**: Non-destructive, requires confirmation for port cleanup

#### Agent C - Security & Compliance
- **Purpose**: Smart contract and code security
- **Operations**:
  - Runs integrity checks
  - Validates ABI ↔ SDK consistency
  - Audits smart contracts
  - Checks for security vulnerabilities
- **Focus**: Reentrancy, zero-address validation, best practices

#### Agent F - Health Monitor
- **Purpose**: Continuous health monitoring
- **Operations**:
  - Runs linting
  - Executes test suites
  - Performs type checking
  - Validates build integrity
- **Output**: Health status logs

#### Agent X - Antivirus Scanner
- **Purpose**: Security threat detection
- **Operations**:
  - Scans for suspicious code patterns
  - Detects potential malware
  - Flags archives for review
  - Quarantines suspicious files
- **Output**: Quarantine reports in `.quarantine/`

## Usage

### Basic Commands

```bash
# Make executable (first time only)
chmod +x scripts/master.sh

# Run full audit
scripts/master.sh audit

# Run healing sequence
scripts/master.sh heal

# Check integrity
scripts/master.sh integrity

# Perform health check
scripts/master.sh health

# Run antivirus scan
scripts/master.sh scan

# Display help
scripts/master.sh help
```

### Command Details

#### audit
Runs a comprehensive audit including:
1. Dependency installation
2. Audit script execution
3. Linting
4. Testing
5. Building
6. Report generation

**When to use**: Before releases, after major changes, weekly maintenance

#### heal
Executes healing operations:
1. Port cleanup
2. Dependency synchronization
3. Neo healer execution
4. CastQuest healer execution

**When to use**: After crashes, stuck processes, dependency issues

#### integrity
Validates repository integrity:
1. ABI consistency checks
2. SDK synchronization
3. Contract validation

**When to use**: After contract updates, before deployment

#### health
Performs health diagnostics:
1. Linting all code
2. Running test suites
3. Type checking
4. Build validation

**When to use**: Pre-commit, CI/CD pipeline, regular monitoring

#### scan
Executes security scanning:
1. Pattern-based malware detection
2. Suspicious file identification
3. Archive flagging
4. Quarantine reporting

**When to use**: Daily, after pulling changes, before deployment

## Configuration

### Environment Variables

```bash
# Package manager (default: pnpm)
PNPM=pnpm

# Dry run mode (default: true)
DRY_RUN=true

# Custom paths
ROOT_DIR=/path/to/project
AUDIT_SCRIPT=/path/to/audit.sh
```

### Logging

All operations are logged to `SMARTBRAIN.log` with format:
```
[TIMESTAMP][AGENT][LEVEL] MESSAGE
```

Example:
```
[2025-12-31T01:00:00+00:00][AgentX][ALERT] Suspicious pattern in file.js
```

### Log Levels

- **INFO**: Informational messages
- **WARN**: Warning conditions
- **ERROR**: Error conditions
- **ALERT**: Security alerts

## Safety Features

### Non-Destructive Design

- **DRY_RUN mode**: Enabled by default
- **Graceful failures**: Continues on non-critical errors
- **Confirmation prompts**: For destructive operations
- **Rollback capability**: Maintains state for recovery

### Port Cleanup Safety

Ports cleaned:
- 3000-3010 (development servers)
- 4000 (additional server)

**Warning**: May affect other running services on these ports

### Quarantine System

Suspicious files are:
1. Detected during scan
2. Logged to `SMARTBRAIN.log`
3. Listed in `.quarantine/suspicious-files.txt`
4. **Not automatically deleted** (manual review required)

## Integration

### CI/CD Integration

#### GitHub Actions

```yaml
- name: Run SmartBrain Health Check
  run: |
    chmod +x scripts/master.sh
    scripts/master.sh health

- name: Run Security Scan
  run: scripts/master.sh scan
```

#### GitLab CI

```yaml
smartbrain:health:
  script:
    - chmod +x scripts/master.sh
    - scripts/master.sh health
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Running SmartBrain health check..."
scripts/master.sh health

if [ $? -ne 0 ]; then
  echo "Health check failed. Commit aborted."
  exit 1
fi
```

### Scheduled Execution

#### Cron (Linux/macOS)

```cron
# Daily audit at 2 AM
0 2 * * * cd /path/to/project && scripts/master.sh audit

# Hourly health check
0 * * * * cd /path/to/project && scripts/master.sh health
```

#### Task Scheduler (Windows)

Use Task Scheduler with:
```powershell
bash -c "cd /path/to/project && scripts/master.sh scan"
```

## Troubleshooting

### Common Issues

#### Permission Denied

```bash
# Fix: Make executable
chmod +x scripts/master.sh
```

#### Port Already in Use

```bash
# Solution: Run heal command
scripts/master.sh heal
```

#### Dependencies Out of Sync

```bash
# Solution: Run heal with fresh install
rm -rf node_modules pnpm-lock.yaml
scripts/master.sh heal
```

#### Audit Script Missing

Create stub scripts if not present:
```bash
mkdir -p scripts
touch scripts/audit.sh
chmod +x scripts/audit.sh
```

### Debug Mode

Enable verbose output:

```bash
# Set debug environment
export DEBUG=1

# Run with bash -x
bash -x scripts/master.sh scan
```

### Log Analysis

```bash
# View recent errors
grep ERROR SMARTBRAIN.log | tail -20

# Filter by agent
grep "AgentX" SMARTBRAIN.log

# Check today's logs
grep "$(date +%Y-%m-%d)" SMARTBRAIN.log
```

## Performance

### Optimization Tips

1. **Parallel builds**: Enabled by default with pnpm
2. **Frozen lockfile**: Faster installs in CI
3. **Incremental checks**: Only scan changed files
4. **Cache usage**: Leverage pnpm's content-addressable storage

### Resource Usage

Typical resource consumption:
- **CPU**: Low to moderate (during builds)
- **Memory**: 512MB - 2GB
- **Disk I/O**: Moderate (during scans)
- **Network**: Minimal (only for dependency fetches)

## Extending SmartBrain

### Adding Custom Agents

1. Create agent function:
```bash
cmd_custom_agent() {
  log "Starting custom agent..."
  smartbrain_log "AgentCustom" "INFO" "Custom operation started."
  
  # Your logic here
  
  smartbrain_log "AgentCustom" "INFO" "Custom operation complete."
}
```

2. Add to dispatcher:
```bash
main() {
  case "${1:-help}" in
    # ... existing cases ...
    custom) cmd_custom_agent ;;
  esac
}
```

### Custom Scan Patterns

Modify `scan_file_for_suspicious_patterns`:

```bash
scan_file_for_suspicious_patterns() {
  local file="$1"
  
  # Add custom patterns
  if grep -Eqi "your-pattern-here" "$file" 2>/dev/null; then
    smartbrain_log "AgentX" "ALERT" "Custom pattern in $file."
    echo "$file" >> "$QUARANTINE_DIR/custom-matches.txt"
  fi
}
```

## Best Practices

### Daily Workflow

```bash
# Morning: Health check
scripts/master.sh health

# Before commit: Scan
scripts/master.sh scan

# Weekly: Full audit
scripts/master.sh audit
```

### Release Checklist

- [ ] Run full audit: `scripts/master.sh audit`
- [ ] Verify health: `scripts/master.sh health`
- [ ] Check integrity: `scripts/master.sh integrity`
- [ ] Security scan: `scripts/master.sh scan`
- [ ] Review quarantine: `cat .quarantine/suspicious-files.txt`
- [ ] Check logs: `grep ERROR SMARTBRAIN.log`

### Maintenance Schedule

| Frequency | Task | Command |
|-----------|------|---------|
| Hourly | Health check | `health` |
| Daily | Security scan | `scan` |
| Weekly | Full audit | `audit` |
| Monthly | Integrity check | `integrity` |
| As needed | Healing | `heal` |

## Support

### Getting Help

1. Check logs: `cat SMARTBRAIN.log`
2. Review quarantine: `ls -la .quarantine/`
3. Run help: `scripts/master.sh help`
4. Open issue: [GitHub Issues](https://github.com/SolanaRemix/SmartContractAudit/issues)

### Contributing

Contributions welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

**SmartBrain**: Autonomous • Secure • Non-destructive 🧠🔒
