const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getSupportedChains,
  normalizeChain,
  validateAddressForChain
} = require('../script/utils/chainValidation');

test('supports avalanche/arbitrum/optimism chain metadata', () => {
  const supported = getSupportedChains();
  assert.equal(supported.avalanche.chainId, 43114);
  assert.equal(supported.arbitrum.chainId, 42161);
  assert.equal(supported.optimism.chainId, 10);
});

test('validates EVM addresses for new supported chains', () => {
  const address = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
  assert.equal(
    validateAddressForChain(address, 'avalanche'),
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  );
  assert.equal(
    validateAddressForChain(address, 'arbitrum'),
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  );
  assert.equal(
    validateAddressForChain(address, 'optimism'),
    '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'
  );
});

test('rejects malformed and wrong-chain addresses', () => {
  assert.throws(
    () => validateAddressForChain('0x123', 'avalanche'),
    /Invalid EVM address/
  );

  assert.throws(
    () => normalizeChain('madeup'),
    /Unsupported chain/
  );

  assert.throws(
    () => validateAddressForChain('not-an-address', 'optimism'),
    /Invalid EVM address/
  );

  assert.throws(
    () => validateAddressForChain('0x742d35Cc6634C0532925a3b844Bc454e4438f44e', 'solana'),
    /Invalid Solana/
  );
});
