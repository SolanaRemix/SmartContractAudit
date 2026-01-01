# Contributing to SmartContractAudit

Thank you for your interest in contributing to SmartContractAudit! This document outlines the process for contributing to this project.

## Developer Certificate of Origin (DCO)

All contributors must sign off on their commits to certify that they have the right to contribute the code. This is done by adding a `Signed-off-by` line to your commit messages.

### How to Sign Your Commits

Use the `-s` or `--signoff` flag when committing:

```bash
git commit -s -m "Your commit message"
```

This will add a line like this to your commit message:

```
Signed-off-by: Your Name <your.email@example.com>
```

By signing off, you agree to the [Developer Certificate of Origin](https://developercertificate.org/).

## Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our code style guidelines
3. **Add tests** if applicable to validate your changes
4. **Run local checks** (linting, tests) before submitting
5. **Sign your commits** using `git commit -s`
6. **Submit a pull request** with a clear description of your changes
7. **Respond to feedback** from maintainers during code review
8. **Ensure CI passes** before the PR can be merged

## Code Style

- Follow existing code patterns and conventions in the repository
- Use meaningful variable and function names
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

### Linting

```bash
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
```

## Reporting Issues

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
