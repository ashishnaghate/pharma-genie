/**
 * Logging middleware for GenAI API requests
 */

export function loggerMiddleware(req, res, next) {
  const requestId = req.headers['x-request-id'] || generateRequestId();
  const startTime = Date.now();

  // Attach request ID to request object
  req.requestId = requestId;

  // Log incoming request
  console.log(`[${new Date().toISOString()}] [${requestId}] ${req.method} ${req.path}`);

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] [${requestId}] ${res.statusCode} - ${duration}ms`);
    return originalSend.call(this, data);
  };

  next();
}

function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

/**
 * Error logging middleware
 */
export function errorLoggerMiddleware(err, req, res, next) {
  const requestId = req.requestId || 'unknown';
  
  console.error(`[${new Date().toISOString()}] [${requestId}] ERROR:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  next(err);
}

// Aliases for compatibility
export const requestLogger = loggerMiddleware;
export const errorLogger = errorLoggerMiddleware;

/**
 * Error handler middleware
 */
export function errorHandler(err, req, res, next) {
  const requestId = req.requestId || 'unknown';
  
  console.error(`[${new Date().toISOString()}] [${requestId}] ERROR:`, {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(err.statusCode || 500).json({
    error: err.name || 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    requestId,
  });
}
