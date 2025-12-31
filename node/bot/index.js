#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🤖 GitAntivirus Node Bot - Automated Security Scanner
 * ═══════════════════════════════════════════════════════════════════════════
 * Description: Scans GitHub repositories for security issues and creates
 *              draft PRs with fixes. Operates in dry-run mode by default.
 * 
 * Usage: node index.js
 * 
 * Environment Variables:
 *   GH_TOKEN / GITHUB_TOKEN  - GitHub token (required for write operations)
 *   DRY_RUN                  - Run in safe mode (default: true)
 *   BOT_PINGS_ENABLED        - Enable notifications (default: false)
 *   ALLOWLIST_ORGS           - Comma-separated org list (default: empty)
 *   MAX_PRS_PER_RUN          - Max PRs to create (default: 3)
 *   STAR_THRESHOLD           - Min stars (default: 10)
 *   SEARCH_KEYWORDS          - Search terms (default: "smart contract,solidity")
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { Octokit } from '@octokit/rest';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ═══════════════════════════════════════════════════════════════════════════
// 🔧 Configuration
// ═══════════════════════════════════════════════════════════════════════════
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  dryRun: process.env.DRY_RUN !== 'false',
  botPingsEnabled: process.env.BOT_PINGS_ENABLED === 'true',
  allowlistOrgs: process.env.ALLOWLIST_ORGS?.split(',').map(s => s.trim()).filter(Boolean) || [],
  maxPrsPerRun: parseInt(process.env.MAX_PRS_PER_RUN || '3', 10),
  starThreshold: parseInt(process.env.STAR_THRESHOLD || '10', 10),
  searchKeywords: process.env.SEARCH_KEYWORDS || 'smart contract,solidity,audit',
  token: process.env.GH_TOKEN || process.env.GITHUB_TOKEN,
};

// ═══════════════════════════════════════════════════════════════════════════
// 🎨 Logging Helpers
// ═══════════════════════════════════════════════════════════════════════════
const log = {
  info: (msg) => console.log(`ℹ️  [INFO] ${msg}`),
  success: (msg) => console.log(`✅ [SUCCESS] ${msg}`),
  warning: (msg) => console.log(`⚠️  [WARNING] ${msg}`),
  error: (msg) => console.error(`❌ [ERROR] ${msg}`),
  debug: (msg) => console.log(`🔍 [DEBUG] ${msg}`),
};

const banner = (text) => {
  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  console.log(`  ${text}`);
  console.log('═══════════════════════════════════════════════════════════════════════════\n');
};

// ═══════════════════════════════════════════════════════════════════════════
// 🔌 Initialize Octokit
// ═══════════════════════════════════════════════════════════════════════════
let octokit = null;
if (config.token) {
  octokit = new Octokit({ auth: config.token });
  log.success('GitHub API client initialized');
} else {
  log.warning('No GitHub token provided - running in read-only mode');
  octokit = new Octokit();
}

// ═══════════════════════════════════════════════════════════════════════════
// 📝 Load PR Template
// ═══════════════════════════════════════════════════════════════════════════
function loadPRTemplate() {
  try {
    const templatePath = join(__dirname, '..', 'PR_TEMPLATE.md');
    if (existsSync(templatePath)) {
      return readFileSync(templatePath, 'utf8');
    }
  } catch (error) {
    log.warning(`Could not load PR template: ${error.message}`);
  }
  return `## 🛡️ GitAntivirus Security Fix

This automated PR addresses security issues found in your repository.

### Changes Made
- Security vulnerability fixes
- Dependency updates
- Configuration improvements

### Review Checklist
- [ ] Review all changes
- [ ] Run tests
- [ ] Verify security fixes
- [ ] Merge when ready

*🤖 Automated by GitAntivirus*`;
}

