const test = require('node:test');
const assert = require('node:assert/strict');

const { FixedWindowRateLimiter, createRateLimitKey } = require('../script/utils/rateLimit');

test('enforces fixed-window rate limit and resets at boundary', () => {
  let now = 1_700_000_000_000;
  const limiter = new FixedWindowRateLimiter({
    limit: 2,
    windowMs: 60_000,
    now: () => now
  });

  assert.equal(limiter.hit('ip:1').allowed, true);
  assert.equal(limiter.hit('ip:1').allowed, true);
  assert.equal(limiter.hit('ip:1').allowed, false);

  now += 60_000;
  assert.equal(limiter.hit('ip:1').allowed, true);
});

test('header spoofing does not bypass keying when proxy is untrusted', () => {
  const first = createRateLimitKey({
    remoteAddress: '10.0.0.1',
    trustedProxy: false,
    forwardedFor: '8.8.8.8'
  });
  const second = createRateLimitKey({
    remoteAddress: '10.0.0.1',
    trustedProxy: false,
    forwardedFor: '1.1.1.1'
  });

  assert.equal(first, '10.0.0.1');
  assert.equal(second, '10.0.0.1');
});
