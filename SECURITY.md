# Security Policy

<<<<<<< HEAD
<<<<<<< HEAD
## Reporting a Vulnerability

<<<<<<< HEAD
The SmartContractAudit team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:

**security@cuberai.example** (placeholder contact)

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information in your report:

- Type of vulnerability (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the vulnerability
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

This information will help us triage your report more quickly.

## PGP Key

For sensitive security reports, you may encrypt your message using our PGP key:

```
[PGP KEY PLACEHOLDER - To be provided]
```

## Disclosure Process

1. **Report Received**: Security reports are acknowledged within 48 hours
2. **Initial Triage**: We assess the severity and scope within 5 business days
3. **Investigation**: The security team investigates and develops a fix
4. **Coordinated Disclosure**: We work with you on disclosure timeline
5. **Release**: Security patches are released and vulnerabilities disclosed

### Triage SLA

- **Critical vulnerabilities**: Initial response within 24 hours, fix target within 7 days
- **High severity**: Initial response within 48 hours, fix target within 14 days
- **Medium severity**: Initial response within 5 days, fix target within 30 days
- **Low severity**: Initial response within 7 days, fix target within 60 days
=======
## Vulnerability Disclosure Policy

The CyberAi project takes security seriously. We appreciate responsible disclosure of security vulnerabilities and will work with security researchers to resolve issues quickly.

## Reporting a Vulnerability

If you discover a security vulnerability, please follow these steps:

### 1. Do Not Publicly Disclose

Please **do not** open a public GitHub issue for security vulnerabilities. This could put the community at risk.

### 2. Report Privately

Send details of the vulnerability to:

**security@cyberai.network**

### 3. Include the Following Information

To help us triage and address the issue quickly, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and attack scenarios
- **Affected versions**: Which versions are affected
- **Reproduction steps**: Step-by-step instructions to reproduce the issue
- **Proof of concept**: Sample code, screenshots, or logs if available
- **Suggested fix**: If you have a recommendation for fixing the issue
- **Your contact information**: For follow-up questions

### 4. Encrypted Communication (Optional)

For sensitive disclosures, you may encrypt your report using our PGP key:

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[PGP Key Placeholder - Contact security@cyberai.network for actual key]
-----END PGP PUBLIC KEY BLOCK-----
```

## Response Process

### Acknowledgment

We will acknowledge receipt of your vulnerability report within **48 hours** (2 business days).

### Triage

Our security team will assess the report and determine:

- Severity level (Critical, High, Medium, Low)
- Affected components and versions
- Priority for remediation

You can expect an initial assessment within **5 business days**.

### Resolution

We aim to resolve security issues according to the following SLA:

- **Critical**: 7 days
- **High**: 14 days
- **Medium**: 30 days
- **Low**: 60 days

Timeline may vary based on complexity and the need for coordinated disclosure.

### Disclosure

Once a fix is available:

1. We will prepare a security advisory
2. Coordinate with you on public disclosure timing
3. Release a patch or new version
4. Publish the security advisory
5. Credit you in the advisory (if desired)
>>>>>>> origin/pr10

## Scope

### In Scope

<<<<<<< HEAD
- Authentication and authorization issues
- Code injection vulnerabilities
- Exposure of sensitive data or credentials
- Insecure cryptographic implementations
- Privilege escalation
- Remote code execution
- Cross-site scripting (XSS) or similar web vulnerabilities
- Supply chain vulnerabilities in dependencies

### Out of Scope

- Issues affecting outdated or unsupported versions
- Vulnerabilities requiring physical access to a user's device
- Social engineering attacks
- Denial of Service (DoS) attacks without proven impact
- Issues that have already been reported or are known

## Security Best Practices

This project follows these security practices:

- **No Secrets in Code**: Never commit API keys, passwords, or private keys
- **Dependency Scanning**: Regular audits of dependencies for known vulnerabilities
- **Code Review**: All changes require review before merging
- **Least Privilege**: Services run with minimal required permissions
- **Dry-Run Defaults**: Destructive operations default to dry-run mode
- **Input Validation**: All user inputs are validated and sanitized

## Security Contacts

- **Primary Contact**: security@cuberai.example
- **Backup Contact**: [To be specified]

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |
| < Latest| :x:                |

We recommend always using the latest version to ensure you have all security updates.

## Recognition

We appreciate and recognize security researchers who help keep our project secure:

- Responsible disclosures will be credited in release notes (if desired)
- We may acknowledge security researchers in our documentation
- Critical vulnerability reports may qualify for recognition in our Hall of Fame

## Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of our services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not exploit a security issue beyond what is necessary to demonstrate it
- Do not access, modify, or delete data belonging to others
- Give us reasonable time to fix the issue before public disclosure

## Additional Information

For more information about our security practices:
- Review our [GOVERNANCE.md](GOVERNANCE.md) for security roles and responsibilities
- See [PRIVACY.md](PRIVACY.md) for data handling policies
- Check [CONTRIBUTING.md](CONTRIBUTING.md) for secure development practices
=======
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
>>>>>>> origin/pr9

Thank you for helping keep SmartContractAudit and our community safe!
=======
Security issues in:

- Core smart contract audit tools
- Automation workflows and scripts
- Dependencies with known vulnerabilities
- Configuration issues leading to security risks
- Access control and authentication bypasses
- Data leakage or privacy violations
- Injection vulnerabilities (code, command, etc.)

### Out of Scope

The following are generally not considered security issues:

- Issues in third-party dependencies (report to the upstream project)
- Denial of service via resource exhaustion
- Issues requiring physical access to a user's device
- Social engineering attacks
- Issues in outdated or unsupported versions

## Security Best Practices

### For Contributors

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Enable dry-run mode by default for destructive operations
- Review dependencies for known vulnerabilities
- Follow the principle of least privilege
- Validate and sanitize all inputs
- Use security linters and scanners

### For Users

- Keep your installation up to date
- Use strong, unique credentials
- Enable two-factor authentication where available
- Review permissions granted to the application
- Monitor logs for suspicious activity
- Report suspected security issues promptly

## Security Updates

Security updates will be announced through:

- GitHub Security Advisories
- Release notes with `[SECURITY]` prefix
- Email to registered users (for critical issues)
- Project documentation and README

Subscribe to repository notifications to stay informed.

## Bug Bounty Program

We currently do not have a paid bug bounty program. However, we deeply appreciate security research and will:

- Acknowledge your contribution publicly (if desired)
- Include you in our security researchers hall of fame
- Provide project swag or recognition where possible

## Contact

- **Security reports**: security@cyberai.network
- **General inquiries**: See CONTRIBUTING.md
- **PGP key requests**: security@cyberai.network

## Policy Updates

This security policy may be updated periodically. Check back regularly or watch the repository for changes.

---

**Last Updated**: 2026-01-01
>>>>>>> origin/pr10
=======
## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

**Contact**: security@cuberai.example

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 48 hours and provide a detailed response within 7 days.

**For CuberAi product issues and triage, see [SolanaRemix/CuberAi](https://github.com/SolanaRemix/CuberAi).**

## Supported Versions

We release patches for security vulnerabilities on the latest stable version.

Thank you for helping keep this project secure!
>>>>>>> origin/pr11
