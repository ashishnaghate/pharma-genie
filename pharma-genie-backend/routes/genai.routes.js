import express from 'express';
import { ProviderFactory } from '../providers/provider-factory.js';
import { validateGenAIRequest, validateSessionId } from '../middleware/validation.middleware.js';
import { rateLimitMiddleware } from '../middleware/rate-limiter.middleware.js';
import { ChatSession, ClinicalTrial, Drug, TrialSite, Participant, AdverseEvent } from '../models/index.js';
import NLPService from '../nlp-service.js';

const router = express.Router();
const nlpService = new NLPService();

/**
 * POST /api/genai/chat
 * Generate a response from GenAI provider with database context
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

    // Query database for relevant data using NLP analysis
    console.log('🔍 Analyzing query with NLP...');
    const analysis = nlpService.analyzeQuery(message);
    const dbResults = await nlpService.matchTrials(analysis);
    
    console.log(`📊 Database results:`, {
      trials: dbResults.trials?.length || 0,
      drugs: dbResults.drugs?.length || 0,
      sites: dbResults.sites?.length || 0,
      participants: dbResults.participants?.length || 0,
      adverseEvents: dbResults.adverseEvents?.length || 0
    });

    // Get database counts for context
    const dbContext = {
      counts: {
        trials: await ClinicalTrial.countDocuments(),
        drugs: await Drug.countDocuments(),
        sites: await TrialSite.countDocuments(),
        participants: await Participant.countDocuments(),
        adverseEvents: await AdverseEvent.countDocuments()
      },
      results: dbResults,
      analysis: analysis
    };

    const request = {
      sessionId: sessionId || 'default',
      message,
      conversationHistory,
      context: {
        ...context,
        database: dbContext
      },
    };

    console.log('🚀 Calling provider.generate()...');
    const aiResponse = await provider.generate(request);
    console.log('✅ Provider response received');

    // Format response in unified format (same as NLP chatbot)
    const response = formatUnifiedResponse(message, dbResults, analysis, aiResponse);

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
                content: aiResponse.reply,
                timestamp: new Date(),
                metadata: {
                  model: aiResponse.model,
                  tokens: aiResponse.tokens,
                  latencyMs: aiResponse.latencyMs,
                  dbContext: response.summary
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

    // Add GenAI metadata to response
    response.genai = {
      reply: aiResponse.reply,
      model: aiResponse.model,
      tokens: aiResponse.tokens,
      latencyMs: aiResponse.latencyMs
    };

    res.json(response);
  } catch (error) {
    console.error('GenAI chat error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message || 'Failed to generate response',
      type: 'error'
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

/**
 * Helper function to format unified response (same format as NLP chatbot)
 */
