# Security Policy

## Reporting a Vulnerability

The SmartContractAudit team takes security issues seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

To report a security vulnerability, please use one of the following methods:

1. **Email**: Send details to **security@cuberai.example**
2. **PGP Encrypted** (recommended for sensitive issues):
   - PGP Key ID: [TO BE ADDED]
   - Fingerprint: [TO BE ADDED]
   - Key available at: [KEY URL TO BE ADDED]

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and attack scenarios
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Proof of Concept**: Code, screenshots, or logs demonstrating the issue
- **Environment**: Relevant version numbers, configurations, etc.
- **Suggested Fix**: If you have ideas for remediation (optional)

### Reporting Process

1. **Initial Report**: Submit your report via email
2. **Acknowledgment**: We will acknowledge receipt within **48 hours**
3. **Triage**: We will assess the severity and validity within **5 business days**
4. **Updates**: We will provide status updates every **7 days** during investigation
5. **Resolution**: We will work on a fix and coordinate disclosure timing with you
6. **Credit**: With your permission, we will credit you in our security advisory

### Response Timeline (SLA)

- **Critical vulnerabilities**: Response within 24 hours, fix within 7 days
- **High severity**: Response within 48 hours, fix within 14 days
- **Medium severity**: Response within 5 days, fix within 30 days
- **Low severity**: Response within 7 days, fix within 60 days

## Security Disclosure Policy

### Coordinated Disclosure

We follow a coordinated disclosure process:

1. Security researchers report vulnerabilities privately
2. We work with researchers to understand and fix issues
3. We coordinate on appropriate disclosure timing
4. Public disclosure occurs after fixes are deployed

### Public Disclosure

- We will publish security advisories for all confirmed vulnerabilities
- Advisories include severity rating, affected versions, and mitigation steps
- We credit researchers who report issues (unless they request anonymity)

## Scope

### In Scope

- All code in this repository
- Smart contract vulnerabilities
- Authentication and authorization issues
- Injection vulnerabilities (SQL, command, etc.)
- Cryptographic weaknesses
- Information disclosure
- Denial of service issues
- Configuration vulnerabilities

### Out of Scope

- Social engineering attacks
- Physical attacks
- Denial of service through resource exhaustion
- Issues in third-party dependencies (report to those projects)
- Issues requiring physical access to systems

## Security Best Practices

### For Contributors

- Never commit secrets, private keys, or credentials
- Use environment variables for configuration
- Run security checks before submitting PRs
- Follow secure coding guidelines
- Use DRY_RUN mode for testing potentially destructive operations

### For Users

- Keep dependencies up to date
- Use strong authentication
- Enable all security features
- Monitor security advisories
- Report suspicious activity

## Security Features

This project includes:

- **GitAntivirus Workflow**: Automated security scanning (dry-run by default)
- **Secret Detection**: Prevents accidental commit of sensitive data
- **Code Review**: All changes reviewed for security implications
- **Dependency Scanning**: Regular checks for vulnerable dependencies
- **Conservative Defaults**: DRY_RUN=true, auto_apply=false

## PGP Key

For sensitive security reports, please use PGP encryption:

```
[PGP PUBLIC KEY BLOCK TO BE ADDED]
```

## Contact

- **Security Email**: security@cuberai.example
- **General Contact**: See [GOVERNANCE.md](GOVERNANCE.md) for maintainer contacts

## Acknowledgments

We thank the security researchers who have helped make this project more secure:

- [List of credited researchers to be maintained here]

## Updates

This security policy was last updated on 2025-12-31.
