# Contributing to SmartContractAudit

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a positive environment

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Create a detailed issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details
   - Code samples if applicable

### Suggesting Features

1. Check if the feature has been suggested
2. Create an issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Proposed implementation (optional)

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Add tests if applicable
5. Run tests and linting
6. Commit with clear messages
7. Push to your fork
8. Create a pull request

#### PR Guidelines

- Keep changes focused and atomic
- Update documentation as needed
- Add tests for new functionality
- Follow existing code style
- Reference related issues

#### Commit Messages

Follow conventional commits:
```
feat: add wallet clustering analysis
fix: resolve honeypot detection false positives
docs: update API documentation
test: add tests for spam detector
refactor: optimize bytecode analysis
```

### Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/SmartContractAudit.git
cd SmartContractAudit

# Install dependencies
npm install

# Run tests
npm test

# Run linter
npm run lint
```

### Code Style

- Use consistent formatting (Prettier)
- Follow ESLint rules
- Add JSDoc comments for public APIs
- Keep functions small and focused
- Use descriptive variable names

### Testing

- Add unit tests for new features
- Ensure all tests pass before submitting PR
- Aim for good test coverage
- Test edge cases

### Documentation

- Update README if needed
- Add/update API documentation
- Include code examples
- Keep documentation clear and concise

## Areas for Contribution

### High Priority
- Additional chain support
- New detection modules
- Performance optimizations
- Bug fixes

### Medium Priority
- UI/dashboard development
- Additional notification channels
- Report format improvements
- Test coverage

### Good First Issues
- Documentation improvements
- Example contracts
- Configuration templates
- Minor bug fixes

Look for issues labeled `good-first-issue` or `help-wanted`.

## Review Process

1. Maintainers review PRs
2. Feedback and requested changes
3. Approval from at least one maintainer
4. Merge to main branch

## Questions?

- Open a discussion on GitHub
- Check existing documentation
- Ask in issues or PRs

Thank you for contributing! 🙏
