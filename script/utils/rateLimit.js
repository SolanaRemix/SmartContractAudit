class FixedWindowRateLimiter {
  constructor({ limit = 5, windowMs = 60000, now = () => Date.now() } = {}) {
    if (limit <= 0 || windowMs <= 0) {
      throw new Error('limit and windowMs must be positive numbers');
    }

    this.limit = limit;
    this.windowMs = windowMs;
    this.now = now;
    this.buckets = new Map();
  }

  _getWindowStart(ts) {
    return Math.floor(ts / this.windowMs) * this.windowMs;
  }

  hit(key) {
    if (!key || typeof key !== 'string') {
      throw new Error('Rate limit key must be a non-empty string');
    }

    const currentTs = this.now();
    const windowStart = this._getWindowStart(currentTs);
    const state = this.buckets.get(key);

    if (!state || state.windowStart !== windowStart) {
      this.buckets.set(key, { windowStart, count: 1 });
      return { allowed: true, remaining: this.limit - 1, resetAt: windowStart + this.windowMs };
    }

    state.count += 1;
    const allowed = state.count <= this.limit;
    return {
      allowed,
      remaining: Math.max(0, this.limit - state.count),
      resetAt: windowStart + this.windowMs
    };
  }
}

function createRateLimitKey(requestMeta = {}) {
  const {
    remoteAddress = 'unknown',
    trustedProxy = false,
    forwardedFor = ''
  } = requestMeta;

  if (trustedProxy && typeof forwardedFor === 'string' && forwardedFor.trim()) {
    const first = forwardedFor.split(',')[0].trim();
    if (first) {
      return first;
    }
  }

  return remoteAddress;
}

module.exports = { FixedWindowRateLimiter, createRateLimitKey };
