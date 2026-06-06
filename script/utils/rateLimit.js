/**
 * Rate Limit Utility
 * Implements rate limiting with fixed UTC day boundaries, exponential backoff,
 * and conversation history capping based on Drift Protocol security lessons
 */

const crypto = require('crypto');
const EventEmitter = require('events');

class RateLimitManager extends EventEmitter {
  constructor(options = {}) {
    super();
    
    // Rate limit configuration
    this.limits = {
      requestsPerDay: options.requestsPerDay || 1000,
      requestsPerHour: options.requestsPerHour || 100,
      requestsPerMinute: options.requestsPerMinute || 10
    };
    
    // Exponential backoff configuration
    this.backoff = {
      maxAttempts: options.maxAttempts || 3,
      initialDelay: options.initialDelay || 5000, // 5 seconds
      maxDelay: options.maxDelay || 60000 // 60 seconds
    };
    
    // Conversation history limits to prevent unbounded token consumption
    this.historyLimits = {
      minMessages: options.minMessages || 4,
      maxMessages: options.maxMessages || 20,
      maxTokensPerMessage: options.maxTokensPerMessage || 4096
    };
    
    // Storage for rate limit tracking
    this.requestCounts = new Map();
    this.lastReset = {
      day: null,
      hour: null,
      minute: null
    };
  }
  
