#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# 🧠 SmartBrain Orchestrator - Master Control Script
# ═══════════════════════════════════════════════════════════════════════════
# Description: Central orchestration system for smart contract auditing,
#              scanning, and health monitoring. Coordinates multiple agents
#              (A-F) to perform comprehensive security analysis.
# 
# Usage: ./scripts/master.sh [command] [options]
# Commands: scan, audit, health, deploy, report, full
# Options: --dry-run, --verbose, --agent=<A-F>
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 Colors and Formatting
# ═══════════════════════════════════════════════════════════════════════════
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly MAGENTA='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color
readonly BOLD='\033[1m'

# ═══════════════════════════════════════════════════════════════════════════
# 📝 Logging Helpers
# ═══════════════════════════════════════════════════════════════════════════
log_info() {
    echo -e "${BLUE}ℹ️  [INFO]${NC} $*"
}

log_success() {
    echo -e "${GREEN}✅ [SUCCESS]${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}⚠️  [WARNING]${NC} $*"
}

log_error() {
    echo -e "${RED}❌ [ERROR]${NC} $*"
}

log_debug() {
    if [[ "${VERBOSE:-false}" == "true" ]]; then
        echo -e "${MAGENTA}🔍 [DEBUG]${NC} $*"
    fi
}

log_agent() {
    local agent=$1
    shift
    echo -e "${CYAN}🤖 [AGENT-${agent}]${NC} $*"
}

banner() {
    echo -e "${BOLD}${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "  $*"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 Configuration
# ═══════════════════════════════════════════════════════════════════════════
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly DRY_RUN="${DRY_RUN:-true}"
readonly VERBOSE="${VERBOSE:-false}"
readonly AGENTS_ENABLED="${AGENTS_ENABLED:-A,B,C,D,E,F}"

# ═══════════════════════════════════════════════════════════════════════════
# 🧹 Port Cleaner
# ═══════════════════════════════════════════════════════════════════════════
clean_ports() {
    log_info "Cleaning up stale processes on common ports..."
    local ports=(3000 3001 8000 8080 8545 9545)
    
    for port in "${ports[@]}"; do
        if lsof -ti:$port >/dev/null 2>&1; then
            if [[ "${DRY_RUN}" == "true" ]]; then
                log_warning "[DRY-RUN] Would kill process on port $port"
            else
                log_warning "Killing process on port $port"
                lsof -ti:$port | xargs kill -9 2>/dev/null || true
            fi
        fi
    done
    log_success "Port cleanup complete"
}

# ═══════════════════════════════════════════════════════════════════════════
# 📦 PNPM Helpers
# ═══════════════════════════════════════════════════════════════════════════
ensure_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        log_warning "pnpm not found, attempting to install..."
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_warning "[DRY-RUN] Would install pnpm"
            return 0
        fi
        npm install -g pnpm || {
            log_error "Failed to install pnpm"
            return 1
        }
    fi
    log_success "pnpm is available"
}

