import express from 'express';
import { ProviderFactory } from '../providers/provider-factory.js';
import { validateGenAIRequest, validateSessionId } from '../middleware/validation.middleware.js';
import { rateLimitMiddleware } from '../middleware/rate-limiter.middleware.js';
import { ChatSession } from '../models/index.js';

const router = express.Router();

/**
 * POST /api/genai/chat
 * Generate a response from GenAI provider
 */
router.post('/chat', (req, res, next) => {
  console.log('🔍 Route /api/genai/chat hit');
  console.log('📦 Request body:', JSON.stringify(req.body));
  next();
}, rateLimitMiddleware, validateGenAIRequest, async (req, res) => {
  console.log('📥 GenAI chat request received:', req.body.message);
  try {
    const { message, sessionId, conversationHistory, context } = req.body;

    console.log('🔧 Creating provider instance...');
    const provider = ProviderFactory.getProvider();
    console.log('✅ Provider created:', provider.constructor.name);

    const request = {
      sessionId: sessionId || 'default',
      message,
      conversationHistory,
      context,
    };

    console.log('🚀 Calling provider.generate()...');
    const response = await provider.generate(request);
    console.log('✅ Provider response received');

    // Save to session history if sessionId provided
    if (sessionId) {
      try {
        await ChatSession.findByIdAndUpdate(
          sessionId,
          {
            $push: {
              messages: {
                role: 'user',
                content: message,
                timestamp: new Date(),
              },
            },
            lastActivity: new Date(),
          },
          { upsert: true, new: true }
        );

        await ChatSession.findByIdAndUpdate(
          sessionId,
          {
            $push: {
              messages: {
                role: 'assistant',
                content: response.reply,
                timestamp: new Date(),
                metadata: {
                  model: response.model,
                  tokens: response.tokens,
                  latencyMs: response.latencyMs,
                },
              },
            },
            lastActivity: new Date(),
          }
        );
      } catch (dbError) {
        console.error('Error saving to chat session:', dbError);
        // Continue even if DB save fails
      }
    }

    res.json({
      reply: response.reply,
      model: response.model,
      tokens: response.tokens,
      latencyMs: response.latencyMs,
    });
  } catch (error) {
    console.error('GenAI chat error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate response',
    });
  }
});

/**
 * GET /api/genai/stream
 * Stream a response from GenAI provider using Server-Sent Events
 */
router.get('/stream', rateLimitMiddleware, (req, res) => {
  const { message, sessionId } = req.query;

  if (!message) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'message query parameter is required',
    });
  }

  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const provider = ProviderFactory.getProvider();

  const request = {
    sessionId: sessionId || 'default',
    message,
  };

  let fullResponse = '';

  provider.streamGenerate(request, (chunk) => {
    if (chunk.type === 'token') {
      fullResponse += chunk.content;
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    } else if (chunk.type === 'done') {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      
      // Save to session history
      if (sessionId && fullResponse) {
        ChatSession.findByIdAndUpdate(
          sessionId,
          {
            $push: {
              messages: [
                {
                  role: 'user',
                  content: message,
                  timestamp: new Date(),
                },
                {
                  role: 'assistant',
                  content: fullResponse,
                  timestamp: new Date(),
                  metadata: chunk.metadata,
                },
              ],
            },
            lastActivity: new Date(),
          },
          { upsert: true }
        ).catch(err => console.error('Error saving stream to session:', err));
      }
      
      res.end();
    } else if (chunk.type === 'error') {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      res.end();
    }
  }).catch(error => {
    console.error('Stream error:', error);
    res.write(`data: ${JSON.stringify({ type: 'error', content: error.message })}\n\n`);
    res.end();
  });

  // Handle client disconnect
  req.on('close', () => {
    res.end();
  });
});

/**
 * POST /api/genai/sessions
 * Create a new chat session
 */
router.post('/sessions', async (req, res) => {
  try {
    const { userId, metadata } = req.body;

    const session = await ChatSession.create({
      userId: userId || 'anonymous',
      messages: [],
      metadata: metadata || {},
      createdAt: new Date(),
      lastActivity: new Date(),
    });

    res.status(201).json({
      sessionId: session._id,
      createdAt: session.createdAt,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create session',
    });
  }
});

/**
 * GET /api/genai/sessions/:sessionId
 * Get chat session history
 */
router.get('/sessions/:sessionId', validateSessionId, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
    }

    res.json({
      sessionId: session._id,
      userId: session.userId,
      messages: session.messages,
      metadata: session.metadata,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch session',
    });
  }
});

/**
 * DELETE /api/genai/sessions/:sessionId
 * Delete a chat session
 */
router.delete('/sessions/:sessionId', validateSessionId, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await ChatSession.findByIdAndDelete(sessionId);

    if (!session) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
    }

    res.json({
      message: 'Session deleted successfully',
      sessionId,
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete session',
    });
  }
});

export default router;
