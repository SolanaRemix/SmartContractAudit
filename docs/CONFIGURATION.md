# Configuration Guide

## Overview

SmartContractAudit uses JSON configuration files to customize behavior across different modules and chains.

## Configuration Files

### chains.json

Location: `config/chains.json`

Defines blockchain network configurations.

```json
{
  "ethereum": {
    "name": "Ethereum Mainnet",
    "rpc": "https://mainnet.infura.io/v3/YOUR_API_KEY",
    "explorer": "https://etherscan.io",
    "apiKey": "YOUR_ETHERSCAN_API_KEY",
    "chainId": 1,
    "type": "evm",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockTime": 12,
    "confirmations": 12
  },
  "bsc": {
    "name": "Binance Smart Chain",
    "rpc": "https://bsc-dataseed1.binance.org",
    "explorer": "https://bscscan.com",
    "apiKey": "YOUR_BSCSCAN_API_KEY",
    "chainId": 56,
    "type": "evm",
    "nativeCurrency": {
      "name": "BNB",
      "symbol": "BNB",
      "decimals": 18
    },
    "blockTime": 3,
    "confirmations": 15
  },
  "polygon": {
    "name": "Polygon",
    "rpc": "https://polygon-rpc.com",
    "explorer": "https://polygonscan.com",
    "apiKey": "YOUR_POLYGONSCAN_API_KEY",
    "chainId": 137,
    "type": "evm",
    "nativeCurrency": {
      "name": "MATIC",
      "symbol": "MATIC",
      "decimals": 18
    },
    "blockTime": 2,
    "confirmations": 128
  },
  "avalanche": {
    "name": "Avalanche C-Chain",
    "rpc": "https://api.avax.network/ext/bc/C/rpc",
    "explorer": "https://snowtrace.io",
    "apiKey": "YOUR_SNOWTRACE_API_KEY",
    "chainId": 43114,
    "type": "evm",
    "nativeCurrency": {
      "name": "AVAX",
      "symbol": "AVAX",
      "decimals": 18
    },
    "blockTime": 2,
    "confirmations": 10
  },
  "arbitrum": {
    "name": "Arbitrum One",
    "rpc": "https://arb1.arbitrum.io/rpc",
    "explorer": "https://arbiscan.io",
    "apiKey": "YOUR_ARBISCAN_API_KEY",
    "chainId": 42161,
    "type": "evm",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockTime": 0.25,
    "confirmations": 1
  },
  "optimism": {
    "name": "Optimism",
    "rpc": "https://mainnet.optimism.io",
    "explorer": "https://optimistic.etherscan.io",
    "apiKey": "YOUR_OPTIMISTIC_ETHERSCAN_API_KEY",
    "chainId": 10,
    "type": "evm",
    "nativeCurrency": {
      "name": "Ether",
      "symbol": "ETH",
      "decimals": 18
    },
    "blockTime": 2,
    "confirmations": 10
  },
  "solana": {
    "name": "Solana Mainnet",
    "rpc": "https://api.mainnet-beta.solana.com",
    "explorer": "https://explorer.solana.com",
    "chainId": "mainnet-beta",
    "type": "solana",
    "nativeCurrency": {
      "name": "SOL",
      "symbol": "SOL",
      "decimals": 9
    }
  }
}
```

### scanner.json

Location: `config/scanner.json`

Configures scanner modules and thresholds.

```json
{
  "antivirus": {
    "enabled": true,
    "threshold": 70,
    "patterns": [
      "reentrancy",
      "overflow",
      "underflow",
      "delegatecall",
      "selfdestruct",
      "tx-origin",
      "unchecked-send"
    ],
    "bytecodeAnalysis": true,
    "sourceAnalysis": true,
    "timeout": 60000
  },
  "spam": {
    "enabled": true,
    "threshold": 80,
    "indicators": [
      "high-frequency-deployment",
      "airdrop-pattern",
      "similar-code",
      "honeypot-characteristics"
    ],
    "checkAirdrop": true,
    "checkSimilarity": true,
    "minContractAge": 86400
  },
  "honeypot": {
    "enabled": true,
    "simulateTransfer": true,
    "maxBuyTax": 10,
    "maxSellTax": 10,
    "checks": [
      "transfer-blocked",
      "sell-blocked",
      "high-fees",
      "mint-function",
      "blacklist",
      "ownership-manipulation"
    ],
    "simulationAmount": "0.1"
  },
  "tracer": {
    "enabled": true,
    "maxDepth": 5,
    "minAmount": "0.01",
    "includeTokens": true,
    "includeNFTs": false,
    "timeout": 120000
  },
  "deepScan": {
    "enabled": true,
    "maxTransactions": 10000,
    "analyzePatterns": true,
    "generateGraph": true,
    "identifyClusters": true
  }
}
```

### rules.json

Location: `config/rules.json`

Custom detection rules and patterns.

