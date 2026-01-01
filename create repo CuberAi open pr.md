#!/usr/bin/env bash
# create_cuberai_and_pr.sh
# Creates a minimal Draft PR in SolanaRemix/SmartContractAudit and creates/pushes a new SolanaRemix/CuberAi repo scaffold.
# Usage:
#   DRY_RUN=1 ./create_cuberai_and_pr.sh    # prints actions only
#   ./create_cuberai_and_pr.sh              # performs actions (requires gh CLI & git auth)
#
set -euo pipefail

DRY_RUN=${DRY_RUN:-0}
ORG="${ORG:-SolanaRemix}"
AUDIT_REPO="${AUDIT_REPO:-SmartContractAudit}"
CYBER_BRANCH="${CYBER_BRANCH:-CyberAi-minimal}"
CUBER_REPO="${CUBER_REPO:-CuberAi}"
PR_TITLE="Add TRIO pointer, security & PR template, and CODEOWNERS; point to new CuberAi product repo"
PR_BODY_FILE="PR_BODY.md"

run_cmd() {
  if [ "${DRY_RUN}" = "1" ]; then
    echo "[DRY_RUN] $*"
  else
    echo "[RUN] $*"
    eval "$@"
  fi
}

check_requirements() {
  command -v git >/dev/null 2>&1 || { echo "git not found"; exit 1; }
  command -v gh >/dev/null 2>&1 || { echo "gh (GitHub CLI) not found"; exit 1; }
}

confirm_prompt() {
  echo "This script will:"
  echo " - create branch ${CYBER_BRANCH} in ${ORG}/${AUDIT_REPO} from origin/main"
  echo " - add minimal files (TRIO.md, .github/PULL_REQUEST_TEMPLATE.md, CONTRIBUTING.md, SECURITY.md, .github/CODEOWNERS)"
  echo " - commit, push, and open a Draft PR"
  echo " - create new repo ${ORG}/${CUBER_REPO}, populate scaffold, and push initial commit"
  echo ""
  if [ "${DRY_RUN}" = "1" ]; then
    echo "DRY_RUN=1: No remote changes will be made."
  fi
  read -r -p "Proceed? Type 'yes' to continue: " CONF
  if [ "${CONF}" != "yes" ]; then
    echo "Aborted."
    exit 1
  fi
}

make_audit_changes() {
  echo "Preparing minimal changes for ${AUDIT_REPO}..."

  # Ensure we're in the repo root and remote matches
  origin_url=$(git remote get-url origin || echo "")
  if [[ "${origin_url}" != *"${ORG}/${AUDIT_REPO}"* ]]; then
    echo "Warning: origin remote does not look like ${ORG}/${AUDIT_REPO}. origin: ${origin_url}"
    read -r -p "Continue anyway? (yes/no): " c2
    if [ "${c2}" != "yes" ]; then
      echo "Aborted."
      exit 1
    fi
  fi

  run_cmd git fetch origin
  run_cmd git checkout -b "${CYBER_BRANCH}" origin/main

  # Create files
  cat > TRIO.md <<'EOF'
TRIO — Product · Governance · Security

Product: Build CuberAi (SmartBrain) as a safe-by-default security orchestration product.
Governance: Lightweight off-chain governance (Snapshot) + multisig execution when funded.
Security: Dry-run-first scans, human-in-the-loop for fixes, and clear triage owners.

For the full CuberAi product scaffold and governance assets, see: https://github.com/SolanaRemix/CuberAi (placeholder)
EOF

  mkdir -p .github

  cat > .github/PULL_REQUEST_TEMPLATE.md <<'EOF'
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update

## Security checklist
- [ ] No secrets committed
- [ ] DRY_RUN verified for workflows that modify repos (if applicable)
- [ ] Attach any audit artifacts if relevant

## Testing
- [ ] Unit/integration tests added or updated (if applicable)
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated (if applicable)
EOF

  cat > SECURITY.md <<'EOF'
# Security Policy (short)

Report security issues to: security@cuberai.example (placeholder).

- Preferred: email with PGP or an encrypted attachment (PGP key placeholder).
- Acknowledgement: within 48 hours.
- For product-specific triage and issues, see: https://github.com/SolanaRemix/CuberAi (placeholder).

Do not post exploits publicly until coordinated disclosure is agreed.
EOF

  cat > CONTRIBUTING.md <<'EOF'
# Contributing (short)

Thank you for contributing.

- Fork and make a branch: git checkout -b my-change
- Sign commits (DCO): git commit -s -m "msg"
- Use Draft PRs for iterative work.
- Product-specific contributions (CuberAi) belong in SolanaRemix/CuberAi.

See GOVERNANCE.md in the product repo for role definitions and release workflow (when available).
EOF

  cat > .github/CODEOWNERS <<'EOF'
# CODEOWNERS: request reviews
/scripts @SolanaRemix @security-team
/contracts @SolanaRemix @security-team
* @SolanaRemix
EOF

  cat > "${PR_BODY_FILE}" <<'EOF'
Add TRIO pointer, security & PR template, CONTRIBUTING short guide, and CODEOWNERS — point to CuberAi product repo

Summary
- Adds TRIO.md with a short pointer to the CuberAi product repo.
- Adds minimal SECURITY.md, CONTRIBUTING.md, and a concise PR template.
- Adds .github/CODEOWNERS to request security reviews for /scripts and /contracts.

Safety notes
- This is a minimal, non-destructive change. No secrets are added.
- Purpose: keep SmartContractAudit focused; full product scaffold will live in SolanaRemix/CuberAi.
EOF

  run_cmd git add TRIO.md .github/PULL_REQUEST_TEMPLATE.md SECURITY.md CONTRIBUTING.md .github/CODEOWNERS "${PR_BODY_FILE}"
  run_cmd git commit -m "Add TRIO pointer, security & PR template, CONTRIBUTING short guide, and CODEOWNERS — point to CuberAi product repo"
  run_cmd git push -u origin "${CYBER_BRANCH}"

  # Create Draft PR
  run_cmd gh pr create --base main --head "${CYBER_BRANCH}" --title "${PR_TITLE}" --body-file "${PR_BODY_FILE}" --draft
}

