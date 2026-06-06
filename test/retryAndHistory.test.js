const test = require('node:test');
const assert = require('node:assert/strict');

const { capConversationHistory } = require('../script/utils/conversationHistoryCap');
const { createJitter, retryWithBackoff } = require('../script/utils/retry');

test('caps conversation history and protects against overflow', () => {
  const history = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
  const capped = capConversationHistory(history, 20);

  assert.equal(capped.length, 20);
  assert.equal(capped[0].id, 6);
  assert.equal(capped[19].id, 25);
});

test('jitter adds bounded randomness to backoff delays', () => {
  assert.equal(createJitter(100, 0.5, () => 0), 100);
  assert.equal(createJitter(100, 0.5, () => 1), 150);
});

test('retry with backoff respects max retries and timeout', async () => {
  let attempts = 0;
  const waits = [];

  await assert.rejects(
    retryWithBackoff(
      async () => {
        attempts += 1;
        throw new Error('fail');
      },
      {
        maxRetries: 2,
        baseDelayMs: 10,
        jitterRatio: 0,
        timeoutMs: 50,
        sleep: async (ms) => {
          waits.push(ms);
        }
      }
    ),
    /fail/
  );

  assert.equal(attempts, 3);
  assert.deepEqual(waits, [10, 20]);

  await assert.rejects(
    retryWithBackoff(
      async () => {
        throw new Error('still failing');
      },
      {
        maxRetries: 5,
        baseDelayMs: 10,
        jitterRatio: 0,
        timeoutMs: 0,
        sleep: async () => {}
      }
    ),
    /Retry timeout exceeded/
  );
});
