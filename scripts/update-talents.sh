#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# 🔄 Update Talents Script
# ═══════════════════════════════════════════════════════════════════════════
# Description: Build and validate talent artifacts for deployment.
#              Runs build process, validates output, and prepares artifacts.
#
# Usage: ./scripts/update-talents.sh [--dry-run]
#
# Prerequisites:
#   - package.json with build script
#   - pnpm installed
#
# Output: ./build/talents.json
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
readonly DRY_RUN="${DRY_RUN:-true}"
readonly BUILD_DIR="${PROJECT_ROOT}/build"
readonly ARTIFACT_PATH="${BUILD_DIR}/talents.json"

log_info() { echo -e "${BLUE}ℹ️  [INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}✅ [SUCCESS]${NC} $*"; }
log_warning() { echo -e "${YELLOW}⚠️  [WARNING]${NC} $*"; }
log_error() { echo -e "${RED}❌ [ERROR]${NC} $*"; }

banner() {
    echo -e "${BLUE}"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "  🔄 Talents Update Tool"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

check_package_json() {
    log_info "Checking for package.json..."
    
    if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
        log_error "package.json not found in ${PROJECT_ROOT}"
        return 1
    fi
    
    if ! grep -q '"build"' "${PROJECT_ROOT}/package.json"; then
        log_warning "No 'build' script found in package.json"
        log_info "Add a build script to package.json, e.g.:"
        echo '  "scripts": { "build": "tsc && node build-talents.js" }'
        return 1
    fi
    
    log_success "package.json OK"
}

ensure_build_dir() {
    log_info "Ensuring build directory exists..."
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_warning "[DRY-RUN] Would create: ${BUILD_DIR}"
    else
        mkdir -p "${BUILD_DIR}"
        log_success "Build directory ready: ${BUILD_DIR}"
    fi
}

run_build() {
    log_info "Running build process..."
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_warning "[DRY-RUN] Would run: pnpm build"
        log_info "Expected output: ${ARTIFACT_PATH}"
    else
        cd "${PROJECT_ROOT}"
        
        if command -v pnpm &> /dev/null; then
            pnpm build
        elif command -v npm &> /dev/null; then
            npm run build
        else
            log_error "Neither pnpm nor npm found"
            return 1
        fi
        
        log_success "Build complete"
    fi
}

validate_artifact() {
    log_info "Validating artifact..."
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_warning "[DRY-RUN] Would validate: ${ARTIFACT_PATH}"
        return 0
    fi
    
    if [[ ! -f "${ARTIFACT_PATH}" ]]; then
        log_error "Artifact not found: ${ARTIFACT_PATH}"
        log_info "Ensure your build script creates this file"
        return 1
    fi
    
    # Check if it's valid JSON
    if ! jq empty "${ARTIFACT_PATH}" 2>/dev/null; then
        log_error "Artifact is not valid JSON"
        return 1
    fi
    
    local size=$(du -h "${ARTIFACT_PATH}" | cut -f1)
    log_info "Artifact size: ${size}"
    log_success "Artifact validation passed"
}

show_next_steps() {
    echo ""
    log_success "Talents artifact is ready!"
    echo ""
    log_info "Next steps:"
    echo "  1. Review artifact: cat ${ARTIFACT_PATH} | jq"
    echo "  2. Deploy with:     ./scripts/deploy-caster.sh --dry-run"
    echo "  3. Live deploy:     DRY_RUN=false ./scripts/deploy-caster.sh"
    echo ""
    
    if [[ -z "${CASTER_KEY:-}" ]]; then
        log_warning "CASTER_KEY not set!"
        echo "  Set it before deployment:"
        echo "    export CASTER_KEY=your_private_key"
        echo ""
    fi
    
    if [[ -z "${PROVIDER_URL:-}" ]]; then
        log_warning "PROVIDER_URL not set!"
        echo "  Set it before deployment:"
        echo "    export PROVIDER_URL=https://mainnet.base.org"
        echo ""
    fi
}

main() {
    banner
    
    # Parse arguments
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
            --help|-h)
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --dry-run       Enable dry-run mode (default)"
                echo "  --no-dry-run    Execute actual build"
                echo "  --help, -h      Show this help message"
                echo ""
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    log_info "DRY_RUN: ${DRY_RUN}"
    log_info "Project: ${PROJECT_ROOT}"
    echo ""
    
    if ! check_package_json; then
        exit 1
    fi
    
    ensure_build_dir
    run_build
    validate_artifact
    show_next_steps
    
    log_success "Update process complete! 🎉"
}

main "$@"
