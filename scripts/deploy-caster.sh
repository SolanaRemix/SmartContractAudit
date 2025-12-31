#!/usr/bin/env bash
################################################################################
# 🎯 Caster Deployment Script
# 
# Purpose: Deploy smart contracts/talents to ENS via Caster
# Network: Base (gxqstudio.eth)
# Safety: DRY_RUN enabled by default
#
# 🔐 Required Environment Variables:
#   CASTER_KEY       - Your Caster deployment key
#   PROVIDER_URL     - RPC endpoint URL (e.g., https://base.llamarpc.com)
#
# 📝 Usage:
#   # Dry-run (safe, default)
#   ./deploy-caster.sh
#
#   # Live deployment (requires secrets)
#   DRY_RUN=false CASTER_KEY=xxx PROVIDER_URL=yyy ./deploy-caster.sh
#
#   # With explicit dry-run flag
#   ./deploy-caster.sh --dry-run
#
# 🚀 Example deployment command (when secrets are set):
#   caster push --ens gxqstudio.eth --network base --artifact ./build/talents.json
#
################################################################################

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DRY_RUN="${DRY_RUN:-true}"
ENS_NAME="${ENS_NAME:-gxqstudio.eth}"
NETWORK="${NETWORK:-base}"
ARTIFACT="${ARTIFACT:-./build/talents.json}"
CASTER_KEY="${CASTER_KEY:-}"
PROVIDER_URL="${PROVIDER_URL:-}"

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $*" >&2
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $*" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $*" >&2
}

banner() {
    echo -e "${BLUE}"
    echo "╔════════════════════════════════════════════════════╗"
    echo "║  🎯 Caster Deployment Script                      ║"
    echo "║  Deploy to: $ENS_NAME (${NETWORK})                  ║"
    echo "╚════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

# Parse arguments
for arg in "$@"; do
    case $arg in
        --dry-run)
            DRY_RUN=true
            ;;
        --live)
            DRY_RUN=false
            ;;
        --help)
            banner
            echo "Usage: $0 [--dry-run|--live] [--help]"
            echo ""
            echo "Options:"
            echo "  --dry-run    Run in dry-run mode (default)"
            echo "  --live       Run in live deployment mode"
            echo "  --help       Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  DRY_RUN      Set to 'false' for live deployment (default: true)"
            echo "  CASTER_KEY   Your Caster deployment key (required for live)"
            echo "  PROVIDER_URL RPC endpoint URL (required for live)"
            echo "  ENS_NAME     Target ENS name (default: gxqstudio.eth)"
            echo "  NETWORK      Target network (default: base)"
            echo "  ARTIFACT     Path to build artifact (default: ./build/talents.json)"
            exit 0
            ;;
    esac
done

banner

log_info "Configuration:"
log_info "  DRY_RUN: $DRY_RUN"
log_info "  ENS: $ENS_NAME"
log_info "  Network: $NETWORK"
log_info "  Artifact: $ARTIFACT"

# Check for required secrets
if [[ "$DRY_RUN" == "false" ]]; then
    if [[ -z "$CASTER_KEY" ]]; then
        log_error "CASTER_KEY environment variable is required for live deployment"
        log_info "Set it with: export CASTER_KEY=your_key_here"
        exit 1
    fi
    
    if [[ -z "$PROVIDER_URL" ]]; then
        log_error "PROVIDER_URL environment variable is required for live deployment"
        log_info "Set it with: export PROVIDER_URL=https://base.llamarpc.com"
        exit 1
    fi
    
    log_success "Secrets detected (keys masked for security)"
fi

# Check artifact exists
if [[ ! -f "$ARTIFACT" ]]; then
    log_error "Artifact not found: $ARTIFACT"
    log_info "Run './scripts/update-talents.sh' to build artifacts"
    exit 1
fi

log_success "Artifact found: $ARTIFACT"

# Validate artifact structure
if command -v jq &> /dev/null; then
    if ! jq empty "$ARTIFACT" 2>/dev/null; then
        log_error "Artifact is not valid JSON"
        exit 1
    fi
    log_success "Artifact validation passed"
fi

# Show deployment plan
log_info "Deployment plan:"
log_info "  Command: caster push"
log_info "  Target: --ens $ENS_NAME"
log_info "  Network: --network $NETWORK"
log_info "  Artifact: --artifact $ARTIFACT"

if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "🔒 DRY_RUN MODE: No actual deployment will occur"
    log_info ""
    log_info "To deploy for real, run:"
    log_info "  DRY_RUN=false CASTER_KEY=xxx PROVIDER_URL=yyy $0"
    log_info ""
    log_info "Or use the --live flag:"
    log_info "  CASTER_KEY=xxx PROVIDER_URL=yyy $0 --live"
else
    log_warn "🚀 LIVE DEPLOYMENT MODE"
    log_info "Deploying to $ENS_NAME on $NETWORK..."
    
    # Uncomment and customize this command when caster is available:
    # caster push \
    #     --ens "$ENS_NAME" \
    #     --network "$NETWORK" \
    #     --artifact "$ARTIFACT" \
    #     --provider-url "$PROVIDER_URL" \
    #     --key "$CASTER_KEY"
    
    log_warn "Caster command is commented out for safety"
    log_info "Uncomment the deployment command in this script when ready"
fi

log_success "Deployment script complete! 🎉"
