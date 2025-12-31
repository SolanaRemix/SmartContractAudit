# Developer Setup Guide

This guide provides detailed setup instructions for developers contributing to SmartContractAudit.

## Environment Setup

### 1. System Requirements

- **Operating System**: Linux, macOS, or WSL2 on Windows
- **Node.js**: Version 18.x or higher
- **pnpm**: Version 8.x or higher
- **Git**: Version 2.x or higher
- **RAM**: Minimum 4GB, recommended 8GB+
- **Disk Space**: At least 2GB free

### 2. Install Required Tools

#### Install Node.js
```bash
# Using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Or download from https://nodejs.org/
```

#### Install pnpm
```bash
npm install -g pnpm
```

#### Verify installations
```bash
node --version    # Should show v18.x or higher
pnpm --version    # Should show 8.x or higher
git --version     # Should show 2.x or higher
```

### 3. Clone and Setup Repository

```bash
# Clone repository
git clone https://github.com/SolanaRemix/SmartContractAudit.git
cd SmartContractAudit

# Install dependencies
pnpm install

# Make scripts executable
chmod +x scripts/*.sh
```

### 4. Verify Setup

```bash
# Run health check
scripts/master.sh health

# Run a test scan
scripts/master.sh scan

# Check logs
cat SMARTBRAIN.log
```

## Development Workflow

### Branch Strategy

We follow a Git Flow inspired workflow:

```
main                 # Production-ready code
├── develop          # Integration branch
├── gitantivirus-node # GitAntivirus feature branch
└── feature/*        # Feature branches
```

### Creating a Feature Branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes...

# Run pre-commit checks
scripts/master.sh health
scripts/master.sh scan
```

### Commit Guidelines

Follow conventional commits:

```
feat: add new antivirus pattern detection
fix: resolve port cleanup issue on macOS
docs: update onboarding guide
chore: update dependencies
test: add unit tests for Agent X
refactor: improve SmartBrain logging
```

### Pull Request Process

1. **Before Creating PR**:
   ```bash
   # Run full audit
   scripts/master.sh audit
   
   # Ensure tests pass
   pnpm test
   
   # Check linting
   pnpm lint
   ```

2. **Create PR**:
   - Use descriptive title following conventional commits
   - Fill out PR template completely
   - Link related issues
   - Add labels appropriately

3. **PR Checks**:
   - GitAntivirus workflow must pass
   - Health checks must succeed
   - Code review approval required
   - No merge conflicts

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test path/to/test.spec.ts
```

### Writing Tests

Follow existing test patterns:

```typescript
import { describe, it, expect } from 'vitest';

describe('SmartBrain Agent', () => {
  it('should run in DRY_RUN mode by default', () => {
    const config = loadConfig();
    expect(config.dryRun).toBe(true);
  });
});
```

## Debugging

### SmartBrain Logs

All agent activities are logged to `SMARTBRAIN.log`:

```bash
# Tail logs in real-time
tail -f SMARTBRAIN.log

# Search for errors
grep ERROR SMARTBRAIN.log

# Filter by agent
grep "AgentX" SMARTBRAIN.log
```

### Quarantine Directory

Suspicious files are quarantined:

```bash
# List quarantined files
ls -la .quarantine/

# View suspicious files list
cat .quarantine/suspicious-files.txt

# Review archives
cat .quarantine/archives-review.txt
```

### Debug Mode

Enable debug output:

```bash
# Set debug environment variable
export DEBUG=smartbrain:*

# Run with verbose logging
scripts/master.sh scan
```

## IDE Setup

### Visual Studio Code

Recommended extensions:
- ESLint
- Prettier
- GitLens
- Error Lens
- TypeScript Vue Plugin (if applicable)

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "typescript"],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Clean up ports manually
scripts/master.sh heal

# Or kill specific port
lsof -ti:3000 | xargs kill
```

#### Dependencies Out of Sync
```bash
# Clean and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

#### Permission Denied on Scripts
```bash
# Make all scripts executable
chmod +x scripts/*.sh
```

#### SMARTBRAIN.log Growing Large
```bash
# Rotate log file
mv SMARTBRAIN.log SMARTBRAIN.log.old
touch SMARTBRAIN.log
```

### Getting Help

1. Check `SMARTBRAIN.log` for detailed error messages
2. Review `.quarantine/` for security-related issues
3. Search existing GitHub issues
4. Ask in team communication channels
5. Create a new issue with reproduction steps

## Performance Tips

1. **Use pnpm**: Faster than npm, saves disk space
2. **Parallel builds**: Enabled by default in `master.sh`
3. **Cache**: pnpm uses content-addressable storage
4. **Frozen lockfile**: Speeds up CI/CD installations

## Security Best Practices

1. **Never commit secrets**: Use environment variables
2. **Review quarantine reports**: Check all flagged files
3. **Keep dependencies updated**: Run `pnpm update` regularly
4. **Run scans frequently**: Use `scripts/master.sh scan`
5. **Follow DRY_RUN principle**: Test before deploying

## Next Steps

- Review [WELCOME.md](WELCOME.md) for project overview
- Read [SECURITY.md](SECURITY.md) for security guidelines
- Check [../bots/README.md](../bots/README.md) for BOT configurations
- Join the team and start contributing!

---

**Need help?** Open an issue or reach out to the maintainers.
