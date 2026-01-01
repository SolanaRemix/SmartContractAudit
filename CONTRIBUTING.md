# Contributing to SmartContractAudit

Thank you for your interest in contributing to SmartContractAudit! We welcome contributions from the community.

## Developer Certificate of Origin (DCO)

We require all commits to be signed off using the Developer Certificate of Origin (DCO). This certifies that you have the right to submit the contribution and agree to the terms of the DCO.

### How to sign your commits

Use the `-s` flag when committing:

```bash
git commit -s -m "Your commit message"
```

This adds a `Signed-off-by` line with your name and email to your commit message.

If you forget to sign a commit, you can amend it:

```bash
git commit --amend -s
```

## Pull Request Process

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our code style guidelines
3. **Add tests** if applicable to validate your changes
4. **Run local checks** (linting, tests) before submitting
5. **Sign your commits** with `git commit -s`
6. **Open a Pull Request** with a clear title and description
7. **Address review feedback** from maintainers
8. **Ensure CI checks pass** before the PR can be merged

## Code Style

- Follow existing code patterns and conventions in the repository
- Use meaningful variable and function names
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
```

## Reporting Issues

- Use the GitHub issue tracker
- Provide clear reproduction steps
- Include relevant logs and error messages
- Specify your environment (OS, Node version, etc.)

## Questions?

If you have questions about contributing, feel free to open an issue for discussion.

## Code of Conduct

Please note that this project has a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to abide by its terms.
