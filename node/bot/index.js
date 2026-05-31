#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🤖 GitAntivirus Node Bot - Automated Security Scanner
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * PRODUCTION-HARDENED v1.0.0
 * 
 * Scans GitHub repositories for security issues.
 * ALWAYS operates in DRY_RUN mode. PR creation requires explicit implementation.
 * 
 * Environment Variables:
 *   GITHUB_TOKEN  - GitHub token (issues:read, pull-requests:read only)
 *   DRY_RUN       - Enforced to 'true' (non-configurable)
 *   ALLOWLIST_ORGS - Comma-separated org list
 *   MAX_PRS_PER_RUN - Max repos to scan (default: 3)
 *   STAR_THRESHOLD - Min stars (default: 10)
 */

import { Octokit } from '@octokit/rest';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// ─── Constants ────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAX_QUERY_LENGTH = 256;
const RATE_LIMIT_DELAY = 2000; // 2 seconds between API calls
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

// ─── Configuration (Hardened) ────────────────
const config = {
  // ALWAYS dry-run — cannot be disabled
  dryRun: true,
  
  // Bot pings permanently disabled
  botPingsEnabled: false,
  
  // Allowlist — empty = most restrictive
  allowlistOrgs: validateAllowlistOrgs(process.env.ALLOWLIST_ORGS || ''),
  
  maxPrsPerRun: clamp(parseInt(process.env.MAX_PRS_PER_RUN || '3', 10), 1, 10),
  starThreshold: clamp(parseInt(process.env.STAR_THRESHOLD || '10', 10), 1, 1000),
  searchKeywords: validateSearchKeywords(
    process.env.SEARCH_KEYWORDS || 'smart contract,solidity,audit'
  ),
  
  // Token with minimal scope
  token: process.env.GITHUB_TOKEN || null,
};

// ─── Validation Utilities ─────────────────────

