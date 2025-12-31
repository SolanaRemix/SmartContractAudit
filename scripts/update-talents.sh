#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# 🔨 Update Talents - Build & Prepare Artifacts Template
# ═══════════════════════════════════════════════════════════════════════════
# Purpose: Build project and prepare deployment artifacts
# Output: ./build/talents.json
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
BUILD_DIR="${BUILD_DIR:-./build}"
OUTPUT_FILE="${BUILD_DIR}/talents.json"

# Banner
echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════════════════"
echo "🔨 Update Talents - Build & Prepare Artifacts"
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

# Check if package.json exists
check_project() {
    log_info "Checking project structure..."
    
    if [[ -f "package.json" ]]; then
        log_success "Found package.json"
        
        # Check for pnpm
        if command -v pnpm &> /dev/null; then
            log_success "pnpm is installed: $(pnpm --version)"
        else
            log_warning "pnpm not found. Install with: npm install -g pnpm"
        fi
    else
        log_warning "package.json not found - skipping npm build steps"
    fi
}

# Build project
build_project() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log_warning "🔒 DRY RUN MODE - No build will occur"
        echo ""
        log_info "Would execute:"
        if [[ -f "package.json" ]]; then
            echo -e "${CYAN}  pnpm install${NC}"
            echo -e "${CYAN}  pnpm build${NC}"
        fi
        echo -e "${CYAN}  mkdir -p $BUILD_DIR${NC}"
        echo -e "${CYAN}  Generate $OUTPUT_FILE${NC}"
        echo ""
        log_info "To perform actual build, run:"
        echo -e "${GREEN}DRY_RUN=false $0 --live${NC}"
    else
        log_info "🔨 Building project..."
        
        if [[ -f "package.json" ]]; then
            # Install dependencies
            if command -v pnpm &> /dev/null; then
                log_info "Installing dependencies with pnpm..."
                pnpm install
            else
                log_warning "pnpm not available, using npm..."
                npm install
            fi
            
            # Run build
            log_info "Running build..."
            if command -v pnpm &> /dev/null; then
                pnpm build
            else
                npm run build
            fi
        fi
        
        # Create build directory
        mkdir -p "$BUILD_DIR"
        log_success "Build directory ready: $BUILD_DIR"
        
        # Generate or validate talents.json
        if [[ -f "$OUTPUT_FILE" ]]; then
            log_success "Artifact exists: $OUTPUT_FILE"
        else
            log_warning "Artifact not found: $OUTPUT_FILE"
            log_info "Creating placeholder artifact..."
            
            cat > "$OUTPUT_FILE" << 'EOF'
{
  "name": "SmartContractAudit Talents",
  "version": "1.0.0",
  "description": "Smart contract audit automation artifacts",
  "generated": "TIMESTAMP_PLACEHOLDER",
  "talents": [
    {
      "id": "security-scanner",
      "name": "Security Scanner",
      "type": "audit",
      "status": "active"
    },
    {
      "id": "code-analyzer",
      "name": "Code Analyzer",
      "type": "analysis",
      "status": "active"
    }
  ]
}
EOF
            # Replace timestamp
            if command -v sed &> /dev/null; then
                sed -i "s/TIMESTAMP_PLACEHOLDER/$(date -u +"%Y-%m-%dT%H:%M:%SZ")/" "$OUTPUT_FILE"
            fi
            
            log_success "Created placeholder artifact: $OUTPUT_FILE"
        fi
    fi
}

# Validate artifact
validate_artifact() {
    if [[ "$DRY_RUN" == "false" ]]; then
        if [[ -f "$OUTPUT_FILE" ]]; then
            log_info "Validating artifact..."
            
            # Check if file is valid JSON
            if command -v jq &> /dev/null; then
                if jq empty "$OUTPUT_FILE" 2>/dev/null; then
                    log_success "Artifact is valid JSON"
                else
                    log_error "Artifact is not valid JSON"
                    exit 1
                fi
            else
                log_warning "jq not installed - skipping JSON validation"
            fi
            
            log_success "Artifact ready: $OUTPUT_FILE"
        else
            log_error "Artifact not found: $OUTPUT_FILE"
            exit 1
        fi
    fi
}

# Print next steps
next_steps() {
    echo ""
    log_success "Build complete!"
    echo ""
    
    if [[ "$DRY_RUN" == "false" ]] && [[ -f "$OUTPUT_FILE" ]]; then
        log_info "Next steps:"
        echo "  1. Review artifact: cat $OUTPUT_FILE"
        echo "  2. Deploy to Base network: ./scripts/deploy-caster.sh"
        echo ""
        log_info "For live deployment, make sure to set:"
        echo "  export CASTER_KEY='your-private-key'"
        echo "  export PROVIDER_URL='https://mainnet.base.org'"
    fi
}

# Main execution
main() {
    log_info "Dry Run: $DRY_RUN"
    log_info "Output: $OUTPUT_FILE"
    echo ""
    
    check_project
    echo ""
    build_project
    echo ""
    validate_artifact
    next_steps
}

# Run main
main

# ═══════════════════════════════════════════════════════════════════════════
# 📝 EXAMPLE USAGE:
# ═══════════════════════════════════════════════════════════════════════════
# 
# Dry run (safe, default):
#   ./scripts/update-talents.sh
#   ./scripts/update-talents.sh --dry-run
# 
# Live build:
#   DRY_RUN=false ./scripts/update-talents.sh --live
# 
# Custom build directory:
#   BUILD_DIR=./dist DRY_RUN=false ./scripts/update-talents.sh --live
# 
# ═══════════════════════════════════════════════════════════════════════════
