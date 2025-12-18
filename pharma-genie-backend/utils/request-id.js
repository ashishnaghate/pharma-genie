/**
 * Request ID generation utility
 * For request tracking and logging
 */

import { randomBytes } from 'crypto';

export function generateRequestId() {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString('hex');
  return `req_${timestamp}_${randomPart}`;
}

export function requestIdMiddleware(req, res, next) {
  // Use existing request ID from header or generate new one
  const requestId = req.headers['x-request-id'] || generateRequestId();
  
  // Attach to request object
  req.requestId = requestId;
  
  // Add to response headers
  res.setHeader('X-Request-ID', requestId);
  
  next();
}