```json
{
  "customRules": [
    {
      "id": "high-value-transfer",
      "name": "High Value Transfer",
      "type": "transaction",
      "condition": {
        "field": "value",
        "operator": ">",
        "value": "100",
        "unit": "ETH"
      },
      "severity": "warning",
      "action": "notify",
      "description": "Detected transfer exceeding 100 ETH"
    },
    {
      "id": "suspicious-mint",
      "name": "Suspicious Mint Function",
      "type": "contract",
      "condition": {
        "pattern": "function mint\\(.*\\) public",
        "location": "contract"
      },
      "severity": "high",
      "action": "flag",
      "description": "Public mint function without access control"
    },
    {
      "id": "ownership-transfer",
      "name": "Ownership Transfer",
      "type": "event",
      "condition": {
        "event": "OwnershipTransferred",
        "frequency": ">5",
        "timeWindow": "1h"
      },
      "severity": "medium",
      "action": "notify",
      "description": "Frequent ownership transfers detected"
    }
  ],
  "patterns": {
    "malicious": [
      {
        "name": "backdoor",
        "regex": "selfdestruct\\(.*owner.*\\)",
        "severity": "critical"
      },
      {
        "name": "hidden-owner",
        "regex": "address private.*owner",
        "severity": "high"
      }
    ],
    "suspicious": [
      {
        "name": "high-fees",
        "condition": "fee > 20",
        "severity": "medium"
      }
    ]
  }
}
```

### notifications.json

Location: `config/notifications.json`

Configure notification channels and settings.

```json
{
  "email": {
    "enabled": true,
    "recipients": [
      "admin@example.com",
      "security@example.com"
    ],
    "smtp": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "your-email@gmail.com",
        "pass": "your-app-password"
      }
    },
    "from": "SmartContractAudit <noreply@example.com>",
    "severity": ["critical", "high"]
  },
  "slack": {
    "enabled": true,
    "webhook": "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
    "channel": "#security-alerts",
    "username": "Audit Bot",
    "iconEmoji": ":shield:",
    "severity": ["critical", "high", "medium"]
  },
  "telegram": {
    "enabled": false,
    "botToken": "YOUR_BOT_TOKEN",
    "chatId": "YOUR_CHAT_ID",
    "severity": ["critical"]
  },
  "discord": {
    "enabled": false,
    "webhook": "https://discord.com/api/webhooks/YOUR/WEBHOOK",
    "username": "Audit Bot",
    "avatarUrl": "https://example.com/avatar.png",
    "severity": ["critical", "high"]
  },
  "webhook": {
    "enabled": false,
    "url": "https://your-api.com/webhook",
    "method": "POST",
    "headers": {
      "Authorization": "Bearer YOUR_TOKEN",
      "Content-Type": "application/json"
    },
    "severity": ["critical", "high", "medium", "low"]
  }
}
```

### repair.json

Location: `config/repair.json`

Configure automated repair behavior.

```json
{
  "enabled": true,
  "autoCreatePR": true,
  "requireApproval": true,
  "repairPatterns": {
    "reentrancy": {
      "enabled": true,
      "strategy": "checks-effects-interactions",
      "confidence": 85
    },
    "overflow": {
      "enabled": true,
      "strategy": "safemath",
      "confidence": 95
    },
    "unchecked-send": {
      "enabled": true,
      "strategy": "require-check",
      "confidence": 90
    },
    "delegatecall": {
      "enabled": false,
      "strategy": "manual",
      "confidence": 50
    }
  },
  "pr": {
    "branch": "auto-repair",
    "title": "🔒 Automated Security Fix: {vulnerability}",
    "body": "This PR automatically fixes the {vulnerability} vulnerability detected in {file}.\n\n**Details:**\n{details}\n\n**Confidence:** {confidence}%\n\n⚠️ Please review carefully before merging.",
    "labels": ["security", "automated-fix"],
    "assignees": [],
    "reviewers": []
  }
}
```

## Environment Variables

Create a `.env` file for sensitive configuration:

```bash
# RPC Endpoints
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
BSC_RPC_URL=https://bsc-dataseed1.binance.org
POLYGON_RPC_URL=https://polygon-rpc.com
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# API Keys
ETHERSCAN_API_KEY=your_etherscan_key
BSCSCAN_API_KEY=your_bscscan_key
POLYGONSCAN_API_KEY=your_polygonscan_key

# Notification Services
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SLACK_WEBHOOK=https://hooks.slack.com/services/...
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id

# GitHub
GITHUB_TOKEN=your_github_token
GITHUB_REPOSITORY=owner/repo

# Other
DEBUG=false
LOG_LEVEL=info
NODE_ENV=production
```

## Configuration Validation

The system validates configurations on startup. Example:

```javascript
const config = require('./config/scanner.json');

function validateConfig(config) {
  if (config.antivirus.threshold < 0 || config.antivirus.threshold > 100) {
    throw new Error('Invalid antivirus threshold');
  }
  
  if (config.honeypot.maxBuyTax < 0 || config.honeypot.maxBuyTax > 100) {
    throw new Error('Invalid max buy tax');
  }
  
  return true;
}
```

## Override Configuration

You can override configuration via environment variables or command-line arguments:

```bash
# Via environment
export SCANNER_THRESHOLD=80
npm run scan

# Via CLI
npm run scan -- --threshold 80 --timeout 120000
```

## Best Practices

1. **Keep secrets in .env**: Never commit API keys or passwords
2. **Use specific thresholds**: Tune thresholds based on your needs
3. **Enable appropriate modules**: Disable unused modules for better performance
4. **Configure notifications**: Set up at least one notification channel
5. **Regular updates**: Review and update configurations periodically
6. **Backup configs**: Keep backups of working configurations
7. **Test changes**: Test configuration changes in non-production first

## Configuration Priority

Configurations are loaded in this order (later overrides earlier):

1. Default configuration (hardcoded)
2. Configuration files (config/*.json)
3. Environment variables (.env)
4. Command-line arguments