// ═══════════════════════════════════════════════════════════════════════════
// 🔍 Search for Repositories
// ═══════════════════════════════════════════════════════════════════════════
async function searchRepositories() {
  log.info('Searching for repositories...');
  
  const keywords = config.searchKeywords.split(',').map(k => k.trim());
  const query = keywords.join(' OR ');
  
  try {
    const { data } = await octokit.rest.search.repos({
      q: `${query} stars:>${config.starThreshold}`,
      sort: 'stars',
      order: 'desc',
      per_page: 30,
    });
    
    log.success(`Found ${data.total_count} repositories matching criteria`);
    return data.items || [];
  } catch (error) {
    log.error(`Search failed: ${error.message}`);
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎯 Filter Repositories
// ═══════════════════════════════════════════════════════════════════════════
function filterRepositories(repos) {
  log.info('Filtering repositories...');
  
  let filtered = repos;
  
  // Apply allowlist if configured
  if (config.allowlistOrgs.length > 0) {
    filtered = filtered.filter(repo => {
      const ownerLogin = repo.owner.login;
      const allowed = config.allowlistOrgs.includes(ownerLogin);
      if (!allowed) {
        log.debug(`Filtered out ${repo.full_name} (not in allowlist)`);
      }
      return allowed;
    });
  }
  
  // Apply star threshold
  filtered = filtered.filter(repo => repo.stargazers_count >= config.starThreshold);
  
  log.success(`${filtered.length} repositories passed filters`);
  return filtered;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📊 Analyze Repository
// ═══════════════════════════════════════════════════════════════════════════
async function analyzeRepository(repo) {
  log.info(`Analyzing ${repo.full_name}...`);
  
  const analysis = {
    name: repo.full_name,
    stars: repo.stargazers_count,
    owner: repo.owner.login,
    issues: [],
    recommendations: [],
  };
  
  try {
    // Check for security files
    try {
      await octokit.rest.repos.getContent({
        owner: repo.owner.login,
        repo: repo.name,
        path: 'SECURITY.md',
      });
      analysis.recommendations.push('✅ SECURITY.md found');
    } catch {
      analysis.issues.push('❌ Missing SECURITY.md');
    }
    
    // Check for common security files
    const securityFiles = ['.solhint.json', 'slither.config.json', '.gitignore'];
    for (const file of securityFiles) {
      try {
        await octokit.rest.repos.getContent({
          owner: repo.owner.login,
          repo: repo.name,
          path: file,
        });
      } catch {
        analysis.issues.push(`❌ Missing ${file}`);
      }
    }
    
  } catch (error) {
    log.warning(`Analysis error for ${repo.full_name}: ${error.message}`);
  }
  
  return analysis;
}

// ═══════════════════════════════════════════════════════════════════════════
// 📝 Create Draft PR
// ═══════════════════════════════════════════════════════════════════════════
async function createDraftPR(repo, analysis) {
  if (config.dryRun) {
    log.warning(`[DRY-RUN] Would create PR for ${repo.full_name}`);
    return { created: false, reason: 'dry-run' };
  }
  
  if (!config.token) {
    log.warning(`[NO-TOKEN] Cannot create PR for ${repo.full_name}`);
    return { created: false, reason: 'no-token' };
  }
  
  try {
    const prTemplate = loadPRTemplate();
    
    // Build PR body with pings if enabled and owner is SolanaRemix
    let prBody = prTemplate;
    if (config.botPingsEnabled && repo.owner.login === 'SolanaRemix') {
      prBody += '\n\n---\ncc: @SolanaRemix\n';
    }
    
    log.info(`Creating draft PR for ${repo.full_name}...`);
    
    // Note: Actual PR creation requires fork + branch creation
    // This is a template - implement full logic as needed
    log.warning('PR creation logic is a template - implement full workflow');
    
    return { created: false, reason: 'template-only' };
  } catch (error) {
    log.error(`Failed to create PR: ${error.message}`);
    return { created: false, reason: error.message };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// 💾 Save Summary
// ═══════════════════════════════════════════════════════════════════════════
function saveSummary(results) {
  const logsDir = join(__dirname, '..', 'logs');
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
  }
  
  const summary = {
    timestamp: new Date().toISOString(),
    config: {
      dryRun: config.dryRun,
      botPingsEnabled: config.botPingsEnabled,
      allowlistOrgs: config.allowlistOrgs,
      maxPrsPerRun: config.maxPrsPerRun,
    },
    results,
    stats: {
      total: results.length,
      analyzed: results.filter(r => r.analysis).length,
      prsCreated: results.filter(r => r.pr?.created).length,
    },
  };
  
  // Add conditional ping notice
  if (config.botPingsEnabled) {
    const solanaRemixRepos = results.filter(r => r.repo.owner.login === 'SolanaRemix');
    if (solanaRemixRepos.length > 0) {
      summary.notifications = {
        enabled: true,
        mention: '@SolanaRemix',
        repos: solanaRemixRepos.map(r => r.repo.full_name),
      };
    }
  }
  
  const summaryPath = join(logsDir, 'summary.json');
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
  log.success(`Summary saved to ${summaryPath}`);
}

// ═══════════════════════════════════════════════════════════════════════════
// 🚀 Main Execution
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  banner('🤖 GitAntivirus Node Bot');
  
  // Display configuration
  log.info(`DRY_RUN: ${config.dryRun}`);
  log.info(`BOT_PINGS_ENABLED: ${config.botPingsEnabled}`);
  log.info(`ALLOWLIST_ORGS: ${config.allowlistOrgs.join(', ') || 'none'}`);
  log.info(`MAX_PRS_PER_RUN: ${config.maxPrsPerRun}`);
  log.info(`STAR_THRESHOLD: ${config.starThreshold}`);
  console.log();
  
  if (config.dryRun) {
    log.warning('🧪 RUNNING IN DRY-RUN MODE - No PRs will be created');
    console.log();
  }
  
  // Search for repositories
  const repos = await searchRepositories();
  if (repos.length === 0) {
    log.warning('No repositories found matching criteria');
    return;
  }
  
  // Filter repositories
  const filtered = filterRepositories(repos);
  if (filtered.length === 0) {
    log.warning('No repositories passed filters');
    return;
  }
  
  // Process repositories
  const results = [];
  const limit = Math.min(filtered.length, config.maxPrsPerRun);
  
  log.info(`Processing ${limit} repositories...`);
  console.log();
  
  for (let i = 0; i < limit; i++) {
    const repo = filtered[i];
    const analysis = await analyzeRepository(repo);
    const pr = await createDraftPR(repo, analysis);
    
    results.push({ repo, analysis, pr });
    
    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save summary
  saveSummary(results);
  
  // Display summary
  console.log();
  banner('📊 Scan Summary');
  log.info(`Repositories scanned: ${results.length}`);
  log.info(`Issues found: ${results.reduce((sum, r) => sum + r.analysis.issues.length, 0)}`);
  log.info(`PRs created: ${results.filter(r => r.pr?.created).length}`);
  
  if (config.dryRun) {
    console.log();
    log.warning('To enable live PR creation, run with: DRY_RUN=false');
  }
  
  log.success('Scan complete! 🎉');
}

// ═══════════════════════════════════════════════════════════════════════════
// 🎬 Entry Point
// ═══════════════════════════════════════════════════════════════════════════
main().catch(error => {
  log.error(`Fatal error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
