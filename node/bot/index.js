#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════════
// 🤖 GitAntivirus BOT - Automated Security & Onboarding
// ═══════════════════════════════════════════════════════════════════════════
// Purpose: Discover repositories and prepare security improvement PRs
// Author: SMSDAO / SolanaRemix
// License: MIT
// ═══════════════════════════════════════════════════════════════════════════

import { Octokit } from '@octokit/rest';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ═══════════════════════════════════════════════════════════════════════════
// Configuration
// ═══════════════════════════════════════════════════════════════════════════

const CONFIG = {
  dryRun: process.env.DRY_RUN !== 'false',
  botPingsEnabled: process.env.BOT_PINGS_ENABLED === 'true',
  allowlistOrgs: (process.env.ALLOWLIST_ORGS || '').split(',').filter(Boolean),
  maxPRsPerRun: parseInt(process.env.MAX_PRS_PER_RUN || '3', 10),
  searchKeywords: (process.env.SEARCH_KEYWORDS || 'solana,smart-contract,audit').split(','),
  minStars: parseInt(process.env.MIN_STARS || '10', 10),
  ghToken: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
};

// ═══════════════════════════════════════════════════════════════════════════
// Colors for console output
// ═══════════════════════════════════════════════════════════════════════════

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  debug: (msg) => console.log(`${colors.magenta}[DEBUG]${colors.reset} ${msg}`),
};

// ═══════════════════════════════════════════════════════════════════════════
// Banner
// ═══════════════════════════════════════════════════════════════════════════

function banner() {
  console.log(`${colors.cyan}
═══════════════════════════════════════════════════════════════════════════
🤖 GitAntivirus BOT - Automated Security & Onboarding
═══════════════════════════════════════════════════════════════════════════
${colors.reset}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// Initialize Octokit
// ═══════════════════════════════════════════════════════════════════════════

function initOctokit() {
  if (!CONFIG.ghToken && !CONFIG.dryRun) {
    log.error('GH_TOKEN or GITHUB_TOKEN required for live mode');
    log.info('Run in dry-run mode: DRY_RUN=true node index.js');
    process.exit(1);
  }

  return CONFIG.ghToken ? new Octokit({ auth: CONFIG.ghToken }) : null;
}

// ═══════════════════════════════════════════════════════════════════════════
// Search for repositories
// ═══════════════════════════════════════════════════════════════════════════

async function searchRepositories(octokit) {
  log.info('Searching for repositories...');
  
  const results = [];
  
  for (const keyword of CONFIG.searchKeywords) {
    try {
      const query = `${keyword} stars:>=${CONFIG.minStars} language:javascript OR language:typescript OR language:rust OR language:solidity`;
      
      log.debug(`Query: ${query}`);
      
      if (CONFIG.dryRun || !octokit) {
        log.warning(`[DRY RUN] Would search for: ${keyword}`);
        continue;
      }
      
      const response = await octokit.rest.search.repos({
        q: query,
        sort: 'stars',
        order: 'desc',
        per_page: 10,
      });
      
      results.push(...response.data.items);
      log.success(`Found ${response.data.items.length} repositories for "${keyword}"`);
    } catch (error) {
      log.error(`Search error for "${keyword}": ${error.message}`);
    }
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════════════════════
// Filter repositories
// ═══════════════════════════════════════════════════════════════════════════

function filterRepositories(repos) {
  log.info('Filtering repositories...');
  
  let filtered = repos;
  
  // Apply allowlist if configured
  if (CONFIG.allowlistOrgs.length > 0) {
    filtered = filtered.filter(repo => 
      CONFIG.allowlistOrgs.includes(repo.owner.login)
    );
    log.info(`After allowlist filter: ${filtered.length} repositories`);
  }
  
  // Remove duplicates
  const unique = [];
  const seen = new Set();
  
  for (const repo of filtered) {
    const key = `${repo.owner.login}/${repo.name}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(repo);
    }
  }
  
  log.success(`Filtered to ${unique.length} unique repositories`);
  return unique;
}

// ═══════════════════════════════════════════════════════════════════════════
// Load PR template
// ═══════════════════════════════════════════════════════════════════════════

