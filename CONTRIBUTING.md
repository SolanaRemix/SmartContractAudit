# Contributing to SmartContractAudit

Thank you for your interest in contributing to SmartContractAudit! This document provides guidelines and instructions for contributing to this project.

## Developer Certificate of Origin (DCO)

All commits must be signed off to indicate that you agree to the Developer Certificate of Origin (DCO). This certifies that you have the right to submit the contribution and agree to our license terms.

### Signing Off Commits

To sign off your commits, use the `-s` flag with `git commit`:

```bash
git commit -s -m "Your commit message"
```

This adds a `Signed-off-by` line to your commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

If you forgot to sign off a commit, you can amend it:

```bash
git commit --amend -s
```

## Pull Request Process

1. **Fork the repository** and create a new branch from `main` for your changes
2. **Make your changes** following our code style guidelines
3. **Write or update tests** to cover your changes
4. **Run local checks** (linting, tests, security scans) before submitting
5. **Sign off your commits** using `git commit -s`
6. **Submit a pull request** with a clear description of your changes
7. **Address review feedback** promptly and professionally
8. **Ensure CI passes** before requesting final review

### PR Description Guidelines

- Clearly describe what the PR does and why
- Reference any related issues using `#issue-number`
- Include testing instructions if applicable
- Note any breaking changes or migration requirements
- Complete the security checklist in the PR template

## Code Style

### General Guidelines

- Follow existing code patterns and conventions in the repository
- Write clear, self-documenting code with meaningful variable names
- Keep functions small and focused on a single responsibility
- Add comments only when necessary to explain "why", not "what"

### Language-Specific Guidelines

#### JavaScript/TypeScript
- Use 2 spaces for indentation
- Use semicolons consistently
- Prefer `const` over `let`, avoid `var`
- Use async/await over raw promises
- Follow ES6+ modern JavaScript practices

#### Python
- Follow PEP 8 style guidelines
- Use 4 spaces for indentation
- Use type hints where appropriate
- Document functions with docstrings

#### Shell Scripts
- Use `#!/bin/bash` shebang
- Quote variables to prevent word splitting
- Check exit codes and handle errors
- Make scripts executable with `chmod +x`

## Testing

### Writing Tests

- Write tests for all new features and bug fixes
- Aim for high code coverage but focus on meaningful tests
- Test both success and failure scenarios
- Use descriptive test names that explain what is being tested

### Running Tests

Before submitting a PR, run the test suite locally:

```bash
# Run all tests
npm test

# Run specific test file
npm test -- path/to/test.js

# Run with coverage
npm run test:coverage
```

## Local Checks

Before submitting a PR, run these local checks:

### Linting

```bash
npm run lint
```

Fix linting issues automatically where possible:

```bash
npm run lint:fix
```

### Security Scans

Run security checks in dry-run mode:

```bash
./scripts/master.sh --dry-run
```

### Build Verification

Ensure the project builds successfully:

```bash
npm run build
```

## Security Guidelines

- **Never commit secrets, API keys, or credentials**
- Use environment variables for sensitive configuration
- Enable dry-run mode by default for destructive operations
- Follow the principle of least privilege
- Report security vulnerabilities per our SECURITY.md policy
- Complete the security checklist in PR templates

## Code Review Process

1. All PRs require at least one approving review
2. Maintainers may request changes or clarifications
3. Address feedback through additional commits (don't force-push during review)
4. Once approved and CI passes, maintainers will merge your PR
5. Squash commits may be used for cleaner history

## Questions or Need Help?

- Open an issue for feature discussions or bug reports
- Join our community channels (see README.md)
- Review existing issues and discussions for similar questions
- Tag maintainers if you need guidance on contribution direction

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License that covers this project.