make_cuberai_scaffold() {
  echo "Creating CuberAi scaffold in a temporary directory..."

  TMPDIR="$(mktemp -d)"
  echo "Scaffold dir: ${TMPDIR}"
  scaffold_dir="${TMPDIR}/${CUBER_REPO}"
  mkdir -p "${scaffold_dir}"
  cd "${scaffold_dir}"

  # Basic repo files
  cat > LICENSE <<'EOF'
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

Copyright (c) YEAR SolanaRemix

Licensed under the Apache License, Version 2.0 (the "License");
...
(Full Apache-2.0 text recommended - truncated here by script; replace with full text before publishing)
EOF

  cat > README.md <<'EOF'
# CuberAi

CuberAi — SmartBrain: safe-by-default security orchestration.

This repository contains the product scaffold: governance, DAO helpers, web scaffold, and safe CI workflows (dry-run by default).
EOF

  cat > CONTRIBUTING.md <<'EOF'
# Contributing

See CONTRIBUTING guidelines in SmartContractAudit for general process.
Sign commits with DCO: git commit -s -m "msg"
EOF

  cat > CODE_OF_CONDUCT.md <<'EOF'
# Contributor Covenant (short)
Be respectful. Report issues to security@cuberai.example.
EOF

  cat > SECURITY.md <<'EOF'
# Security Policy

Report security issues to security@cuberai.example (placeholder). See SmartContractAudit SECURITY.md for guidelines.
EOF

  cat > GOVERNANCE.md <<'EOF'
# Governance

Lightweight governance and sponsor advisory board. Off-chain proposals in docs/proposals/.
EOF

  cat > FUNDING.yml <<'EOF'
github: []
open_collective: https://opencollective.org/your-project-placeholder
custom: ['mailto:sponsor@cuberai.example']
EOF

  cat > TRIO.md <<'EOF'
TRIO — Product · Governance · Security (CuberAi)

Product: CuberAi (SmartBrain) — safe-by-default security orchestration.
Governance: Snapshot + multisig execution when funded.
Security: DRY_RUN=true, human-in-the-loop for fixes.
EOF

  cat > RELEASE.md <<'EOF'
# RELEASE checklist

Target release tag: v2026.01.01

Run dry-run scans, obtain security signoff, create draft release.
EOF

  # DAO helpers
  mkdir -p docs/dao dao/merkle scripts
  cat > docs/dao/README.md <<'EOF'
---
title: DAO / Contributor Program
description: Overview of the DAO helpers, eligibility, scoring, and airdrop flow.
---

See docs/dao/* for details.
EOF

  cat > docs/dao/eligibility.md <<'EOF'
# Eligibility
Contributors eligible based on code, triage, docs, community contributions.
EOF

  cat > docs/dao/scoring.md <<'EOF'
# Scoring
Example points-based scoring for allocations.
EOF

  cat > docs/dao/merkle.md <<'EOF'
# Merkle Airdrop Flow
Use dao/merkle/generate_merkle.js to produce root and proofs.
EOF

  cat > docs/dao/snapshot.md <<'EOF'
# Snapshot
Set up Snapshot space and strategy per proposal.
EOF

  cat > docs/dao/claiming.md <<'EOF'
# Claiming
Provide off-chain claim endpoint initially; on-chain later when funded.
EOF

  cat > dao/airdrop-sample.json <<'EOF'
{
  "allocations": [
    {"address": "0x0000000000000000000000000000000000000001", "points": 100},
    {"address": "0x0000000000000000000000000000000000000002", "points": 50}
  ],
  "notes": "Sample allocations. Replace with actual data."
}
EOF

  cat > dao/merkle/generate_merkle.js <<'EOF'
#!/usr/bin/env node
// Simple merkle generator (example)
const crypto = require('crypto');
const fs = require('fs');
function sha256(data){return crypto.createHash('sha256').update(data).digest('hex')}
const file = process.argv[2] || 'dao/airdrop-sample.json';
const data = JSON.parse(fs.readFileSync(file,'utf8'));
const leaves = data.allocations.map(a => JSON.stringify(a));
console.log('leaves:', leaves.length);
console.log('root (sample):', sha256(leaves.join('|')));
EOF
  chmod +x dao/merkle/generate_merkle.js

  cat > scripts/availability-check.sh <<'EOF'
#!/usr/bin/env bash
# Basic handle / package availability check (non-exhaustive)
if [ -z "${1-}" ]; then echo "Usage: $0 <handle>"; exit 1; fi
echo "Checking: $1"
EOF
  chmod +x scripts/availability-check.sh

  # partners docs
  mkdir -p docs/partners
  for f in README.md partnerships.md sponsorship_tiers.md technical_onboarding.md data_privacy.md sla_and_support.md use_cases.md press_kit.md contact.md;