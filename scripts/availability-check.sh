#!/bin/bash

<<<<<<< HEAD
<<<<<<< HEAD
# Availability Check Script
# Checks handle, package, and organization name availability across platforms
=======
#
# Availability Checker for Handles, NPM Packages, PyPI, and GitHub Organizations
# 
# This script checks availability of names across multiple platforms.
# NO SECRETS - This script does not contain or require any credentials.
>>>>>>> origin/pr9
#
# Usage:
#   ./availability-check.sh <name>
#   ./availability-check.sh smartcontractaudit
#
<<<<<<< HEAD
# Checks:
#   - GitHub username/org
#   - npm package
#   - PyPI package
#   - Domain availability (basic)
#
# SECURITY: No secrets or API keys required
# DRY RUN: Safe to run, only performs read-only checks
=======
>>>>>>> origin/pr9

set -euo pipefail

# Colors for output
=======
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
>>>>>>> origin/pr10
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

<<<<<<< HEAD
# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "available")
<<<<<<< HEAD
            echo -e "${GREEN}✓${NC} $message"
            ;;
        "taken")
            echo -e "${RED}✗${NC} $message"
            ;;
        "unknown")
            echo -e "${YELLOW}?${NC} $message"
            ;;
        "info")
            echo -e "${BLUE}ℹ${NC} $message"
=======
            echo -e "${GREEN}✓ AVAILABLE${NC} - $message"
            ;;
        "taken")
            echo -e "${RED}✗ TAKEN${NC} - $message"
            ;;
        "error")
            echo -e "${YELLOW}? ERROR${NC} - $message"
            ;;
        "info")
            echo -e "${BLUE}ℹ INFO${NC} - $message"
>>>>>>> origin/pr9
=======
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
# Availability Checkers
##############################################################################

check_github() {
    local username="$1"
    log_verbose "Checking GitHub for: $username"
    
    if curl -sf "https://api.github.com/users/$username" > /dev/null 2>&1; then
        log_error "GitHub: $username is TAKEN"
        return 1
    else
        log_success "GitHub: $username is AVAILABLE"
        return 0
    fi
}

check_npm() {
    local package="$1"
    log_verbose "Checking npm for: $package"
    
    if curl -sf "https://registry.npmjs.org/$package" > /dev/null 2>&1; then
        log_error "npm: $package is TAKEN"
        return 1
    else
        log_success "npm: $package is AVAILABLE"
        return 0
    fi
}

check_pypi() {
    local package="$1"
    log_verbose "Checking PyPI for: $package"
    
    if curl -sf "https://pypi.org/project/$package/" > /dev/null 2>&1; then
        log_error "PyPI: $package is TAKEN"
        return 1
    else
        log_success "PyPI: $package is AVAILABLE"
        return 0
    fi
}

check_dockerhub() {
    local username="$1"
    log_verbose "Checking Docker Hub for: $username"
    
    if curl -sf "https://hub.docker.com/v2/repositories/$username/" > /dev/null 2>&1; then
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
>>>>>>> origin/pr10
            ;;
    esac
}

<<<<<<< HEAD
<<<<<<< HEAD
# Function to check GitHub
check_github() {
    local name=$1
    print_status "info" "Checking GitHub..."
    
    # Check username
    if curl -s -o /dev/null -w "%{http_code}" "https://github.com/$name" | grep -q "200"; then
        print_status "taken" "GitHub username: $name is TAKEN"
        echo "           URL: https://github.com/$name"
    else
        print_status "available" "GitHub username: $name is AVAILABLE"
    fi
    
    echo ""
}

# Function to check npm
check_npm() {
    local name=$1
    print_status "info" "Checking npm..."
    
    if curl -s "https://registry.npmjs.org/$name" | grep -q "error"; then
        print_status "available" "npm package: $name is AVAILABLE"
    else
        print_status "taken" "npm package: $name is TAKEN"
        echo "           URL: https://www.npmjs.com/package/$name"
    fi
    
    echo ""
}

