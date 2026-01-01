#!/bin/bash

#
# Availability Checker for Handles, NPM Packages, PyPI, and GitHub Organizations
# 
# This script checks availability of names across multiple platforms.
# NO SECRETS - This script does not contain or require any credentials.
#
# Usage:
#   ./availability-check.sh <name>
#   ./availability-check.sh smartcontractaudit
#

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    
    case $status in
        "available")
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
            ;;
    esac
}

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
main() {
    if [ $# -eq 0 ]; then
        echo "Usage: $0 <name>"
        echo "Example: $0 smartcontractaudit"
        exit 1
    fi
    
    local name=$1
    
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
main "$@"
