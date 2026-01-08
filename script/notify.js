#!/usr/bin/env node

/**
 * Notification Script
 * Sends notifications to configured channels
 */

const fs = require('fs');
const path = require('path');

class NotificationService {
  constructor(config) {
    this.config = config;
  }

  async notify(message, severity = 'info') {
    console.log(`[Notification] Sending ${severity} notification...`);

    const promises = [];

    if (this.config.email?.enabled && this.shouldNotify('email', severity)) {
      promises.push(this.sendEmail(message, severity));
    }

    if (this.config.slack?.enabled && this.shouldNotify('slack', severity)) {
      promises.push(this.sendSlack(message, severity));
    }

    if (this.config.telegram?.enabled && this.shouldNotify('telegram', severity)) {
      promises.push(this.sendTelegram(message, severity));
    }

    if (this.config.discord?.enabled && this.shouldNotify('discord', severity)) {
      promises.push(this.sendDiscord(message, severity));
    }

    if (this.config.webhook?.enabled && this.shouldNotify('webhook', severity)) {
      promises.push(this.sendWebhook(message, severity));
    }

    const results = await Promise.allSettled(promises);
    
    const sent = results.filter(r => r.status === 'fulfilled').length;
    console.log(`[Notification] Sent to ${sent}/${promises.length} channels`);

    return {
      sent: sent > 0,
      channels: this.getEnabledChannels(),
      timestamp: Date.now()
    };
  }

  shouldNotify(channel, severity) {
    const channelConfig = this.config[channel];
    if (!channelConfig || !channelConfig.severity) return true;
    return channelConfig.severity.includes(severity);
  }

  getEnabledChannels() {
    return Object.keys(this.config).filter(key => this.config[key]?.enabled);
  }

  async sendEmail(message, severity) {
    console.log('[Email] Sending notification...');
    // Placeholder - implement SMTP email sending
    return Promise.resolve();
  }

  async sendSlack(message, severity) {
    console.log('[Slack] Sending notification...');
    
    if (!this.config.slack.webhook) {
      throw new Error('Slack webhook not configured');
    }

    const emoji = {
      critical: ':rotating_light:',
      high: ':red_circle:',
      medium: ':warning:',
      low: ':information_source:',
      info: ':bell:'
    }[severity] || ':bell:';

    const color = {
      critical: '#FF0000',
      high: '#FF6B00',
      medium: '#FFD700',
      low: '#36A64F',
      info: '#0099CC'
    }[severity] || '#0099CC';

    const payload = {
      username: this.config.slack.username || 'Audit Bot',
      icon_emoji: this.config.slack.iconEmoji || ':shield:',
      attachments: [{
        color: color,
        title: `${emoji} Security Alert: ${severity.toUpperCase()}`,
        text: message,
        footer: 'SmartContractAudit',
        ts: Math.floor(Date.now() / 1000)
      }]
    };

    // Placeholder for actual webhook call
    console.log('[Slack] Payload:', JSON.stringify(payload, null, 2));
    return Promise.resolve();
  }

  async sendTelegram(message, severity) {
    console.log('[Telegram] Sending notification...');
    // Placeholder - implement Telegram Bot API call
    return Promise.resolve();
  }

  async sendDiscord(message, severity) {
    console.log('[Discord] Sending notification...');
    // Placeholder - implement Discord webhook
    return Promise.resolve();
  }

  async sendWebhook(message, severity) {
    console.log('[Webhook] Sending notification...');
    // Placeholder - implement custom webhook POST
    return Promise.resolve();
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  let message = 'Security alert';
  let severity = 'info';

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--message':
        if (i + 1 >= args.length) {
          console.error('Error: --message requires a value');
          process.exit(1);
        }
        message = args[++i];
        break;
      case '--severity':
        if (i + 1 >= args.length) {
          console.error('Error: --severity requires a value');
          process.exit(1);
        }
        severity = args[++i];
        break;
      case '--report':
        if (i + 1 >= args.length) {
          console.error('Error: --report requires a value');
          process.exit(1);
        }
        // Load report and extract message
        const reportPath = args[++i];
        const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
        message = generateMessageFromReport(report);
        severity = determineSeverity(report);
        break;
    }
  }

  // Load configuration
  const configPath = path.join(__dirname, '../config/notifications.json');
  const config = fs.existsSync(configPath) 
    ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
    : { email: { enabled: false }, slack: { enabled: false } };

  const service = new NotificationService(config);
  await service.notify(message, severity);
}

function generateMessageFromReport(report) {
  if (Array.isArray(report)) {
    const criticalCount = report.filter(r => r.summary?.overallRisk === 'critical').length;
    const highCount = report.filter(r => r.summary?.overallRisk === 'high').length;
    
    return `Scan completed: ${report.length} contracts scanned. ` +
           `Critical: ${criticalCount}, High: ${highCount}`;
  }
  
  return `Scan completed for ${report.target}. Risk level: ${report.summary?.overallRisk || 'unknown'}`;
}

function determineSeverity(report) {
  if (Array.isArray(report)) {
    const hasCritical = report.some(r => r.summary?.overallRisk === 'critical');
    if (hasCritical) return 'critical';
    
    const hasHigh = report.some(r => r.summary?.overallRisk === 'high');
    if (hasHigh) return 'high';
    
    return 'info';
  }
  
  return report.summary?.overallRisk || 'info';
}

if (require.main === module) {
  main().catch(error => {
    console.error('Error sending notification:', error);
    process.exit(1);
  });
}

module.exports = NotificationService;
