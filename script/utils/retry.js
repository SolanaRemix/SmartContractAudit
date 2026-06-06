function createJitter(baseDelayMs, jitterRatio, randomFn) {
  const spread = baseDelayMs * jitterRatio;
  return baseDelayMs + Math.floor(randomFn() * spread);
}

async function retryWithBackoff(task, options = {}) {
  const {
    maxRetries = 3,
    baseDelayMs = 100,
    jitterRatio = 0.25,
    timeoutMs = 5000,
    randomFn = Math.random,
    sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
  } = options;

  if (typeof task !== 'function') {
    throw new Error('task must be a function');
  }

  const startedAt = Date.now();
  let attempt = 0;
  let lastError;

  while (attempt <= maxRetries) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      const elapsed = Date.now() - startedAt;
      if (elapsed >= timeoutMs) {
        throw new Error(`Retry timeout exceeded after ${elapsed}ms`);
      }

      const delay = createJitter(baseDelayMs * (2 ** attempt), jitterRatio, randomFn);
      await sleep(delay);
      attempt += 1;
    }
  }

  throw lastError;
}

module.exports = { retryWithBackoff, createJitter };
