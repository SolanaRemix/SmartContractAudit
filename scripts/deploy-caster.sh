#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# 🚀 Deploy Caster - Safe Deployment Template
# ═══════════════════════════════════════════════════════════════════════════
# Purpose: Deploy smart contract artifacts to ENS using Caster
# Network: Base (Chain ID: 8453)
# ENS Target: gxqstudio.eth
# ═══════════════════════════════════════════════════════════════════════════
# ⚠️  IMPORTANT: This script requires environment variables:
#     - CASTER_KEY: Your deployment private key or mnemonic
#     - PROVIDER_URL: RPC endpoint for Base network
# 
# 🔒 SECURITY: Never commit secrets to version control!
#              Use GitHub Secrets or local .env files
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default configuration
DRY_RUN="${DRY_RUN:-true}"
NETWORK="${NETWORK:-base}"
ENS_NAME="${ENS_NAME:-gxqstudio.eth}"
ARTIFACT_PATH="${ARTIFACT_PATH:-./build/talents.json}"

# Banner
echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════════════════"
echo "🚀 Deploy Caster - Safe Deployment Script"
echo "═══════════════════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Parse arguments
for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --live)
            DRY_RUN=false
            shift
            ;;
        --network=*)
            NETWORK="${arg#*=}"
            shift
            ;;
        --ens=*)
            ENS_NAME="${arg#*=}"
            shift
            ;;
        --artifact=*)
            ARTIFACT_PATH="${arg#*=}"
            shift
            ;;
        *)
            # Unknown option
            ;;
    esac
done

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

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if caster is available
    if ! command -v caster &> /dev/null; then
        log_warning "Caster CLI not found. Install from: https://github.com/caster-project/caster"
        log_info "Example: npm install -g @caster/cli"
    else
        log_success "Caster CLI found: $(caster --version 2>/dev/null || echo 'version unknown')"
    fi
    
    # Check artifact file
    if [[ ! -f "$ARTIFACT_PATH" ]]; then
        log_error "Artifact not found: $ARTIFACT_PATH"
        log_info "Run 'pnpm build' or './scripts/update-talents.sh' first"
        exit 1
    else
        log_success "Artifact found: $ARTIFACT_PATH"
    fi
    
    # Check environment variables
    if [[ -z "${CASTER_KEY}" ]]; then
        log_warning "CASTER_KEY not set - required for live deployment"
    fi
    
    if [[ -z "${PROVIDER_URL}" ]]; then
        log_warning "PROVIDER_URL not set - required for live deployment"
        log_info "Example: export PROVIDER_URL=https://mainnet.base.org"
    fi
}

# Deploy function
deploy() {
    log_info "Configuration:"
    log_info "  Network: $NETWORK"
    log_info "  ENS: $ENS_NAME"
    log_info "  Artifact: $ARTIFACT_PATH"
    log_info "  Dry Run: $DRY_RUN"
    echo ""
    
    if [[ "$DRY_RUN" == "true" ]]; then
        log_warning "🔒 DRY RUN MODE - No deployment will occur"
        echo ""
        log_info "Would execute command:"
        echo -e "${CYAN}caster push --ens $ENS_NAME --network $NETWORK --artifact $ARTIFACT_PATH${NC}"
        echo ""
        log_info "To perform actual deployment, run:"
        echo -e "${GREEN}DRY_RUN=false $0 --live${NC}"
        echo ""
        log_warning "Make sure to set required environment variables:"
        echo "  export CASTER_KEY='your-private-key-or-mnemonic'"
        echo "  export PROVIDER_URL='https://mainnet.base.org'"
    else
        if [[ -z "${CASTER_KEY}" ]] || [[ -z "${PROVIDER_URL}" ]]; then
            log_error "Missing required environment variables for live deployment"
            log_error "Please set CASTER_KEY and PROVIDER_URL"
            exit 1
        fi
        
        log_info "🚀 Executing live deployment..."
        
        # Example deployment command (uncomment when ready to use):
        # caster push --ens "$ENS_NAME" --network "$NETWORK" --artifact "$ARTIFACT_PATH"
        
        log_warning "Deployment command is commented out for safety"
        log_info "Uncomment the deployment line in this script when ready"
        log_success "Deployment preparation complete!"
    fi
}

# Main execution
main() {
    check_prerequisites
    echo ""
    deploy
    echo ""
    log_success "Deploy script complete!"
}

# Run main
main

# ═══════════════════════════════════════════════════════════════════════════
# 📝 EXAMPLE USAGE:
# ═══════════════════════════════════════════════════════════════════════════
# 
# Dry run (safe, default):
#   ./scripts/deploy-caster.sh
#   ./scripts/deploy-caster.sh --dry-run
# 
# Live deployment (requires secrets):
#   export CASTER_KEY='your-secret-key'
#   export PROVIDER_URL='https://mainnet.base.org'
#   DRY_RUN=false ./scripts/deploy-caster.sh --live
# 
# Custom configuration:
#   ./scripts/deploy-caster.sh --network=base --ens=gxqstudio.eth --artifact=./build/talents.json
# 
# ═══════════════════════════════════════════════════════════════════════════
