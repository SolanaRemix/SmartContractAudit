#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# 🧠 SmartBrain Orchestrator - Master Control Script
# ═══════════════════════════════════════════════════════════════════════════
# Purpose: Orchestrate security scanning, auditing, and health checks
# Author: SmartBrain / SMSDAO
# License: MIT
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Default configuration
DRY_RUN="${DRY_RUN:-true}"
VERBOSE="${VERBOSE:-false}"
OUTPUT_DIR="${OUTPUT_DIR:-./reports}"

# Banner
banner() {
    echo -e "${CYAN}"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "🧠 SmartBrain Orchestrator - $1"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_debug() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${MAGENTA}[DEBUG]${NC} $1"
    fi
}

# Initialize output directory
init_output() {
    if [[ "$DRY_RUN" == "false" ]]; then
        mkdir -p "$OUTPUT_DIR"
        log_info "Output directory: $OUTPUT_DIR"
    else
        log_warning "DRY_RUN mode enabled - no files will be written"
    fi
}

# Security scan function
scan() {
    banner "Security Scan"
    log_info "Starting security scan..."
    
    # Check for common security tools
    local tools=("git" "grep" "find")
    for tool in "${tools[@]}"; do
        if command -v "$tool" &> /dev/null; then
            log_debug "Found tool: $tool"
        else
            log_warning "Tool not found: $tool"
        fi
    done
    
    # Scan for potential issues
    log_info "Scanning for hardcoded secrets..."
    if [[ "$DRY_RUN" == "false" ]]; then
        {
            echo "# Security Scan Report"
            echo "Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
            echo ""
            echo "## Hardcoded Secrets Check"
            
            # Look for common secret patterns (non-destructive)
            if git rev-parse --git-dir > /dev/null 2>&1; then
                git grep -i -E "(password|secret|api[_-]?key|token|credential)" -- ':!*.md' ':!*.txt' || echo "No obvious secrets found"
            fi
        } > "$OUTPUT_DIR/security-scan.md"
        log_success "Security scan complete: $OUTPUT_DIR/security-scan.md"
    else
        log_info "Would scan repository for hardcoded secrets"
        log_info "Would check for common vulnerabilities"
    fi
}

# Audit function
audit() {
    banner "Code Audit"
    log_info "Starting code audit..."
    
    # Check repository structure
    log_info "Analyzing repository structure..."
    if [[ "$DRY_RUN" == "false" ]]; then
        {
            echo "# Code Audit Report"
            echo "Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
            echo ""
            echo "## Repository Structure"
            tree -L 2 -a || find . -maxdepth 2 -not -path '*/\.git/*' | head -20
            echo ""
            echo "## File Statistics"
            echo "Total files: $(find . -type f -not -path '*/\.git/*' | wc -l)"
            echo "Total lines: $(find . -type f -not -path '*/\.git/*' -exec wc -l {} \; 2>/dev/null | awk '{sum+=$1} END {print sum}')"
        } > "$OUTPUT_DIR/audit-report.md"
        log_success "Audit complete: $OUTPUT_DIR/audit-report.md"
    else
        log_info "Would analyze repository structure"
        log_info "Would generate audit report"
    fi
}

# Health check function
health() {
    banner "Health Check"
    log_info "Starting health check..."
    
    # Check for common configuration files
    local configs=("package.json" "Cargo.toml" "go.mod" "requirements.txt" "pom.xml")
    local found_configs=()
    
    for config in "${configs[@]}"; do
        if [[ -f "$config" ]]; then
            found_configs+=("$config")
            log_success "Found: $config"
        fi
    done
    
    if [[ "$DRY_RUN" == "false" ]]; then
        {
            echo "# Health Check Report"
            echo "Date: $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
            echo ""
            echo "## Configuration Files"
            for config in "${found_configs[@]}"; do
                echo "- ✅ $config"
            done
            echo ""
            echo "## Git Status"
            if git rev-parse --git-dir > /dev/null 2>&1; then
                echo "\`\`\`"
                git status --short
                echo "\`\`\`"
            fi
        } > "$OUTPUT_DIR/health-check.md"
        log_success "Health check complete: $OUTPUT_DIR/health-check.md"
    else
        log_info "Would check configuration files"
        log_info "Would verify git status"
    fi
}

# Full analysis
full() {
    banner "Full Analysis"
    log_info "Running complete analysis..."
    scan
    audit
    health
    log_success "Full analysis complete!"
}

# Help function
usage() {
    cat << EOF
Usage: $0 [COMMAND] [OPTIONS]

Commands:
    scan        Run security scan
    audit       Run code audit
    health      Run health check
    full        Run all checks (default)
    help        Show this help message

Options:
    DRY_RUN=false       Disable dry-run mode (default: true)
    VERBOSE=true        Enable verbose logging (default: false)
    OUTPUT_DIR=path     Set output directory (default: ./reports)

Examples:
    $0 scan                     # Run security scan (dry-run)
    DRY_RUN=false $0 audit      # Run audit with file output
    VERBOSE=true $0 health      # Run health check with debug logs
    DRY_RUN=false $0 full       # Run all checks with file output

Environment Variables:
    DRY_RUN         Set to 'false' to enable file writing
    VERBOSE         Set to 'true' to enable debug logs
    OUTPUT_DIR      Directory for output reports

EOF
}

# Main execution
main() {
    local command="${1:-full}"
    
    case "$command" in
        scan)
            init_output
            scan
            ;;
        audit)
            init_output
            audit
            ;;
        health)
            init_output
            health
            ;;
        full)
            init_output
            full
            ;;
        help|--help|-h)
            usage
            ;;
        *)
            log_error "Unknown command: $command"
            usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