function clamp(value, min, max) {
  if (isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function validateAllowlistOrgs(input) {
  if (!input || typeof input !== 'string') return [];
  
  const orgs = input.split(',').map(s => s.trim()).filter(Boolean);
  
  // Only allow alphanumeric + hyphens
  const validOrgs = orgs.filter(org => /^[a-zA-Z0-9-]+$/.test(org));
  
  if (validOrgs.length !== orgs.length) {
    console.warn('⚠️  Some org names were invalid and filtered out');
  }
  
  return validOrgs;
}

function validateSearchKeywords(input) {
  if (!input || typeof input !== 'string') return 'smart contract,solidity,audit';
  
  // Sanitize: remove special GitHub search operators
  const sanitized = input.replace(/[<>|!+\-]/g, ' ').replace(/\s+/g, ' ').trim();
  
  if (sanitized.length > MAX_QUERY_LENGTH) {
    console.warn(`⚠️  Search query truncated to ${MAX_QUERY_LENGTH} characters`);
    return sanitized.substring(0, MAX_QUERY_LENGTH);
  }
  
  return sanitized || 'smart contract,solidity,audit';
}

// ─── Logging ──────────────────────────────────
const log = {
  info: (msg) => console.log(`ℹ️  [INFO] ${msg}`),
  success: (msg) => console.log(`✅ [SUCCESS] ${msg}`),
  warning: (msg) => console.log(`⚠️  [WARNING] ${msg}`),
  error: (msg) => console.error(`❌ [ERROR] ${msg}`),
};

const banner = (text) => {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${text}`);
  console.log(`${'═'.repeat(60)}\n`);
};

// ─── Octokit Initialization ───────────────────
const octokit = config.token
  ? new Octokit({ auth: config.token })
  : new Octokit();

if (config.token) {
  log.success('GitHub API client initialized');
} else {
  log.warning('No GitHub token — running in read-only mode');
}

// ─── Retry Wrapper ────────────────────────────
async function withRetry(fn, retries = MAX_RETRIES) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (error.status === 403 || error.status === 429) {
        const retryAfter = parseInt(error.response?.headers?.['retry-after'] || '5', 10);
        log.warning(`Rate limited. Waiting ${retryAfter}s... (attempt ${i + 1}/${retries + 1})`);
        await new Promise(r => setTimeout(r, retryAfter * 1000));
      } else if (i < retries) {
        await new Promise(r => setTimeout(r, RETRY_DELAY));
      }
    }
  }
  throw lastError;
}

// ─── Search Repositories ──────────────────────
async function searchRepositories() {
  log.info('Searching for repositories...');
  
  const keywords = config.searchKeywords.split(',').map(k => k.trim()).filter(Boolean);
  const query = keywords.join(' OR ').substring(0, MAX_QUERY_LENGTH);
  
  try {
    const { data } = await withRetry(() =>
      octokit.rest.search.repos({
        q: `${query} stars:>=${config.starThreshold}`,
        sort: 'stars',
        order: 'desc',
        per_page: 10,
      })
    );
    
    log.success(`Found ${data.total_count} repositories`);
    return data.items || [];
  } catch (error) {
    log.error(`Search failed: ${error.message}`);
    return [];
  }
}

// ─── Filter Repositories ──────────────────────
function filterRepositories(repos) {
  log.info('Filtering repositories...');
  
  let filtered = repos.filter(repo => {
    const ownerLogin = repo.owner?.login;
    if (!ownerLogin) return false;
    
    // Validate owner is alphanumeric + hyphens
    if (!/^[a-zA-Z0-9-]+$/.test(ownerLogin)) {
      log.warning(`Skipping invalid owner: ${ownerLogin}`);
      return false;
    }
    
    return true;
  });
  
  if (config.allowlistOrgs.length > 0) {
    filtered = filtered.filter(repo => config.allowlistOrgs.includes(repo.owner.login));
  }
  
  filtered = filtered.filter(repo => repo.stargazers_count >= config.starThreshold);
  
  log.success(`${filtered.length} repositories passed filters`);
  return filtered;
}

// ─── Analyze Repository ───────────────────────
async function analyzeRepository(repo) {
  log.info(`Analyzing ${repo.full_name}...`);
  
  const analysis = {
    name: repo.full_name,
    stars: repo.stargazers_count,
    owner: repo.owner.login,
    issues: [],
    recommendations: [],
  };
  
  // Check security files in parallel
  const securityFiles = ['SECURITY.md', '.gitignore', 'package.json'];
  const checks = securityFiles.map(file =>
    withRetry(() =>
      octokit.rest.repos.getContent({
        owner: repo.owner.login,
        repo: repo.name,
        path: file,
      })
    )
      .then(() => analysis.recommendations.push(`✅ ${file} found`))
      .catch(err => {
        if (err.status === 404) {
          analysis.issues.push(`❌ Missing ${file}`);
        } else {
          log.warning(`Check failed for ${file}: ${err.message}`);
        }
      })
  );
  
  await Promise.allSettled(checks);
  
  return analysis;
}

// ─── Save Summary ─────────────────────────────
function saveSummary(results) {
  const logsDir = join(__dirname, '..', 'logs');
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true, mode: 0o755 });
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  const summary = {
    timestamp: new Date().toISOString(),
    config: {
      dryRun: config.dryRun,
      botPingsEnabled: config.botPingsEnabled,
      allowlistOrgs: config.allowlistOrgs,
    },
    results: results.map(r => ({
      repo: r.repo.full_name,
      issues: r.analysis.issues.length,
      recommendations: r.analysis.recommendations.length,
    })),
    stats: {
      total: results.length,
      analyzed: results.length,
      totalIssues: results.reduce((sum, r) => sum + r.analysis.issues.length, 0),
    },
  };
  
  const summaryPath = join(logsDir, `summary-${timestamp}.json`);
  writeFileSync(summaryPath, JSON.stringify(summary, null, 2), { mode: 0o644 });
  log.success(`Summary saved to ${summaryPath}`);
}

// ─── Main ─────────────────────────────────────
async function main() {
  banner('🤖 GitAntivirus Node Bot v1.0.0');
  
  log.info('DRY_RUN: true (permanently enforced)');
  log.info('BOT_PINGS: false (permanently disabled)');
  log.info(`ALLOWLIST_ORGS: ${config.allowlistOrgs.join(', ') || '(none — most restrictive)'}`);
  log.info(`MAX_PRS_PER_RUN: ${config.maxPrsPerRun}`);
  log.info(`STAR_THRESHOLD: ${config.starThreshold}`);
  console.log();
  
  log.warning('🧪 DRY-RUN MODE — No PRs will be created');
  console.log();
  
  const repos = await searchRepositories();
  if (repos.length === 0) {
    log.warning('No repositories found');
    return;
  }
  
  const filtered = filterRepositories(repos);
  if (filtered.length === 0) {
    log.warning('No repositories passed filters');
    return;
  }
  
  const limit = Math.min(filtered.length, config.maxPrsPerRun);
  log.info(`Processing ${limit} repositories...`);
  console.log();
  
  const results = [];
  for (let i = 0; i < limit; i++) {
    const repo = filtered[i];
    const analysis = await analyzeRepository(repo);
    
    results.push({ repo, analysis });
    
    log.info(`[${i + 1}/${limit}] ${repo.full_name}: ${analysis.issues.length} issues, ${analysis.recommendations.length} checks passed`);
    
    await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
  }
  
  saveSummary(results);
  
  banner('📊 Scan Complete');
  log.success(`Repositories scanned: ${results.length}`);
  log.success(`Total issues found: ${results.reduce((sum, r) => sum + r.analysis.issues.length, 0)}`);
  log.success('PR creation is disabled — dry-run only');
}

// ─── Entry Point ──────────────────────────────
main().catch(error => {
  log.error(`Fatal: ${error.message}`);
  process.exit(1);
});