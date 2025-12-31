#!/usr/bin/env bash
################################################################################
# 🔨 Update Talents Artifact Builder
#
# Purpose: Build and validate talents.json artifact for deployment
# Safety: DRY_RUN enabled by default
#
# 📋 Process:
#   1. Check for package.json
#   2. Run 'pnpm build' if available
#   3. Build artifact to ./build/talents.json
#   4. Validate artifact structure
#   5. Report results
#
# 📝 Usage:
#   # Dry-run (safe, default)
#   ./update-talents.sh
#
#   # Live build (creates actual files)
#   DRY_RUN=false ./update-talents.sh
#
#   # With explicit dry-run flag
#   ./update-talents.sh --dry-run
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
BUILD_DIR="${BUILD_DIR:-./build}"
ARTIFACT="${ARTIFACT:-$BUILD_DIR/talents.json}"

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
    echo "║  🔨 Update Talents Artifact Builder               ║"
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
            echo "  --live       Run in live build mode"
            echo "  --help       Show this help message"
            echo ""
            echo "Environment Variables:"
            echo "  DRY_RUN      Set to 'false' for live build (default: true)"
            echo "  BUILD_DIR    Output directory (default: ./build)"
            echo "  ARTIFACT     Output artifact path (default: ./build/talents.json)"
            exit 0
            ;;
    esac
done

banner

log_info "Configuration:"
log_info "  DRY_RUN: $DRY_RUN"
log_info "  BUILD_DIR: $BUILD_DIR"
log_info "  ARTIFACT: $ARTIFACT"

# Check for package.json
if [[ -f "package.json" ]]; then
    log_success "package.json found"
    
    # Check for build script
    if command -v jq &> /dev/null; then
        if jq -e '.scripts.build' package.json &> /dev/null; then
            log_success "Build script detected in package.json"
            
            if [[ "$DRY_RUN" == "false" ]]; then
                log_info "Running pnpm build..."
                if command -v pnpm &> /dev/null; then
                    pnpm build
                else
                    log_warn "pnpm not found, trying npm..."
                    npm run build
                fi
            else
                log_info "DRY_RUN: Would run 'pnpm build'"
            fi
        else
            log_warn "No build script found in package.json"
        fi
    fi
else
    log_warn "No package.json found, skipping build step"
fi

# Build artifact directory
if [[ "$DRY_RUN" == "false" ]]; then
    mkdir -p "$BUILD_DIR"
    log_success "Build directory created/verified: $BUILD_DIR"
else
    log_info "DRY_RUN: Would create directory $BUILD_DIR"
fi

# Check if artifact exists
if [[ -f "$ARTIFACT" ]]; then
    log_success "Artifact exists: $ARTIFACT"
    
    # Validate artifact
    if command -v jq &> /dev/null; then
        if jq empty "$ARTIFACT" 2>/dev/null; then
            log_success "Artifact is valid JSON"
            
            # Show artifact summary
            local size=$(wc -c < "$ARTIFACT" | tr -d ' ')
            log_info "Artifact size: $size bytes"
            
            if jq -e '.version' "$ARTIFACT" &> /dev/null; then
                local version=$(jq -r '.version' "$ARTIFACT")
                log_info "Artifact version: $version"
            fi
        else
            log_error "Artifact is not valid JSON"
            exit 1
        fi
    else
        log_warn "jq not available, skipping JSON validation"
    fi
else
    if [[ "$DRY_RUN" == "false" ]]; then
        log_warn "Artifact not found: $ARTIFACT"
        log_info "Creating placeholder artifact..."
        
        cat > "$ARTIFACT" <<EOF
{
  "version": "1.0.0",
  "timestamp": "$(date -Iseconds)",
  "talents": [],
  "metadata": {
    "generator": "update-talents.sh",
    "network": "base",
    "ens": "gxqstudio.eth"
  }
}
EOF
        log_success "Placeholder artifact created"
    else
        log_info "DRY_RUN: Would create artifact $ARTIFACT"
    fi
fi

# Final instructions
if [[ "$DRY_RUN" == "true" ]]; then
    log_warn "🔒 DRY_RUN MODE: No files were modified"
    log_info ""
    log_info "To build for real, run:"
    log_info "  DRY_RUN=false $0"
    log_info ""
    log_info "Or use the --live flag:"
    log_info "  $0 --live"
else
    log_success "Build complete! 🎉"
    log_info ""
    log_info "Next steps:"
    log_info "  1. Review artifact: cat $ARTIFACT"
    log_info "  2. Deploy with: ./scripts/deploy-caster.sh"
fi

log_info ""
log_info "Note: Ensure CASTER_KEY and PROVIDER_URL are set before deploying"
