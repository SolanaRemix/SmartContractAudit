#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# 🚀 Caster Deployment Script
# ═══════════════════════════════════════════════════════════════════════════
# Description: Safe template for deploying smart contracts to ENS domains
#              using the Caster tool. Supports dry-run mode and requires
#              environment variables for credentials.
#
# Usage: ./scripts/deploy-caster.sh [--dry-run] [--network=base]
#
# Environment Variables:
#   CASTER_KEY      - Private key or keystore path for deployment (REQUIRED)
#   PROVIDER_URL    - RPC endpoint URL (e.g., https://mainnet.base.org)
#   ARTIFACT_PATH   - Path to build artifact (default: ./build/talents.json)
#   ENS_NAME        - ENS domain to deploy to (default: gxqstudio.eth)
#   NETWORK         - Network to deploy to (default: base)
#
# Security Notes:
#   - Never commit CASTER_KEY to version control
#   - Store secrets in repository secrets or environment
#   - Always test with --dry-run first
#   - Verify artifact contents before deployment
#
# ═══════════════════════════════════════════════════════════════════════════

set -euo pipefail

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m'

# Configuration
readonly DRY_RUN="${DRY_RUN:-true}"
readonly ARTIFACT_PATH="${ARTIFACT_PATH:-./build/talents.json}"
readonly ENS_NAME="${ENS_NAME:-gxqstudio.eth}"
readonly NETWORK="${NETWORK:-base}"

log_info() { echo -e "${BLUE}ℹ️  [INFO]${NC} $*"; }
log_success() { echo -e "${GREEN}✅ [SUCCESS]${NC} $*"; }
log_warning() { echo -e "${YELLOW}⚠️  [WARNING]${NC} $*"; }
log_error() { echo -e "${RED}❌ [ERROR]${NC} $*"; }

banner() {
    echo -e "${BLUE}"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo "  🚀 Caster Deployment Tool"
    echo "═══════════════════════════════════════════════════════════════════════════"
    echo -e "${NC}"
}

check_dependencies() {
    log_info "Checking dependencies..."
    
    if ! command -v caster &> /dev/null; then
        log_warning "Caster CLI not found. Install from: https://github.com/caster-protocol/caster"
        log_warning "Or use: npm install -g @caster/cli"
        return 1
    fi
    
    log_success "Dependencies OK"
}

check_environment() {
    log_info "Checking environment variables..."
    
    if [[ -z "${CASTER_KEY:-}" ]]; then
        log_error "CASTER_KEY is not set!"
        log_info "Set it with: export CASTER_KEY=your_private_key"
        log_info "Or use keystore: export CASTER_KEY=/path/to/keystore.json"
        return 1
    fi
    
    if [[ -z "${PROVIDER_URL:-}" ]]; then
        log_warning "PROVIDER_URL is not set, using default"
        export PROVIDER_URL="https://mainnet.base.org"
    fi
    
    log_success "Environment OK"
}

check_artifact() {
    log_info "Checking artifact at: ${ARTIFACT_PATH}"
    
    if [[ ! -f "${ARTIFACT_PATH}" ]]; then
        log_error "Artifact not found at: ${ARTIFACT_PATH}"
        log_info "Build artifacts first with: pnpm build or ./scripts/update-talents.sh"
        return 1
    fi
    
    log_info "Artifact size: $(du -h "${ARTIFACT_PATH}" | cut -f1)"
    log_success "Artifact OK"
}

preview_deployment() {
    log_info "Deployment Configuration:"
    echo "  • ENS Name:    ${ENS_NAME}"
    echo "  • Network:     ${NETWORK}"
    echo "  • Artifact:    ${ARTIFACT_PATH}"
    echo "  • Provider:    ${PROVIDER_URL}"
    echo "  • Dry Run:     ${DRY_RUN}"
    echo ""
}

deploy() {
    banner
    
    log_info "Starting deployment process..."
    
    if ! check_dependencies; then
        exit 1
    fi
    
    if ! check_environment; then
        exit 1
    fi
    
    if ! check_artifact; then
        exit 1
    fi
    
    preview_deployment
    
    if [[ "${DRY_RUN}" == "true" ]]; then
        log_warning "🧪 DRY-RUN MODE ENABLED"
        log_info "Would execute the following command:"
        echo ""
        echo "  caster push \\"
        echo "    --ens ${ENS_NAME} \\"
        echo "    --network ${NETWORK} \\"
        echo "    --artifact ${ARTIFACT_PATH} \\"
        echo "    --provider ${PROVIDER_URL}"
        echo ""
        log_warning "Run with DRY_RUN=false to execute actual deployment"
    else
        log_warning "⚡ LIVE DEPLOYMENT MODE"
        log_warning "Deploying to ${NETWORK} network..."
        
        # Example caster command (customize based on actual Caster CLI)
        # caster push --ens "${ENS_NAME}" --network "${NETWORK}" --artifact "${ARTIFACT_PATH}"
        
        log_error "Live deployment is disabled in this template"
        log_info "Uncomment the caster command above and customize for your needs"
        return 1
    fi
    
    log_success "Deployment process complete! 🎉"
}

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
        --network=*)
            export NETWORK="${1#*=}"
            shift
            ;;
        --ens=*)
            export ENS_NAME="${1#*=}"
            shift
            ;;
        --artifact=*)
            export ARTIFACT_PATH="${1#*=}"
            shift
            ;;
        --help|-h)
            banner
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --dry-run          Enable dry-run mode (default)"
            echo "  --no-dry-run       Disable dry-run mode (LIVE deployment)"
            echo "  --network=NAME     Network to deploy to (default: base)"
            echo "  --ens=NAME         ENS domain name (default: gxqstudio.eth)"
            echo "  --artifact=PATH    Artifact file path (default: ./build/talents.json)"
            echo "  --help, -h         Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  CASTER_KEY         Private key or keystore path (REQUIRED)"
            echo "  PROVIDER_URL       RPC endpoint URL"
            echo ""
            echo "Examples:"
            echo "  $0 --dry-run"
            echo "  CASTER_KEY=\$MY_KEY $0 --no-dry-run --network=base"
            echo ""
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            log_info "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Run deployment
deploy