pnpm_install() {
    if [[ -f "${PROJECT_ROOT}/package.json" ]]; then
        log_info "Installing dependencies with pnpm..."
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_warning "[DRY-RUN] Would run: pnpm install"
        else
            cd "${PROJECT_ROOT}" && pnpm install
        fi
        log_success "Dependencies installed"
    else
        log_debug "No package.json found, skipping pnpm install"
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# 🤖 Agent A: Repository Scanner
# ═══════════════════════════════════════════════════════════════════════════
agent_a_scan() {
    log_agent "A" "Starting repository scan..."
    
    log_debug "Scanning for smart contract files..."
    local contract_files=$(find "${PROJECT_ROOT}" -type f \( -name "*.sol" -o -name "*.vy" \) 2>/dev/null | wc -l)
    log_info "Found ${contract_files} smart contract files"
    
    log_debug "Scanning for configuration files..."
    local config_files=$(find "${PROJECT_ROOT}" -type f \( -name "*.json" -o -name "*.yml" -o -name "*.yaml" \) 2>/dev/null | wc -l)
    log_info "Found ${config_files} configuration files"
    
    log_debug "Checking for security tools..."
    [[ -f "${PROJECT_ROOT}/.solhint.json" ]] && log_info "Solhint config found"
    [[ -f "${PROJECT_ROOT}/slither.config.json" ]] && log_info "Slither config found"
    
    log_agent "A" "Repository scan complete"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🤖 Agent B: Dependency Auditor
# ═══════════════════════════════════════════════════════════════════════════
agent_b_audit() {
    log_agent "B" "Starting dependency audit..."
    
    if [[ -f "${PROJECT_ROOT}/package.json" ]]; then
        log_info "Auditing npm dependencies..."
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_warning "[DRY-RUN] Would run: pnpm audit"
        else
            cd "${PROJECT_ROOT}" && pnpm audit --json > /tmp/audit-report.json 2>/dev/null || true
            log_info "Audit report saved to /tmp/audit-report.json"
        fi
    fi
    
    if [[ -f "${PROJECT_ROOT}/requirements.txt" ]]; then
        log_info "Checking Python dependencies..."
        if command -v pip &> /dev/null; then
            if [[ "${DRY_RUN}" == "true" ]]; then
                log_warning "[DRY-RUN] Would run: pip list --outdated"
            else
                pip list --outdated || true
            fi
        fi
    fi
    
    log_agent "B" "Dependency audit complete"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🤖 Agent C: Security Analyzer
# ═══════════════════════════════════════════════════════════════════════════
agent_c_security() {
    log_agent "C" "Starting security analysis..."
    
    log_info "Checking for common security issues..."
    
    # Check for hardcoded secrets
    log_debug "Scanning for potential secrets..."
    if grep -r -i "private.*key\|secret\|password\|api.*key" "${PROJECT_ROOT}" --include="*.sol" --include="*.js" --include="*.ts" 2>/dev/null | grep -v "node_modules" | grep -v ".git" | head -5; then
        log_warning "Potential secrets found in code (review required)"
    fi
    
    # Check for unsafe functions
    log_debug "Scanning for unsafe function calls..."
    if grep -r "selfdestruct\|delegatecall\|call.value" "${PROJECT_ROOT}" --include="*.sol" 2>/dev/null | grep -v "node_modules" | head -5; then
        log_warning "Potentially unsafe functions found"
    fi
    
    log_agent "C" "Security analysis complete"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🤖 Agent D: Code Quality Checker
# ═══════════════════════════════════════════════════════════════════════════
agent_d_quality() {
    log_agent "D" "Starting code quality check..."
    
    log_info "Analyzing code structure..."
    
    # Count lines of code
    if command -v cloc &> /dev/null; then
        log_debug "Running cloc analysis..."
        if [[ "${DRY_RUN}" == "true" ]]; then
            log_warning "[DRY-RUN] Would run: cloc ${PROJECT_ROOT}"
        else
            cloc "${PROJECT_ROOT}" --quiet 2>/dev/null || log_debug "cloc not available or failed"
        fi
    fi
    
    # Check for linting configs
    [[ -f "${PROJECT_ROOT}/.eslintrc" ]] && log_info "ESLint config found"
    [[ -f "${PROJECT_ROOT}/.prettierrc" ]] && log_info "Prettier config found"
    
    log_agent "D" "Code quality check complete"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🤖 Agent E: Test Coverage Analyzer
# ═══════════════════════════════════════════════════════════════════════════
agent_e_coverage() {
    log_agent "E" "Starting test coverage analysis..."
    
    if [[ -f "${PROJECT_ROOT}/package.json" ]]; then
        log_info "Checking for test scripts..."
        if grep -q "\"test\"" "${PROJECT_ROOT}/package.json"; then
            log_success "Test scripts found in package.json"
            if [[ "${DRY_RUN}" == "true" ]]; then
                log_warning "[DRY-RUN] Would run: pnpm test"
            else
                cd "${PROJECT_ROOT}" && pnpm test 2>/dev/null || log_warning "Tests failed or not configured"
            fi
        else
            log_warning "No test scripts found in package.json"
        fi
    fi
    
    # Check for test directories
    [[ -d "${PROJECT_ROOT}/test" ]] && log_info "Test directory found"
    [[ -d "${PROJECT_ROOT}/tests" ]] && log_info "Tests directory found"
    
    log_agent "E" "Test coverage analysis complete"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🤖 Agent F: Health Monitor
# ═══════════════════════════════════════════════════════════════════════════
agent_f_health() {
    log_agent "F" "Starting health monitoring..."
    
    log_info "Checking system health..."
    
    # Check disk space
    local disk_usage=$(df -h "${PROJECT_ROOT}" | awk 'NR==2 {print $5}' | sed 's/%//')
    if [[ ${disk_usage} -gt 80 ]]; then
        log_warning "Disk usage is high: ${disk_usage}%"
    else
        log_success "Disk usage OK: ${disk_usage}%"
    fi
    
    # Check memory
    if command -v free &> /dev/null; then
        local mem_usage=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
        log_info "Memory usage: ${mem_usage}%"
    fi
    
    # Check git status
    if [[ -d "${PROJECT_ROOT}/.git" ]]; then
        cd "${PROJECT_ROOT}"
        local changes=$(git status --porcelain | wc -l)
        log_info "Git: ${changes} uncommitted changes"
    fi
    
    log_agent "F" "Health monitoring complete"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🎯 Command Handlers
# ═══════════════════════════════════════════════════════════════════════════
cmd_scan() {
    banner "🔍 SCAN MODE"
    agent_a_scan
}

cmd_audit() {
    banner "🔒 AUDIT MODE"
    agent_b_audit
    agent_c_security
}

cmd_health() {
    banner "💊 HEALTH CHECK MODE"
    agent_f_health
}

cmd_deploy() {
    banner "🚀 DEPLOY MODE"
    log_warning "Deploy mode is not yet implemented"
    log_info "Please use scripts/deploy-caster.sh for deployments"
}

cmd_report() {
    banner "📊 REPORT MODE"
    log_info "Generating comprehensive report..."
    agent_a_scan
    agent_b_audit
    agent_c_security
    agent_d_quality
    agent_e_coverage
    agent_f_health
    log_success "Report generation complete"
}

cmd_full() {
    banner "🎯 FULL ANALYSIS MODE"
    clean_ports
    ensure_pnpm
    pnpm_install
    cmd_report
}

# ═══════════════════════════════════════════════════════════════════════════
# 📋 Main Entry Point
# ═══════════════════════════════════════════════════════════════════════════
main() {
    local command="${1:-help}"
    
    # Parse options
    while [[ $# -gt 0 ]]; do
        case $1 in
            --dry-run)
                export DRY_RUN=true
                shift
                ;;
            --no-dry-run)
                export DRY_RUN=false
                shift
                ;;
            --verbose)
                export VERBOSE=true
                shift
                ;;
            --agent=*)
                export AGENTS_ENABLED="${1#*=}"
                shift
                ;;
            -*)
                log_warning "Unknown option: $1"
                shift
                ;;
            *)
                break
                ;;
        esac
    done
    
    command="${1:-help}"
    
    # Display configuration
    log_info "SmartBrain Orchestrator v1.0.0"
    log_info "DRY_RUN: ${DRY_RUN}"
    log_info "VERBOSE: ${VERBOSE}"
    log_info "Project: ${PROJECT_ROOT}"
    echo ""
    
    # Execute command
    case "${command}" in
        scan)
            cmd_scan
            ;;
        audit)
            cmd_audit
            ;;
        health)
            cmd_health
            ;;
        deploy)
            cmd_deploy
            ;;
        report)
            cmd_report
            ;;
        full)
            cmd_full
            ;;
        help|--help|-h)
            banner "🧠 SmartBrain Orchestrator - Help"
            echo "Usage: $0 [command] [options]"
            echo ""
            echo "Commands:"
            echo "  scan      - Scan repository for contracts and configs"
            echo "  audit     - Audit dependencies and security"
            echo "  health    - Check system health"
            echo "  deploy    - Deploy contracts (placeholder)"
            echo "  report    - Generate comprehensive report"
            echo "  full      - Run full analysis with all agents"
            echo "  help      - Show this help message"
            echo ""
            echo "Options:"
            echo "  --dry-run      - Enable dry-run mode (default: true)"
            echo "  --no-dry-run   - Disable dry-run mode"
            echo "  --verbose      - Enable verbose output"
            echo "  --agent=A-F    - Enable specific agents (comma-separated)"
            echo ""
            echo "Examples:"
            echo "  $0 scan"
            echo "  $0 audit --verbose"
            echo "  $0 full --no-dry-run"
            echo ""
            ;;
        *)
            log_error "Unknown command: ${command}"
            log_info "Run '$0 help' for usage information"
            exit 1
            ;;
    esac
    
    log_success "SmartBrain orchestration complete! 🎉"
}

# Run main if not sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
