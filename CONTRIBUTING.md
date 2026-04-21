# Contributing to SmartContractAudit

Thank you for your interest in contributing to SmartContractAudit! We welcome contributions from the community.

## Developer Certificate of Origin (DCO)

All commits must be signed off to indicate that you agree to the Developer Certificate of Origin. This certifies that you have the right to submit the contribution and that you agree to the project license.

To sign off your commits, use the `-s` flag with `git commit`:

```bash
git commit -s -m "Your commit message"
```

This adds a `Signed-off-by` line to your commit message, certifying that you wrote the code or have the right to submit it as an open-source contribution.

## Pull Request Process

1. **Fork the repository** and create a new branch from `main` for your changes.
2. **Make your changes** following the code style guidelines below.
3. **Write or update tests** to cover your changes.
4. **Run all checks locally** before submitting (see below).
5. **Submit a pull request** with a clear description of your changes.
6. **Sign off all commits** using `git commit -s`.
7. **Respond to review feedback** promptly.

## Code Style

- Follow existing code conventions in the repository
- Use clear, descriptive variable and function names
- Add comments for complex logic
- Keep functions small and focused on a single task
- Format code consistently (use project's formatting tools if available)

## Testing

- Write tests for all new features and bug fixes
- Ensure all existing tests pass before submitting
- Run the test suite locally:
  ```bash
  # Add specific test commands for your project
  npm test  # or appropriate test command
  ```

## Running Local Checks

Before submitting your pull request, run these checks locally:

```bash
# Run linter
npm run lint  # or appropriate linting command

# Run tests
npm test

# Run build
npm run build
```

## Security

- Never commit secrets, private keys, or sensitive data
- Follow security best practices
- Report security vulnerabilities according to [SECURITY.md](SECURITY.md)
- All changes go through security review before merge

## Documentation

- Update documentation for any user-facing changes
- Add JSDoc/comments for new public APIs
- Update README.md if adding new features

## Code Review

- All submissions require review from maintainers
- Address review feedback promptly
- Be respectful and constructive in discussions
- Reviewers will check for:
  - Code quality and style
  - Test coverage
  - Security implications
  - Performance considerations
  - Documentation completeness

## Getting Help

- Open an issue for bugs or feature requests
- Join our community channels for questions
- Review existing issues and pull requests
- Check documentation and wiki

## License

By contributing, you agree that your contributions will be licensed under the Apache-2.0 License.
