# User Guide

## Getting Started

Welcome to SmartContractAudit! This guide will help you get started with auditing and monitoring smart contracts across multiple blockchain networks.

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

### Setup

1. Clone the repository:
```bash
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment:
```bash
cp .env.example .env
```

Edit `.env` and add your RPC endpoints and API keys.

4. Configure chains:
Edit `config/chains.json` to add your blockchain RPC endpoints.

## Basic Usage

### Scanning a Contract

To scan a smart contract for vulnerabilities:

```bash
npm run scan -- --address 0x1234... --chain ethereum
```

Options:
- `--address`: Contract address to scan
- `--chain`: Blockchain network (ethereum, bsc, polygon, solana, etc.)
- `--modules`: Specific modules to run (antivirus,spam,honeypot,tracer)
- `--output`: Output format (json, html, pdf)

Example:
```bash
npm run scan -- \
  --address 0x1234567890123456789012345678901234567890 \
  --chain ethereum \
  --modules antivirus,honeypot \
  --output json
```

### Checking for Honeypots

To quickly check if a token is a honeypot:

```bash
npm run honeypot -- --address 0x1234... --chain bsc
```

### Tracing Wallet Deposits

To trace deposits to their source:

```bash
npm run trace -- --address 0x1234... --chain ethereum --depth 5
```

Options:
- `--depth`: How many levels to trace back (default: 5)
- `--min-amount`: Minimum deposit amount to include

### Deep Wallet Scan

To perform a comprehensive wallet analysis:

```bash
npm run deep-scan -- --address 0x1234... --chain ethereum
```

This will:
- Analyze all transactions
- Identify counterparties
- List all tokens and NFTs
- Calculate risk factors
- Generate a detailed report

## Advanced Features

### Batch Scanning

Create a file `addresses.txt` with one address per line, then:

```bash
npm run batch-scan -- --file addresses.txt --chain ethereum
```

### Continuous Monitoring

Set up continuous monitoring for specific contracts:

```bash
npm run monitor -- --address 0x1234... --chain ethereum --interval 300
```

This will scan the contract every 5 minutes (300 seconds) and alert on changes.

### Custom Rules

Create custom detection rules in `config/rules.json`:

```json
{
  "customRules": [
    {
      "name": "High Value Transfer",
      "type": "transaction",
      "condition": "value > 100 ETH",
      "severity": "warning",
      "action": "notify"
    }
  ]
}
```

## Reports

### Viewing Reports

All scan reports are saved in the `reports/` directory.

- JSON reports: `reports/json/`
- HTML reports: `reports/html/`
- PDF reports: `reports/pdf/`

### Understanding Report Scores

**Risk Score (0-100):**
- 0-20: Safe
- 21-40: Low risk
- 41-60: Medium risk
- 61-80: High risk
- 81-100: Critical

**Vulnerability Severity:**
- **Critical**: Immediate action required, funds at risk
- **High**: Significant risk, should be addressed urgently
- **Medium**: Moderate risk, address soon
- **Low**: Minor issue, consider addressing

## Automated Workflows

### Setting Up GitHub Actions

The project includes automated workflows for:

1. **Continuous Auditing**: Automatically scans contracts on schedule
2. **Auto-Repair**: Creates PRs with vulnerability fixes
3. **Auditor Bot**: Monitors and flags suspicious activity

To enable:

1. Add repository secrets:
   - `ETHEREUM_RPC_URL`
   - `BSC_RPC_URL`
   - `SOLANA_RPC_URL`
   - `NOTIFICATION_WEBHOOK`

2. Enable GitHub Actions in your repository

3. Workflows will run automatically based on triggers

### Manual Workflow Triggers

Trigger workflows manually from GitHub Actions tab:

1. Go to Actions → Select workflow
2. Click "Run workflow"
3. Choose branch and parameters
4. Click "Run workflow"

## Notifications

### Configuring Notifications

Edit `config/notifications.json`:

```json
{
  "email": {
    "enabled": true,
    "recipients": ["admin@example.com"],
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "user": "your-email@gmail.com"
    }
  },
  "slack": {
    "enabled": true,
    "webhook": "https://hooks.slack.com/services/..."
  },
  "telegram": {
    "enabled": false,
    "botToken": "...",
    "chatId": "..."
  }
}
```

### Notification Triggers

Notifications are sent when:
- Critical vulnerabilities are detected
- Honeypots are identified
- Large fund movements are detected
- Automated repairs are created

## Troubleshooting

### Common Issues

**Issue: RPC connection failed**
- Check your RPC endpoint in `config/chains.json`
- Verify API key is correct
- Check rate limits

**Issue: Scan timeout**
- Increase timeout in configuration
- Use faster RPC endpoint
- Reduce scan depth for wallet tracing

**Issue: No vulnerabilities detected**
- Ensure contract is verified on block explorer
- Check that modules are enabled
- Review scanner configuration

### Debug Mode

Enable debug mode for verbose logging:

```bash
DEBUG=* npm run scan -- --address 0x1234... --chain ethereum
```

### Getting Help

- Check [API Documentation](./API.md)
- Review [Architecture](./ARCHITECTURE.md)
- Open an issue on GitHub
- Join our Discord community

## Best Practices

1. **Regular Scans**: Schedule regular scans of your contracts
2. **Monitor Changes**: Set up continuous monitoring for production contracts
3. **Review Reports**: Always review and verify scan results
4. **Update Rules**: Keep detection rules up to date
5. **Test Fixes**: Review automated fixes before merging
6. **Backup Data**: Maintain backups of scan reports

## Examples

### Example 1: Quick Token Safety Check

```bash
# Check if a new token is safe to buy
npm run honeypot -- --address 0xTOKEN_ADDRESS --chain bsc
```

### Example 2: Audit Before Deployment

```bash
# Comprehensive audit before deploying
npm run scan -- \
  --address 0xYOUR_CONTRACT \
  --chain ethereum \
  --modules antivirus,spam \
  --output pdf
```

### Example 3: Investigate Suspicious Wallet

```bash
# Deep investigation of suspicious activity
npm run deep-scan -- \
  --address 0xSUSPICIOUS_WALLET \
  --chain ethereum

npm run trace -- \
  --address 0xSUSPICIOUS_WALLET \
  --chain ethereum \
  --depth 10
```

## Next Steps

- Explore the [API Reference](./API.md) for programmatic access
- Read the [Development Guide](./DEVELOPMENT.md) to extend functionality
- Configure [Workflows](./WORKFLOWS.md) for automation
