const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const DeepScanner = require('../auditor/scanner');
const HoneypotDetector = require('../auditor/honeypot');
const { RepairEngine } = require('../script/repair');

test('scan to repair flow works with mocked scanner responses', async () => {
  const scanner = new DeepScanner({ timeoutPerModule: 1000 });

  scanner.antivirus.scanContract = async () => ({
    vulnerabilities: [{ type: 'publicMint', severity: 'critical' }],
    riskScore: 80
  });
  scanner.spam.analyzeContract = async () => ({ isSpam: false });
  scanner.honeypot.checkHoneypot = async () => ({ isHoneypot: false, honeypotTypes: [] });
  scanner.tracer.deepScan = async () => ({ riskFactors: [] });

  const scan = await scanner.scan('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'ethereum', [
    'antivirus',
    'spam',
    'honeypot',
    'tracer'
  ]);

  assert.equal(scan.status, 'completed');
  assert.equal(scan.summary.totalIssues, 1);

  const engine = new RepairEngine();
  const fix = await engine.generateFix(
    { type: 'publicMint', file: 'contracts/Token.sol', location: 'mint' },
    'contract Token { function mint() public {} }',
    'contracts/Token.sol'
  );

  assert.equal(fix.fixAvailable, true);
  assert.match(fix.patch, /onlyOwner/);
});

test('honeypot detector flags backdoor-like source pattern', () => {
  const detector = new HoneypotDetector();
  const source = `
    contract Trap {
      mapping(address => bool) private blacklist;
      function transfer(address to, uint amount) public {
        require(tradingEnabled[msg.sender], 'blocked');
      }
    }
  `;

  const findings = detector._scanSourceCode(source);
  assert.ok(findings.some((f) => f.type === 'BLACKLIST' || f.type === 'TRANSFER_BLOCKED'));
});

test('secure token includes owner-only mint and supply cap enforcement guard', () => {
  const contractPath = path.join(__dirname, '..', 'contracts', 'ethereum', 'SecureToken.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  assert.match(source, /function\s+mint\s*\([\s\S]*?onlyOwner[\s\S]*?require\(totalSupply\(\) \+ amount <= MAX_SUPPLY/);
});

test('repair path validation rejects external report path', async () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sca-repair-'));
  const repoLike = path.join(root, 'repo');
  fs.mkdirSync(repoLike, { recursive: true });

  const externalReport = '/etc/passwd';
  const { main } = require('../script/repair');

  const previousCwd = process.cwd();
  process.chdir(repoLike);
  await assert.rejects(() => main(['--report', externalReport]), /Path traversal detected/);
  process.chdir(previousCwd);
});
