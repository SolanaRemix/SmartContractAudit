# Contributing to SmartContractAudit

Thank you for your interest in contributing to SmartContractAudit! This document provides guidelines and instructions for contributing.

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and professional
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards other contributors

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- Read the [WELCOME.md](.github/ONBOARDING/WELCOME.md) guide
- Completed the [DEVELOPMENT.md](.github/ONBOARDING/DEVELOPMENT.md) setup
- Reviewed the [SECURITY.md](docs/SECURITY.md) policy

### First-Time Contributors

1. **Fork the repository**
2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SmartContractAudit.git
   ```
3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/SolanaRemix/SmartContractAudit.git
   ```
4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### 1. Before Starting

- Check existing issues and PRs
- Discuss major changes in an issue first
- Ensure your idea aligns with project goals

### 2. Making Changes

```bash
# Update your fork
git checkout main
git pull upstream main
git push origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make your changes
# ... edit files ...

# Run health checks
scripts/master.sh health

# Run security scan
scripts/master.sh scan

# Check logs for issues
cat SMARTBRAIN.log
```

### 3. Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

**Examples:**
```
feat(antivirus): add detection for new malware pattern

Add pattern detection for obfuscated eval statements.
Includes test cases and updates to quarantine logic.

Closes #123
```

```
fix(master): resolve port cleanup issue on macOS

The lsof command behaves differently on macOS.
Added platform detection and adjusted arguments.

Fixes #456
```

### 4. Testing

```bash
# Run all tests
pnpm test

# Run specific tests
pnpm test path/to/test

# Run with coverage
pnpm test:coverage

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### 5. Pre-Commit Checklist

- [ ] Code follows project style guidelines
- [ ] All tests pass
- [ ] Linting passes
- [ ] No hardcoded secrets or credentials
- [ ] Security scan completed: `scripts/master.sh scan`
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow guidelines
- [ ] No unnecessary files committed

### 6. Submitting Pull Request

1. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request** on GitHub

3. **Fill out PR template** completely

4. **Address review feedback** promptly

## Pull Request Guidelines

### PR Title

Follow conventional commit format:
```
feat(scope): add new feature
fix(scope): resolve bug
docs(scope): update documentation
```

### PR Description

Include:
- **What**: What changes does this PR make?
- **Why**: Why are these changes needed?
- **How**: How were the changes implemented?
- **Testing**: How were the changes tested?
- **Screenshots**: (if applicable)
- **Related Issues**: Closes #123, Related to #456

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] Security scan passed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
- [ ] Tests pass locally
- [ ] No secrets committed
```

## Code Style

### General Guidelines

- **Formatting**: Use Prettier (configured in project)
- **Linting**: Follow ESLint rules
- **TypeScript**: Use strict mode
- **Comments**: Write clear, necessary comments
- **Naming**: Use descriptive variable names

### Shell Scripts

```bash
# Use strict mode
set -euo pipefail

# Comment functions
# Description of what function does
function_name() {
  local param="$1"
  # Implementation
}

# Use descriptive variable names
suspicious_file_count=0
quarantine_directory=".quarantine"
```

### TypeScript/JavaScript

```typescript
// Use TypeScript types
interface Config {
  dryRun: boolean;
  scanPatterns: string[];
}

// Descriptive function names
function scanForMalware(filePath: string): ScanResult {
  // Implementation
}

// Early returns for clarity
function validate(input: string): boolean {
  if (!input) return false;
  if (input.length < 3) return false;
  return true;
}
```

## Documentation

### When to Update Documentation

- New features added
- API changes
- Configuration changes
- New scripts or tools
- Security-related changes

### Documentation Types

1. **Code Comments**: For complex logic
2. **README**: For user-facing features
3. **Inline Docs**: For API/functions
4. **Guides**: For workflows and processes

### Documentation Style

- Clear and concise
- Include examples
- Use proper markdown formatting
- Keep up-to-date with code changes

## Testing

### Test Requirements

- **Unit tests**: For individual functions
- **Integration tests**: For component interactions
- **Security tests**: For security-critical code
- **Edge cases**: Test boundary conditions

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest';
import { scanFile } from './scanner';

describe('scanFile', () => {
  it('should detect suspicious patterns', () => {
    const result = scanFile('test-file-with-malware.js');
    expect(result.suspicious).toBe(true);
  });

  it('should handle clean files', () => {
    const result = scanFile('test-file-clean.js');
    expect(result.suspicious).toBe(false);
  });

  it('should handle missing files gracefully', () => {
    const result = scanFile('non-existent.js');
    expect(result.error).toBeDefined();
  });
});
```

## Security

### Security-First Development

1. **Never commit secrets**
   - Use `.env` files (in `.gitignore`)
   - Use environment variables
   - Use secret management tools

2. **Input validation**
   - Validate all user input
   - Sanitize data before use
   - Handle errors gracefully

3. **Dependencies**
   - Review new dependencies
   - Keep dependencies updated
   - Run `pnpm audit` regularly

4. **Code review**
   - Security-focused code review
   - Check for common vulnerabilities
   - Run security scans

### Security Checklist

- [ ] No hardcoded credentials
- [ ] Input validation implemented
- [ ] Output sanitization applied
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies audited
- [ ] Security scan passed

## Review Process

### What Reviewers Look For

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Is it clean and maintainable?
3. **Testing**: Are there adequate tests?
4. **Security**: Are there security concerns?
5. **Documentation**: Is documentation updated?
6. **Style**: Does it follow style guidelines?

### Responding to Reviews

- Be receptive to feedback
- Ask questions if unclear
- Make requested changes promptly
- Thank reviewers for their time

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- **Major**: Breaking changes
- **Minor**: New features (backwards compatible)
- **Patch**: Bug fixes

### Release Checklist

- [ ] All tests passing
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped
- [ ] Security scan passed
- [ ] Release notes prepared

## Community

### Communication Channels

- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Pull Requests**: Code contributions

### Getting Help

1. Check existing documentation
2. Search existing issues
3. Ask in GitHub Discussions
4. Open a new issue (if needed)

## Recognition

Contributors will be recognized:
- In CHANGELOG
- In README (optional)
- In release notes
- Through GitHub contributor graph

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to SmartContractAudit! 🎉