function formatUnifiedResponse(query, results, analysis, aiResponse) {
  // Count total results across all collections
  const totalTrials = results.trials?.length || 0;
  const totalDrugs = results.drugs?.length || 0;
  const totalSites = results.sites?.length || 0;
  const totalParticipants = results.participants?.length || 0;
  const totalAdverseEvents = results.adverseEvents?.length || 0;
  const totalResults = totalTrials + totalDrugs + totalSites + totalParticipants + totalAdverseEvents;

  console.log('📊 Formatting unified GenAI response from all collections');

  if (totalResults === 0) {
    return {
      type: 'text',
      content: aiResponse.reply || `No results found matching your query: "${query}". Try different search terms.`,
      trials: [],
      drugs: [],
      sites: [],
      participants: [],
      adverseEvents: [],
      summary: {
        totalRecords: 0,
        trials: 0,
        drugs: 0,
        sites: 0,
        participants: 0,
        adverseEvents: 0
      }
    };
  }

  // Build structured data for statistics
  const statistics = {
    trials: { count: totalTrials, breakdown: {} },
    drugs: { count: totalDrugs, breakdown: {} },
    sites: { count: totalSites, breakdown: {} },
    participants: { count: totalParticipants, breakdown: {} },
    adverseEvents: { count: totalAdverseEvents, breakdown: {} }
  };

  const responseData = {};

  // Add trials info with detailed breakdown
  if (totalTrials > 0) {
    responseData.trials = results.trials.map(t => ({
      id: t.trialId,
      trialId: t.trialId,
      title: t.title,
      drug: t.drug,
      phase: t.phase,
      status: t.status,
      indication: t.indication,
      sponsor: t.sponsor,
      startDate: t.startDate,
      endDate: t.endDate,
      currentEnrollment: t.currentEnrollment,
      enrollmentTarget: t.enrollmentTarget,
      enrollmentProgress: `${t.currentEnrollment}/${t.enrollmentTarget}`,
      sites: t.sites,
      participants: t.participants,
      adverseEvents: t.adverseEvents,
      location: t.location,
      primaryEndpoint: t.primaryEndpoint,
      safetyData: t.safetyData
    }));
    
    // Add status breakdown
    results.trials.forEach(t => {
      const status = t.status || 'Unknown';
      statistics.trials.breakdown[status] = (statistics.trials.breakdown[status] || 0) + 1;
    });
  }

  // Add drugs info with details
  if (totalDrugs > 0) {
    responseData.drugs = results.drugs.map(d => ({
      drugId: d.drugId,
      name: d.name,
      class: d.class,
      approvalStatus: d.approvalStatus,
      description: d.description,
      mechanism: d.mechanism,
      indications: d.indications,
      sideEffects: d.sideEffects,
      dosage: d.dosage,
      pharmacokinetics: d.pharmacokinetics
    }));
    
    // Add approval status breakdown
    results.drugs.forEach(d => {
      const approval = (typeof d.approvalStatus === 'string' ? d.approvalStatus : 
                       d.approvalStatus?.status || 'Unknown');
      statistics.drugs.breakdown[approval] = (statistics.drugs.breakdown[approval] || 0) + 1;
    });
  }

  // Add sites info with location details
  if (totalSites > 0) {
    responseData.sites = results.sites.map(s => ({
      siteId: s.siteId,
      name: s.name,
      city: s.address?.city,
      state: s.address?.state,
      country: s.address?.country,
      postalCode: s.address?.postalCode,
      capacity: s.capacity,
      currentTrials: s.currentTrials,
      contact: s.contact,
      facilities: s.facilities
    }));
    
    // Add country breakdown
    results.sites.forEach(s => {
      const country = s.address?.country || 'Unknown';
      statistics.sites.breakdown[country] = (statistics.sites.breakdown[country] || 0) + 1;
    });
  }

  // Add participants info with demographics
  if (totalParticipants > 0) {
    responseData.participants = results.participants.map(p => ({
      participantId: p.participantId,
      age: p.demographics?.age,
      gender: p.demographics?.gender,
      ethnicity: p.demographics?.ethnicity,
      enrollmentStatus: p.enrollmentInfo?.status,
      enrollmentDate: p.enrollmentInfo?.enrollmentDate,
      trialId: p.trialId,
      siteId: p.siteId,
      medicalHistory: p.medicalHistory,
      consentDate: p.consentDate
    }));
    
    // Add demographics breakdown
    results.participants.forEach(p => {
      const gender = p.demographics?.gender || 'Unknown';
      statistics.participants.breakdown[gender] = (statistics.participants.breakdown[gender] || 0) + 1;
    });
  }

  // Add adverse events info with severity breakdown
  if (totalAdverseEvents > 0) {
    responseData.adverseEvents = results.adverseEvents.map(e => ({
      eventId: e.eventId,
      severity: e.eventDetails?.severity,
      isSerious: e.eventDetails?.isSerious,
      description: e.eventDetails?.description,
      outcome: e.eventDetails?.outcome,
      reportDate: e.timing?.reportDate,
      onsetDate: e.timing?.onsetDate,
      resolutionDate: e.timing?.resolutionDate,
      participantId: e.participantId,
      trialId: e.trialId
    }));
    
    // Add severity breakdown
    results.adverseEvents.forEach(e => {
      const severity = e.eventDetails?.severity || 'Unknown';
      statistics.adverseEvents.breakdown[severity] = (statistics.adverseEvents.breakdown[severity] || 0) + 1;
    });
    
    // Add serious vs non-serious count
    const seriousCount = results.adverseEvents.filter(e => e.eventDetails?.isSerious).length;
    const nonSeriousCount = totalAdverseEvents - seriousCount;
    statistics.adverseEvents.serious = seriousCount;
    statistics.adverseEvents.nonSerious = nonSeriousCount;
  }

  const summary = {
    totalRecords: totalResults,
    trials: totalTrials,
    drugs: totalDrugs,
    sites: totalSites,
    participants: totalParticipants,
    adverseEvents: totalAdverseEvents
  };

  // For count intent
  if (analysis.intent === 'count') {
    return {
      type: 'count',
      content: 'consolidated',
      count: totalResults,
      statistics: statistics,
      summary: summary,
      aiInsight: aiResponse.reply,
      ...responseData
    };
  }

  // For single trial detail
  if (totalTrials === 1 && analysis.filters.trialId) {
    return {
      type: 'detail',
      content: 'consolidated',
      statistics: statistics,
      summary: summary,
      aiInsight: aiResponse.reply,
      ...responseData
    };
  }

  // For list view - return ALL consolidated data
  return {
    type: 'list',
    content: 'consolidated',
    statistics: statistics,
    summary: summary,
    aiInsight: aiResponse.reply,
    ...responseData
  };
}

export default router;
