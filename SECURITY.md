# Security Policy

## Reporting a Vulnerability

We take the security of SmartContractAudit seriously. If you discover a security vulnerability, please follow these guidelines:

### How to Report

**DO NOT** open a public issue for security vulnerabilities.

Instead, please report security issues to:
- **Email**: security@cuberai.example (placeholder contact)
- **Subject**: [SECURITY] Brief description of the issue

### What to Include

When reporting a vulnerability, please provide:

1. **Description** - Clear description of the vulnerability
2. **Impact** - Potential impact and severity assessment
3. **Reproduction Steps** - Detailed steps to reproduce the issue
4. **Affected Versions** - Which versions are affected
5. **Suggested Fix** - If you have ideas for mitigation (optional)
6. **Your Contact Information** - So we can follow up with you

### PGP Encryption (Optional)

For sensitive disclosures, you may encrypt your report using our PGP key:

```
[PGP KEY PLACEHOLDER - To be added]
```

## Reporting Process

1. **Submit Report** - Send your security report via email
2. **Acknowledgment** - We'll acknowledge receipt within 48 hours
3. **Initial Triage** - We'll perform initial assessment within 5 business days
4. **Investigation** - We'll investigate and work on a fix
5. **Resolution** - We'll release a patch and security advisory
6. **Credit** - We'll credit you in the advisory (unless you prefer to remain anonymous)

## Triage SLA

- **Critical vulnerabilities**: Initial response within 24 hours, fix within 7 days
- **High vulnerabilities**: Initial response within 48 hours, fix within 14 days
- **Medium vulnerabilities**: Initial response within 5 days, fix within 30 days
- **Low vulnerabilities**: Initial response within 7 days, fix as appropriate

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < latest| :x:                |

We recommend always using the latest version to receive security updates.

## Security Best Practices

When using SmartContractAudit:

- **Never commit secrets** - Use environment variables for sensitive data
- **Keep dependencies updated** - Regularly update to get security patches
- **Review audit reports** - Check security scan results carefully
- **Use dry-run mode** - Test changes in dry-run mode first
- **Limit permissions** - Use minimal required permissions for tokens/apps

## Disclosure Policy

We follow a coordinated disclosure model:

1. Security issues are fixed privately
2. Patches are released before public disclosure
3. Security advisories are published after patches are available
4. We credit researchers who report vulnerabilities responsibly

## Security Contact

For general security questions or concerns:
- **Email**: security@cuberai.example (placeholder)
- **Response Time**: Within 5 business days

Thank you for helping keep SmartContractAudit and our community safe!