# Function to check PyPI
check_pypi() {
    local name=$1
    print_status "info" "Checking PyPI..."
    
    if curl -s -o /dev/null -w "%{http_code}" "https://pypi.org/project/$name/" | grep -q "404"; then
        print_status "available" "PyPI package: $name is AVAILABLE"
    else
        print_status "taken" "PyPI package: $name is TAKEN"
        echo "           URL: https://pypi.org/project/$name/"
    fi
    
    echo ""
}

# Function to check domain (basic)
check_domain() {
    local name=$1
    print_status "info" "Checking domain availability (basic check)..."
    
    # Check .com
    if curl -s -o /dev/null -w "%{http_code}" "https://$name.com" | grep -qE "200|301|302"; then
        print_status "taken" "Domain: $name.com appears TAKEN or has DNS"
    else
        print_status "unknown" "Domain: $name.com - DNS not resolving (may be available)"
    fi
    
    # Check .org
    if curl -s -o /dev/null -w "%{http_code}" "https://$name.org" | grep -qE "200|301|302"; then
        print_status "taken" "Domain: $name.org appears TAKEN or has DNS"
    else
        print_status "unknown" "Domain: $name.org - DNS not resolving (may be available)"
    fi
    
    echo ""
}

# Function to check social media (basic)
check_social() {
    local name=$1
    print_status "info" "Checking social media handles..."
    
    # Twitter/X (basic check)
    if curl -s -o /dev/null -w "%{http_code}" "https://twitter.com/$name" | grep -q "200"; then
        print_status "taken" "Twitter/X: @$name is TAKEN"
        echo "           URL: https://twitter.com/$name"
    else
        print_status "unknown" "Twitter/X: @$name - check manually"
    fi
    
    echo ""
}

# Main function
=======
# Check NPM package availability
check_npm() {
    local name=$1
    echo -e "\n${BLUE}📦 Checking NPM...${NC}"
    
    if command -v npm &> /dev/null; then
        if npm view "$name" version &> /dev/null; then
            local version=$(npm view "$name" version 2>/dev/null)
            print_status "taken" "Package exists (v$version)"
            echo "   URL: https://www.npmjs.com/package/$name"
        else
            print_status "available" "Package name is available"
            echo "   Register at: https://www.npmjs.com/package/$name"
        fi
    else
        print_status "error" "npm not installed"
    fi
}

# Check PyPI package availability
check_pypi() {
    local name=$1
    echo -e "\n${BLUE}🐍 Checking PyPI...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://pypi.org/project/$name/")
    
    if [ "$response" = "200" ]; then
        print_status "taken" "Package exists"
        echo "   URL: https://pypi.org/project/$name/"
    elif [ "$response" = "404" ]; then
        print_status "available" "Package name is available"
        echo "   Register at: https://pypi.org/"
    else
        print_status "error" "Could not check (HTTP $response)"
    fi
}

# Check GitHub organization availability
check_github_org() {
    local name=$1
    echo -e "\n${BLUE}🐙 Checking GitHub Organization...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://github.com/$name")
    
    if [ "$response" = "200" ]; then
        print_status "taken" "Organization/User exists"
        echo "   URL: https://github.com/$name"
    elif [ "$response" = "404" ]; then
        print_status "available" "Name is available"
        echo "   Create at: https://github.com/organizations/new"
    else
        print_status "error" "Could not check (HTTP $response)"
    fi
}

# Check GitHub username availability
check_github_user() {
    local name=$1
    echo -e "\n${BLUE}👤 Checking GitHub Username...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://github.com/$name")
    
    if [ "$response" = "200" ]; then
        print_status "taken" "Username exists"
        echo "   Profile: https://github.com/$name"
    elif [ "$response" = "404" ]; then
        print_status "available" "Username is available"
        echo "   Sign up at: https://github.com/signup"
    else
        print_status "error" "Could not check (HTTP $response)"
    fi
}

