<<<<<<< HEAD
<<<<<<< HEAD
# Contributing to SmartContractAudit

<<<<<<< HEAD
Thank you for your interest in contributing to SmartContractAudit! This document outlines the process for contributing to this project.

## Developer Certificate of Origin (DCO)

All contributors must sign off on their commits to certify that they have the right to contribute the code. This is done by adding a `Signed-off-by` line to your commit messages.

### How to Sign Your Commits

Use the `-s` or `--signoff` flag when committing:
=======
Thank you for your interest in contributing to SmartContractAudit! We welcome contributions from the community.

## Developer Certificate of Origin (DCO)

We require all commits to be signed off using the Developer Certificate of Origin (DCO). This certifies that you have the right to submit the contribution and agree to the terms of the DCO.

### How to sign your commits

Use the `-s` flag when committing:
>>>>>>> origin/pr9
=======
# Contributing to CyberAi

Thank you for your interest in contributing to CyberAi! This document provides guidelines and instructions for contributing to this project.

## Developer Certificate of Origin (DCO)

All commits must be signed off to indicate that you agree to the Developer Certificate of Origin (DCO). This certifies that you have the right to submit the contribution and agree to our license terms.

### Signing Off Commits

To sign off your commits, use the `-s` flag with `git commit`:
>>>>>>> origin/pr10
=======
# Contributing to SmartContractAudit

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Developer Certificate of Origin (DCO)

All commits must be signed off to certify that you have the right to submit the code:
>>>>>>> origin/pr11

```bash
git commit -s -m "Your commit message"
```

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
This will add a line like this to your commit message:
=======
This adds a `Signed-off-by` line to your commit message:
>>>>>>> origin/pr10

```
Signed-off-by: Your Name <your.email@example.com>
```

<<<<<<< HEAD
By signing off, you agree to the [Developer Certificate of Origin](https://developercertificate.org/).
=======
This adds a `Signed-off-by` line with your name and email to your commit message.

If you forget to sign a commit, you can amend it:
=======
If you forgot to sign off a commit, you can amend it:
>>>>>>> origin/pr10

```bash
git commit --amend -s
```
<<<<<<< HEAD
>>>>>>> origin/pr9

## Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our code style guidelines
3. **Add tests** if applicable to validate your changes
4. **Run local checks** (linting, tests) before submitting
<<<<<<< HEAD
5. **Sign your commits** using `git commit -s`
6. **Submit a pull request** with a clear description of your changes
7. **Respond to feedback** from maintainers during code review
8. **Ensure CI passes** before the PR can be merged
=======
5. **Sign your commits** with `git commit -s`
6. **Open a Pull Request** with a clear title and description
7. **Address review feedback** from maintainers
8. **Ensure CI checks pass** before the PR can be merged
>>>>>>> origin/pr9

## Code Style

- Follow existing code patterns and conventions in the repository
- Use meaningful variable and function names
<<<<<<< HEAD
- Keep functions focused and concise
- Comment complex logic or non-obvious decisions
- Format shell scripts consistently with existing scripts

### Shell Scripts

- Use `#!/bin/bash` or `#!/bin/sh` as appropriate
- Set proper permissions: `chmod +x` for executable scripts
- Use shellcheck for linting when available
- Handle errors gracefully with proper exit codes

### JavaScript/Node.js

- Use consistent indentation (2 spaces)
- Follow modern ES6+ syntax
- Use meaningful variable names
- Add JSDoc comments for functions when appropriate

## Testing

- Write tests for new functionality
- Ensure existing tests pass: run test commands if available
- Test edge cases and error conditions
- Validate that scripts work in dry-run mode before testing with actual operations

## Running Local Checks

Before submitting your PR, run these checks locally:
=======

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
>>>>>>> origin/pr10

### Linting

```bash
<<<<<<< HEAD
# For shell scripts (if shellcheck is installed)
shellcheck scripts/*.sh

# For JavaScript (if eslint is configured)
npm run lint
```

### Tests

```bash
# Run any existing test suite
npm test

# Or run specific test files
npm test path/to/test.js
```

### Dry-Run Testing

For workflows and automation scripts:

```bash
# Test with DRY_RUN enabled
DRY_RUN=true ./scripts/master.sh

# Verify no actual changes are made
git status
=======
- Add comments for complex logic
- Keep functions focused and modular
- Write clear commit messages

## Testing

- Write tests for new features and bug fixes
- Ensure all existing tests pass
- Run tests locally before submitting:
  ```bash
  npm test  # or relevant test command
  ```

## Running Local Checks

Before submitting a PR, run these checks:

```bash
# Lint your code
npm run lint  # or relevant lint command

# Run tests
npm test

# Check for security issues
npm audit
>>>>>>> origin/pr9
```

## Reporting Issues

<<<<<<< HEAD
- Use the GitHub issue tracker to report bugs or suggest features
- Provide detailed reproduction steps for bugs
- Include relevant logs, error messages, and environment details
- Check if a similar issue already exists before creating a new one

## Security Issues

**Do not report security vulnerabilities through public GitHub issues.**

Please refer to [SECURITY.md](SECURITY.md) for instructions on reporting security vulnerabilities.

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Questions?

If you have questions about contributing, feel free to:
- Open a discussion on GitHub
- Check existing documentation
- Review closed PRs for examples

Thank you for contributing! 🎉
=======
- Use the GitHub issue tracker
- Provide clear reproduction steps
- Include relevant logs and error messages
- Specify your environment (OS, Node version, etc.)

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

## Code of Conduct

Please note that this project has a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.
>>>>>>> origin/pr9
=======
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
>>>>>>> origin/pr10
=======
## Pull Request Guidelines

- Use **Draft PRs** for work in progress and iterations
- Provide clear descriptions and context
- Follow existing code style and conventions
- Include tests where applicable

## Product Contributions

**Product-related contributions belong in [SolanaRemix/CuberAi](https://github.com/SolanaRemix/CuberAi).**

This repository focuses on smart contract auditing tools and security automation.
>>>>>>> origin/pr11
