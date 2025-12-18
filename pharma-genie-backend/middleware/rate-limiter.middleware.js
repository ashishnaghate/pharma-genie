/**
 * Rate limiting middleware for GenAI API
 * Prevents abuse and manages API costs
 */

// Store request counts per IP
const requestCounts = new Map();

// Configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

export function rateLimitMiddleware(req, res, next) {
  const clientIp = req.ip || req.connection.remoteAddress;
  const now = Date.now();

  // Get or create request history for this IP
  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, []);
  }

  const requests = requestCounts.get(clientIp);

  // Remove requests outside the time window
  const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  // Check if limit exceeded
  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: `Too many requests. Maximum ${MAX_REQUESTS_PER_WINDOW} requests per minute allowed.`,
      retryAfter: Math.ceil((recentRequests[0] + RATE_LIMIT_WINDOW - now) / 1000),
    });
  }

  // Add current request
  recentRequests.push(now);
  requestCounts.set(clientIp, recentRequests);

  // Clean up old entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupOldEntries();
  }

  next();
}

function cleanupOldEntries() {
  const now = Date.now();
  for (const [ip, requests] of requestCounts.entries()) {
    const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
    if (recentRequests.length === 0) {
      requestCounts.delete(ip);
    } else {
      requestCounts.set(ip, recentRequests);
    }
  }
}