# Check domain availability (basic DNS check)
check_domain() {
    local name=$1
    echo -e "\n${BLUE}🌐 Checking Domain (.com)...${NC}"
    
    if command -v dig &> /dev/null; then
        if dig +short "$name.com" | grep -q .; then
            print_status "taken" "Domain registered"
            echo "   Domain: $name.com"
        else
            print_status "available" "Domain might be available"
            echo "   Check at: https://www.namecheap.com/domains/registration/results/?domain=$name"
        fi
    else
        local response=$(curl -s -o /dev/null -w "%{http_code}" "http://$name.com")
        if [ "$response" = "200" ] || [ "$response" = "301" ] || [ "$response" = "302" ]; then
            print_status "taken" "Domain registered"
            echo "   Website: http://$name.com"
        else
            print_status "available" "Domain might be available"
            echo "   Check at: https://www.namecheap.com/domains/registration/results/?domain=$name"
        fi
    fi
}

# Check Docker Hub
check_dockerhub() {
    local name=$1
    echo -e "\n${BLUE}🐳 Checking Docker Hub...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://hub.docker.com/r/$name")
    
    if [ "$response" = "200" ]; then
        print_status "taken" "Organization exists"
        echo "   URL: https://hub.docker.com/r/$name"
    else
        print_status "available" "Name might be available"
        echo "   Create at: https://hub.docker.com/"
    fi
}

# Check Twitter handle (basic check)
check_twitter() {
    local name=$1
    echo -e "\n${BLUE}🐦 Checking Twitter/X...${NC}"
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "https://twitter.com/$name")
    
    if [ "$response" = "200" ]; then
        print_status "taken" "Handle exists"
        echo "   Profile: https://twitter.com/$name"
    elif [ "$response" = "404" ]; then
        print_status "available" "Handle might be available"
        echo "   Sign up at: https://twitter.com/signup"
    else
        print_status "error" "Could not check (HTTP $response)"
    fi
}

# Main script
>>>>>>> origin/pr9
main() {
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <name>"
        echo "Example: $0 smartcontractaudit"
        exit 1
    fi
    
    local name=$1
    
<<<<<<< HEAD
    echo ""
    echo "═══════════════════════════════════════════"
    echo "  Availability Checker"
    echo "═══════════════════════════════════════════"
    echo "  Checking availability for: $name"
    echo "═══════════════════════════════════════════"
    echo ""
    
    # Run checks
    check_github "$name"
    check_npm "$name"
    check_pypi "$name"
    check_domain "$name"
    check_social "$name"
    
    echo "═══════════════════════════════════════════"
    echo "  Check Complete"
    echo "═══════════════════════════════════════════"
    echo ""
    echo "Notes:"
    echo "  ✓ = Available or likely available"
    echo "  ✗ = Taken or in use"
    echo "  ? = Unknown, manual verification recommended"
    echo ""
    echo "IMPORTANT: These checks are basic and may not be 100% accurate."
    echo "Always verify manually before claiming a name."
    echo ""
}

# Run main
=======
    echo "╔════════════════════════════════════════════════╗"
    echo "║     🔍 Availability Checker                    ║"
    echo "╚════════════════════════════════════════════════╝"
    echo ""
    echo "Checking availability for: ${BLUE}$name${NC}"
    
    # Run all checks
    check_npm "$name"
    check_pypi "$name"
    check_github_org "$name"
    check_github_user "$name"
    check_domain "$name"
    check_dockerhub "$name"
    check_twitter "$name"
    
    echo ""
    echo "╔════════════════════════════════════════════════╗"
    echo "║     ✨ Check Complete                          ║"
    echo "╚════════════════════════════════════════════════╝"
    echo ""
    echo "Note: These checks are basic and may not be 100% accurate."
    echo "Always verify on the official platform before registering."
}

# Run main function
>>>>>>> origin/pr9
=======
# Run main function with all arguments
>>>>>>> origin/pr10
main "$@"
