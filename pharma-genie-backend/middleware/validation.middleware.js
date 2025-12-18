/**
 * Request validation middleware for GenAI API
 */
export function validateGenAIRequest(req, res, next) {
  const { message } = req.body;

  // Validate message
  if (!message || typeof message !== 'string') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message is required and must be a string',
    });
  }

  if (message.trim().length === 0) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message cannot be empty',
    });
  }

  if (message.length > 10000) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Message exceeds maximum length of 10,000 characters',
    });
  }

  // Validate conversationHistory if provided
  if (req.body.conversationHistory) {
    if (!Array.isArray(req.body.conversationHistory)) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'conversationHistory must be an array',
      });
    }

    for (const msg of req.body.conversationHistory) {
      if (!msg.role || !msg.content) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Each history message must have role and content',
        });
      }

      if (!['system', 'user', 'assistant'].includes(msg.role)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Message role must be system, user, or assistant',
        });
      }
    }
  }

  next();
}

export function validateSessionId(req, res, next) {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'sessionId is required',
    });
  }

  // Basic MongoDB ObjectId validation (24 hex characters)
  if (!/^[0-9a-fA-F]{24}$/.test(sessionId)) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid sessionId format',
    });
  }

  next();
}
