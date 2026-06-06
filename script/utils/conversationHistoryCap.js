function capConversationHistory(history, cap = 20) {
  if (!Array.isArray(history)) {
    throw new Error('history must be an array');
  }

  if (!Number.isInteger(cap) || cap <= 0) {
    throw new Error('cap must be a positive integer');
  }

  if (history.length <= cap) {
    return history.slice();
  }

  return history.slice(history.length - cap);
}

module.exports = { capConversationHistory };