  /**
   * Get UTC day boundary (start of day in UTC)
   */
  getUTCDayBoundary(date = new Date()) {
    const utcDay = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0, 0, 0, 0
    ));
    return utcDay.getTime();
  }
  
  /**
   * Get UTC hour boundary
   */
  getUTCHourBoundary(date = new Date()) {
    const utcHour = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      0, 0, 0
    ));
    return utcHour.getTime();
  }
  
  /**
   * Get UTC minute boundary
   */
  getUTCMinuteBoundary(date = new Date()) {
    const utcMinute = new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
      0, 0
    ));
    return utcMinute.getTime();
  }
  
  /**
   * Check if rate limits have been exceeded
   * Returns { allowed: boolean, retryAfter: number, headers: object }
   */
  checkRateLimit(userId) {
    const now = new Date();
    const dayBoundary = this.getUTCDayBoundary(now);
    const hourBoundary = this.getUTCHourBoundary(now);
    const minuteBoundary = this.getUTCMinuteBoundary(now);
    
    // Reset counters if we've crossed a boundary
    if (this.lastReset.day !== dayBoundary) {
      this.requestCounts.clear();
      this.lastReset.day = dayBoundary;
      this.lastReset.hour = hourBoundary;
      this.lastReset.minute = minuteBoundary;
    } else if (this.lastReset.hour !== hourBoundary) {
      // Reset hourly counts
      for (const [key, value] of this.requestCounts.entries()) {
        if (key.includes(':hour')) {
          this.requestCounts.delete(key);
        }
      }
      this.lastReset.hour = hourBoundary;
      this.lastReset.minute = minuteBoundary;
    } else if (this.lastReset.minute !== minuteBoundary) {
      // Reset minute counts
      for (const [key, value] of this.requestCounts.entries()) {
        if (key.includes(':minute')) {
          this.requestCounts.delete(key);
        }
      }
      this.lastReset.minute = minuteBoundary;
    }
    
    // Get current counts
    const dayKey = \`\${userId}:day:\${dayBoundary}\`;
    const hourKey = \`\${userId}:hour:\${hourBoundary}\`;
    const minuteKey = \`\${userId}:minute:\${minuteBoundary}\`;
    
    const dayCount = this.requestCounts.get(dayKey) || 0;
    const hourCount = this.requestCounts.get(hourKey) || 0;
    const minuteCount = this.requestCounts.get(minuteKey) || 0;
    
    // Check limits
    let allowed = true;
    let retryAfter = 0;
    let limitType = null;
    
    if (minuteCount >= this.limits.requestsPerMinute) {
      allowed = false;
      const nextMinuteBoundary = minuteBoundary + 60000; // 1 minute
      retryAfter = Math.ceil((nextMinuteBoundary - now.getTime()) / 1000);
      limitType = 'minute';
    } else if (hourCount >= this.limits.requestsPerHour) {
      allowed = false;
      const nextHourBoundary = hourBoundary + 3600000; // 1 hour
      retryAfter = Math.ceil((nextHourBoundary - now.getTime()) / 1000);
      limitType = 'hour';
    } else if (dayCount >= this.limits.requestsPerDay) {
      allowed = false;
      const nextDayBoundary = dayBoundary + 86400000; // 1 day
      retryAfter = Math.ceil((nextDayBoundary - now.getTime()) / 1000);
      limitType = 'day';
    }
    
    // Generate rate limit headers
    const headers = {
      'X-RateLimit-Limit-Minute': this.limits.requestsPerMinute,
      'X-RateLimit-Limit-Hour': this.limits.requestsPerHour,
      'X-RateLimit-Limit-Day': this.limits.requestsPerDay,
      'X-RateLimit-Remaining-Minute': Math.max(0, this.limits.requestsPerMinute - minuteCount),
      'X-RateLimit-Remaining-Hour': Math.max(0, this.limits.requestsPerHour - hourCount),
      'X-RateLimit-Remaining-Day': Math.max(0, this.limits.requestsPerDay - dayCount),
      'X-RateLimit-Reset-Minute': new Date(minuteBoundary + 60000).toISOString(),
      'X-RateLimit-Reset-Hour': new Date(hourBoundary + 3600000).toISOString(),
      'X-RateLimit-Reset-Day': new Date(dayBoundary + 86400000).toISOString()
    };
    
    if (!allowed) {
      headers['Retry-After'] = retryAfter;
    }
    
    return {
      allowed,
      retryAfter,
      limitType,
      headers,
      counts: {
        minute: minuteCount,
        hour: hourCount,
        day: dayCount
      }
    };
  }
  
  /**
   * Record a request
   */
  recordRequest(userId) {
    const now = new Date();
    const dayBoundary = this.getUTCDayBoundary(now);
    const hourBoundary = this.getUTCHourBoundary(now);
    const minuteBoundary = this.getUTCMinuteBoundary(now);
    
    const dayKey = \`\${userId}:day:\${dayBoundary}\`;
    const hourKey = \`\${userId}:hour:\${hourBoundary}\`;
    const minuteKey = \`\${userId}:minute:\${minuteBoundary}\`;
    
    this.requestCounts.set(dayKey, (this.requestCounts.get(dayKey) || 0) + 1);
    this.requestCounts.set(hourKey, (this.requestCounts.get(hourKey) || 0) + 1);
    this.requestCounts.set(minuteKey, (this.requestCounts.get(minuteKey) || 0) + 1);
  }
  
  /**
   * Execute request with exponential backoff retry
   */
  async executeWithRetry(userId, requestFn, context = {}) {
    let attempt = 0;
    let lastError = null;
    
    while (attempt < this.backoff.maxAttempts) {
      attempt++;
      
      // Check rate limit
      const limitCheck = this.checkRateLimit(userId);
      
      if (limitCheck.allowed) {
        try {
          // Record the request
          this.recordRequest(userId);
          
          // Execute the request
          const result = await requestFn(limitCheck.headers);
          
          // Emit success event
          this.emit('request:success', {
            userId,
            attempt,
            context,
            headers: limitCheck.headers
          });
          
          return {
            success: true,
            result,
            attempts: attempt,
            headers: limitCheck.headers
          };
        } catch (error) {
          lastError = error;
          
          // Emit error event
          this.emit('request:error', {
            userId,
            attempt,
            error: error.message,
            context
          });
          
          // If this is not a rate limit error or we're out of attempts, throw
          if (!error.message.includes('rate limit') && !error.message.includes('429')) {
            throw error;
          }
        }
      }
      
      // Calculate backoff delay with exponential increase
      const delay = Math.min(
        this.backoff.initialDelay * Math.pow(2, attempt - 1),
        this.backoff.maxDelay
      );
      
      // Emit retry event with progress
      this.emit('request:retry', {
        userId,
        attempt,
        maxAttempts: this.backoff.maxAttempts,
        delay,
        retryAfter: limitCheck.retryAfter,
        limitType: limitCheck.limitType,
        context,
        message: \`Rate limit hit (\${limitCheck.limitType}). Retrying in \${delay}ms (attempt \${attempt}/\${this.backoff.maxAttempts})\`
      });
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    // All attempts failed
    this.emit('request:failed', {
      userId,
      attempts: this.backoff.maxAttempts,
      error: lastError?.message || 'Rate limit exceeded',
      context
    });
    
    throw new Error(\`Request failed after \${this.backoff.maxAttempts} attempts: \${lastError?.message || 'Rate limit exceeded'}\`);
  }
  
  /**
   * Cap conversation history to prevent unbounded token consumption
   * Keeps the most recent messages within the configured limits
   */
  capConversationHistory(messages) {
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }
    
    if (messages.length <= this.historyLimits.minMessages) {
      return messages;
    }
    
    // Keep the most recent messages up to maxMessages
    const cappedMessages = messages.slice(-this.historyLimits.maxMessages);
    
    // Truncate individual messages that exceed token limits
    return cappedMessages.map(msg => {
      if (typeof msg.content === 'string' && msg.content.length > this.historyLimits.maxTokensPerMessage) {
        return {
          ...msg,
          content: msg.content.substring(0, this.historyLimits.maxTokensPerMessage) + '... [truncated]',
          truncated: true
        };
      }
      return msg;
    });
  }
  
  /**
   * Sanitize user input to prevent social engineering vectors
   * Treat all user input as untrusted (Drift Protocol lesson)
   */
  sanitizeInput(input, options = {}) {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }
    
    let sanitized = input;
    
    // Remove control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
    
    // Remove potential script injection patterns
    if (options.removeScripts) {
      sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
      sanitized = sanitized.replace(/javascript:/gi, '');
      sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    }
    
    // Remove SQL injection patterns
    if (options.removeSql) {
      sanitized = sanitized.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi, '');
    }
    
    // Limit length
    const maxLength = options.maxLength || 10000;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }
    
    return sanitized.trim();
  }
  
  /**
   * Generate request signature for verification (Drift Protocol lesson)
   */
  generateRequestSignature(data, secret) {
    const payload = typeof data === 'string' ? data : JSON.stringify(data);
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }
  
  /**
   * Verify request signature (Drift Protocol lesson)
   */
  verifyRequestSignature(data, signature, secret) {
    const expectedSignature = this.generateRequestSignature(data, secret);
    
    // Use timing-safe comparison
    const bufferA = Buffer.from(signature);
    const bufferB = Buffer.from(expectedSignature);
    
    if (bufferA.length !== bufferB.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(bufferA, bufferB);
  }
}

module.exports = RateLimitManager;
