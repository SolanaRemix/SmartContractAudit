#!/bin/bash

##############################################################################
# Availability Check Script for SmartContractAudit
#
# Checks availability of usernames/handles across various platforms:
# - GitHub
# - npm
# - PyPI
# - Docker Hub
#
# Usage:
#   ./scripts/availability-check.sh username1 username2 username3
#   ./scripts/availability-check.sh --file usernames.txt
#
# Environment:
#   DRY_RUN=true (default) - Safe mode, no writes
#
# License: Apache-2.0
##############################################################################

set -euo pipefail

# Configuration
DRY_RUN="${DRY_RUN:-true}"
VERBOSE="${VERBOSE:-false}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

##############################################################################
# Helper Functions
##############################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $*"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $*"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $*"
}

log_error() {
    echo -e "${RED}[✗]${NC} $*"
}

log_verbose() {
    if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}[VERBOSE]${NC} $*"
    fi
}

##############################################################################
# Input Validation
##############################################################################

validate_username() {
    local name="$1"
    
    # Check if empty
    if [[ -z "$name" ]]; then
        log_error "Username cannot be empty"
        return 1
    fi
    
    # Validate: only alphanumeric, hyphens, and underscores allowed
    # This prevents command injection via shell metacharacters
    if [[ ! "$name" =~ ^[a-zA-Z0-9_-]+$ ]]; then
        log_error "Invalid username: '$name' (only alphanumeric, hyphens, and underscores allowed)"
        return 1
    fi
    
    return 0
}

##############################################################################
# Availability Checkers
##############################################################################

check_github() {
    local username="$1"
    
    # Validate input to prevent command injection
    if ! validate_username "$username"; then
        return 1
    fi
    
    log_verbose "Checking GitHub for: $username"
    
    # Use printf %s to safely pass username to curl without interpolation
    local url
    url=$(printf "https://api.github.com/users/%s" "$username")
    
    if curl -sf "$url" > /dev/null 2>&1; then
        log_error "GitHub: $username is TAKEN"
        return 1
    else
        log_success "GitHub: $username is AVAILABLE"
        return 0
    fi
}

check_npm() {
    local package="$1"
    
    # Validate input to prevent command injection
    if ! validate_username "$package"; then
        return 1
    fi
    
    log_verbose "Checking npm for: $package"
    
    # Use printf %s to safely pass package name to curl without interpolation
    local url
    url=$(printf "https://registry.npmjs.org/%s" "$package")
    
    if curl -sf "$url" > /dev/null 2>&1; then
        log_error "npm: $package is TAKEN"
        return 1
    else
        log_success "npm: $package is AVAILABLE"
        return 0
    fi
}

check_pypi() {
    local package="$1"
    
    # Validate input to prevent command injection
    if ! validate_username "$package"; then
        return 1
    fi
    
    log_verbose "Checking PyPI for: $package"
    
    # Use printf %s to safely pass package name to curl without interpolation
    local url
    url=$(printf "https://pypi.org/project/%s/" "$package")
    
    if curl -sf "$url" > /dev/null 2>&1; then
        log_error "PyPI: $package is TAKEN"
        return 1
    else
        log_success "PyPI: $package is AVAILABLE"
        return 0
    fi
}

check_dockerhub() {
    local username="$1"
    
    # Validate input to prevent command injection
    if ! validate_username "$username"; then
        return 1
    fi
    
    log_verbose "Checking Docker Hub for: $username"
    
    # Use printf %s to safely pass username to curl without interpolation
    local url
    url=$(printf "https://hub.docker.com/v2/repositories/%s/" "$username")
    
    if curl -sf "$url" > /dev/null 2>&1; then
        log_error "Docker Hub: $username is TAKEN"
        return 1
    else
        log_success "Docker Hub: $username is AVAILABLE"
        return 0
    fi
}

##############################################################################
# Main Check Function
##############################################################################

check_username() {
    local username="$1"
    
    echo ""
    log_info "Checking availability for: ${YELLOW}$username${NC}"
    echo "────────────────────────────────────────────────"
    
    local available=0
    local total=4
    
    check_github "$username" && ((available++)) || true
    check_npm "$username" && ((available++)) || true
    check_pypi "$username" && ((available++)) || true
    check_dockerhub "$username" && ((available++)) || true
    
    echo "────────────────────────────────────────────────"
    
    if [[ $available -eq $total ]]; then
        log_success "SUMMARY: $username is AVAILABLE on all platforms ($available/$total)"
    elif [[ $available -gt 0 ]]; then
        log_warning "SUMMARY: $username is PARTIALLY AVAILABLE ($available/$total platforms)"
    else
        log_error "SUMMARY: $username is NOT AVAILABLE on any platform (0/$total)"
    fi
    
    return 0
}

##############################################################################
# Batch Processing
##############################################################################

check_from_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        log_error "File not found: $file"
        exit 1
    fi
    
    log_info "Reading usernames from: $file"
    
    local count=0
    while IFS= read -r username; do
        # Skip empty lines and comments
        [[ -z "$username" || "$username" =~ ^[[:space:]]*# ]] && continue
        
        check_username "$username"
        ((count++))
    done < "$file"
    
    echo ""
    log_info "Checked $count username(s)"
}

##############################################################################
# Usage and Help
##############################################################################

show_usage() {
    cat <<EOF
Availability Check Script

Usage:
    $0 <username1> [username2 username3 ...]
    $0 --file <usernames.txt>

Options:
    --file FILE     Read usernames from file (one per line)
    --verbose       Enable verbose output
    --help          Show this help message

Environment Variables:
    DRY_RUN=true    Safe mode (default: true)
    VERBOSE=true    Enable verbose output

Checks:
    - GitHub username availability
    - npm package name availability
    - PyPI package name availability
    - Docker Hub username availability

Examples:
    $0 myusername
    $0 user1 user2 user3
    $0 --file contributors.txt
    VERBOSE=true $0 myusername

Exit Codes:
    0 - Success (all checks completed)
    1 - Error (invalid input or file not found)

EOF
}

##############################################################################
# Main Entry Point
##############################################################################

main() {
    # Show DRY_RUN status
    if [[ "$DRY_RUN" == "true" ]]; then
        log_info "[DRY-RUN MODE] Running in safe mode (read-only)"
    fi
    
    # Check for required commands
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    # Parse arguments
    if [[ $# -eq 0 ]]; then
        show_usage
        exit 1
    fi
    
    case "$1" in
        --help|-h)
            show_usage
            exit 0
            ;;
        --file)
            if [[ $# -lt 2 ]]; then
                log_error "Missing filename argument"
                show_usage
                exit 1
            fi
            check_from_file "$2"
            ;;
        --verbose)
            VERBOSE=true
            shift
            main "$@"
            ;;
        *)
            # Check each username provided as argument
            for username in "$@"; do
                check_username "$username"
            done
            ;;
    esac
}

# Run main function with all arguments
main "$@"