function loadPRTemplate() {
  const templatePath = join(__dirname, '..', 'PR_TEMPLATE.md');
  
  if (existsSync(templatePath)) {
    return readFileSync(templatePath, 'utf8');
  }
  
  // Default template if file doesn't exist
  return `# 🛡️ GitAntivirus Security Enhancement

## Summary
This PR adds GitAntivirus security automation to help protect your repository.

## Changes
- Adds security scanning workflow
- Adds automated audit capabilities
- Adds health check automation

## Safety Checklist
- [ ] All changes reviewed
- [ ] No secrets included
- [ ] Dry-run tested
- [ ] Documentation updated

## Evidence
- Security scan: 🔒 Enabled
- Code audit: 🔍 Enabled
- Health check: ❤️ Enabled

---
_This is a draft PR. Please review before merging._
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// Prepare draft PR
// ═══════════════════════════════════════════════════════════════════════════

async function prepareDraftPR(octokit, repo) {
  const prBody = loadPRTemplate();
  
  if (CONFIG.dryRun || !octokit) {
    log.warning(`[DRY RUN] Would create PR for: ${repo.full_name}`);
    log.debug('PR Body Preview:');
    console.log(prBody.substring(0, 200) + '...\n');
    return { status: 'dry_run', repo: repo.full_name };
  }
  
  try {
    log.info(`Creating draft PR for ${repo.full_name}...`);
    
    // Note: This is a template - actual PR creation would require:
    // 1. Fork repository or have write access
    // 2. Create branch with changes
    // 3. Open PR from that branch
    
    log.warning('PR creation requires fork/branch setup - skipping in template mode');
    
    return { status: 'template_mode', repo: repo.full_name };
  } catch (error) {
    log.error(`Failed to create PR for ${repo.full_name}: ${error.message}`);
    return { status: 'error', repo: repo.full_name, error: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Generate summary
// ═══════════════════════════════════════════════════════════════════════════

function generateSummary(repos, results) {
  const summary = {
    timestamp: new Date().toISOString(),
    mode: CONFIG.dryRun ? 'dry_run' : 'live',
    configuration: {
      allowlist_orgs: CONFIG.allowlistOrgs,
      max_prs_per_run: CONFIG.maxPRsPerRun,
      bot_pings_enabled: CONFIG.botPingsEnabled,
      search_keywords: CONFIG.searchKeywords,
      min_stars: CONFIG.minStars,
    },
    repositories_scanned: repos.length,
    prs_created: results.filter(r => r.status === 'created').length,
    prs_dry_run: results.filter(r => r.status === 'dry_run').length,
    errors: results.filter(r => r.status === 'error').length,
    results: results,
  };
  
  // Add ping mention if enabled and owner is SolanaRemix
  if (CONFIG.botPingsEnabled) {
    const solanaRemixRepos = results.filter(r => 
      r.repo.startsWith('SolanaRemix/')
    );
    
    if (solanaRemixRepos.length > 0) {
      summary.mentions = ['@SolanaRemix'];
      log.info('Including @SolanaRemix mention in summary (BOT_PINGS_ENABLED=true)');
    }
  }
  
  return summary;
}

// ═══════════════════════════════════════════════════════════════════════════
// Save summary to file
// ═══════════════════════════════════════════════════════════════════════════

function saveSummary(summary) {
  const logsDir = join(__dirname, '..', 'logs');
  
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }
  
  const logFile = join(logsDir, 'summary.json');
  
  try {
    writeFileSync(logFile, JSON.stringify(summary, null, 2));
    log.success(`Summary saved to: ${logFile}`);
  } catch (error) {
    log.error(`Failed to save summary: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Main execution
// ═══════════════════════════════════════════════════════════════════════════

async function main() {
  banner();
  
  // Display configuration
  log.info('Configuration:');
  console.log(`  Mode: ${CONFIG.dryRun ? '🔒 DRY RUN' : '🚀 LIVE'}`);
  console.log(`  Bot Pings: ${CONFIG.botPingsEnabled ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`  Allowlist Orgs: ${CONFIG.allowlistOrgs.length > 0 ? CONFIG.allowlistOrgs.join(', ') : '(none)'}`);
  console.log(`  Max PRs: ${CONFIG.maxPRsPerRun}`);
  console.log(`  Search Keywords: ${CONFIG.searchKeywords.join(', ')}`);
  console.log(`  Min Stars: ${CONFIG.minStars}`);
  console.log('');
  
  if (CONFIG.dryRun) {
    log.warning('🔒 DRY RUN MODE - No PRs will be created');
    console.log('');
  }
  
  // Initialize GitHub client
  const octokit = initOctokit();
  
  // Search for repositories
  const repos = await searchRepositories(octokit);
  
  // Filter repositories
  const filtered = filterRepositories(repos);
  
  // Limit to max PRs per run
  const candidates = filtered.slice(0, CONFIG.maxPRsPerRun);
  
  log.info(`Processing ${candidates.length} repositories...`);
  console.log('');
  
  // Process each repository
  const results = [];
  for (const repo of candidates) {
    const result = await prepareDraftPR(octokit, repo);
    results.push(result);
  }
  
  console.log('');
  
  // Generate and save summary
  const summary = generateSummary(repos, results);
  saveSummary(summary);
  
  console.log('');
  log.success('Bot execution complete!');
  
  if (CONFIG.dryRun) {
    console.log('');
    log.info('To run in live mode:');
    console.log(`  ${colors.green}DRY_RUN=false GH_TOKEN=your_token node index.js${colors.reset}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// Run the bot
// ═══════════════════════════════════════════════════════════════════════════

main().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
