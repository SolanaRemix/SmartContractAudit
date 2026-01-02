#!/usr/bin/env bash
# scan-cyberai-prs.sh
# Scans the repository for all CyberAi/CuberAi related PRs, branches, and commits
# Usage: ./scripts/scan-cyberai-prs.sh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}    CyberAi/CuberAi PR and Branch Scanner${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}\n"

# Function to print section headers
section() {
  echo -e "\n${GREEN}▶ $1${NC}"
  echo "─────────────────────────────────────────────────"
}

# 1. Scan for branches with CyberAi/CuberAi references
section "Branches with CyberAi/CuberAi references"
echo "Searching local and remote branches..."
branches=$(git branch -a 2>/dev/null | grep -iE "cyber|cuber" || echo "")
if [[ -n "$branches" ]]; then
  echo "$branches" | while IFS= read -r branch; do
    echo -e "  ${YELLOW}•${NC} $branch"
  done
else
  echo "  No branches found with CyberAi/CuberAi in name"
fi

# 2. Scan commit history
section "Commits mentioning CyberAi/CuberAi"
echo "Searching commit messages..."
commits=$(git log --all --oneline --grep="cyber\|cuber" -i 2>/dev/null || echo "")
if [[ -n "$commits" ]]; then
  echo "$commits" | head -20 | while IFS= read -r commit; do
    echo -e "  ${YELLOW}•${NC} $commit"
  done
  
  commit_count=$(echo "$commits" | wc -l)
  if [[ $commit_count -gt 20 ]]; then
    echo -e "  ${YELLOW}... and $((commit_count - 20)) more commits${NC}"
  fi
else
  echo "  No commits found with CyberAi/CuberAi in message"
fi

# 3. Scan for files with CyberAi references
section "Files containing CyberAi/CuberAi references"
echo "Searching markdown and script files..."
files=$(find . -type f \( -name "*.md" -o -name "*.sh" -o -name "*.yml" -o -name "*.yaml" \) \
  -not -path "./.git/*" \
  -not -path "./node_modules/*" \
  -exec grep -l "CyberAi\|CuberAi\|cyberai" {} \; 2>/dev/null | sort)

if [[ -n "$files" ]]; then
  echo "$files" | while IFS= read -r file; do
    count=$(grep -c "CyberAi\|CuberAi\|cyberai" "$file" 2>/dev/null || echo "0")
    echo -e "  ${YELLOW}•${NC} $file ${BLUE}($count references)${NC}"
  done
  
  total_files=$(echo "$files" | wc -l)
  echo -e "\n  ${GREEN}Total: $total_files files${NC}"
else
  echo "  No files found with CyberAi/CuberAi references"
fi

# 4. Analyze file types
section "Reference distribution by file type"
if [[ -n "$files" ]]; then
  echo "Breakdown of files containing CyberAi references:"
  
  md_count=$(echo "$files" | grep "\.md$" | wc -l || echo "0")
  sh_count=$(echo "$files" | grep "\.sh$" | wc -l || echo "0")
  yml_count=$(echo "$files" | grep -E "\.(yml|yaml)$" | wc -l || echo "0")
  
  echo -e "  ${YELLOW}•${NC} Markdown files (.md): $md_count"
  echo -e "  ${YELLOW}•${NC} Shell scripts (.sh): $sh_count"
  echo -e "  ${YELLOW}•${NC} YAML/Workflow files (.yml/.yaml): $yml_count"
fi

# 5. Check for open PRs (if gh CLI is available)
section "Pull Request Status"
if command -v gh >/dev/null 2>&1; then
  if gh auth status >/dev/null 2>&1; then
    echo "Checking for CyberAi-related pull requests..."
    
    # Try to list PRs
    prs=$(gh pr list --limit 50 --json number,title,headRefName,state 2>/dev/null || echo "")
    
    if [[ -n "$prs" ]] && [[ "$prs" != "[]" ]]; then
      cyberai_prs=$(echo "$prs" | jq -r '.[] | select(.title | test("cyber|cuber"; "i")) | "\(.number) - \(.title) [\(.state)]"' 2>/dev/null || echo "")
      
      if [[ -n "$cyberai_prs" ]]; then
        echo "$cyberai_prs" | while IFS= read -r pr; do
          echo -e "  ${YELLOW}•${NC} PR #$pr"
        done
      else
        echo "  No open PRs found with CyberAi/CuberAi in title"
      fi
    else
      echo "  No pull requests found in repository"
    fi
  else
    echo -e "  ${YELLOW}gh CLI not authenticated. Run 'gh auth login' to check PRs${NC}"
  fi
else
  echo -e "  ${YELLOW}gh CLI not installed. Install it to scan PRs automatically${NC}"
  echo "  Install: https://cli.github.com/"
fi

# 6. Generate summary report
section "Summary Report"
echo "Repository Analysis Complete"
echo ""
echo "Key Findings:"
echo -e "  ${GREEN}✓${NC} Repository scanned for CyberAi/CuberAi references"

if [[ -n "$files" ]]; then
  total_refs=$(echo "$files" | while IFS= read -r f; do grep -c "CyberAi\|CuberAi\|cyberai" "$f" 2>/dev/null || echo "0"; done | awk '{s+=$1} END {print s}')
  echo -e "  ${GREEN}✓${NC} Found references in $total_files files ($total_refs total mentions)"
else
  echo -e "  ${RED}✗${NC} No files with CyberAi references found"
fi

echo ""
echo -e "${BLUE}Recommendations:${NC}"
echo "  1. Review docs/CYBERAI_ARCHITECTURE.md for deployment guidance"
echo "  2. Clone SmartContractAudit first (foundation repository)"
echo "  3. Review each file/PR individually before merging"
echo "  4. Maintain separation between SmartContract functions and CyberAi Bot"
echo "  5. Use docs/CYBERAI_PR_MERGE_GUIDE.md for safe merge strategy"

echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  • Read: cat docs/CYBERAI_ARCHITECTURE.md"
echo "  • Setup: cat docs/cuberai-setup.md"
echo "  • Review: ./scripts/scan-cyberai-prs.sh --detailed"

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Scan complete!${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
