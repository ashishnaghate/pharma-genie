import { GenAIProvider } from './genai-provider.interface.js';

/**
 * Mock GenAI Provider
 * For testing without API keys - simulates LLM responses
 */
export class MockProvider extends GenAIProvider {
  async generate(request) {
    const startTime = Date.now();
    const sanitizedMessage = this.sanitizeMessage(request.message);

    // Simulate network delay
    await this.delay(800 + Math.random() * 400);

    const reply = this.generateMockResponse(sanitizedMessage, request.context);
    const latencyMs = Date.now() - startTime;

    return {
      reply,
      model: 'mock-gpt-4o-mini',
      tokens: {
        prompt: this.estimateTokens(sanitizedMessage),
        completion: this.estimateTokens(reply),
        total: this.estimateTokens(sanitizedMessage) + this.estimateTokens(reply),
      },
      latencyMs,
    };
  }

  async streamGenerate(request, onChunk) {
    const sanitizedMessage = this.sanitizeMessage(request.message);
    const response = this.generateMockResponse(sanitizedMessage, request.context);

    // Simulate token streaming
    const words = response.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      await this.delay(50 + Math.random() * 100);
      const content = i === 0 ? words[i] : ' ' + words[i];
      onChunk({ type: 'token', content });
    }

    onChunk({ type: 'done', content: '', metadata: { model: 'mock-gpt-4o-mini' } });
  }

  generateMockResponse(message, context) {
    const lowerMessage = message.toLowerCase();

    // Context-aware responses
    if (context && (context.clinicalTrials || context.drugs || context.adverseEvents)) {
      return this.generateContextualResponse(message, context);
    }

    // Pattern matching for common queries
    if (lowerMessage.includes('clinical trial') || lowerMessage.includes('study')) {
      return `Based on our clinical trials database, I can help you find information about various studies. We track trials across different phases (I-IV), therapeutic areas like oncology, cardiovascular, and neurology, and monitor enrollment status, outcomes, and safety data.

What specific aspect of clinical trials would you like to explore? For example:
- Trial status and enrollment
- Drug efficacy and safety
- Participant demographics
- Adverse events reporting
- Trial site locations

Please let me know how I can assist you further.`;
    }

    if (lowerMessage.includes('drug') || lowerMessage.includes('medication') || lowerMessage.includes('pharmaceutical')) {
      return `I can provide information about pharmaceutical compounds in our database. Our system tracks:

- Drug identification and classification
- Mechanism of action
- Clinical trial associations
- Approval status (FDA, EMA)
- Safety profiles
- Pharmacokinetic properties

Which drug or therapeutic area would you like to know more about?`;
    }

    if (lowerMessage.includes('adverse') || lowerMessage.includes('side effect') || lowerMessage.includes('safety')) {
      return `Adverse event monitoring is critical in clinical research. Our database includes:

- Severity classifications (Mild, Moderate, Severe)
- Event causality assessment
- Temporal relationships
- Serious vs non-serious events
- System organ class categorization

I can help you analyze safety signals and adverse event patterns. What specific safety information are you looking for?`;
    }

    if (lowerMessage.includes('participant') || lowerMessage.includes('patient') || lowerMessage.includes('enrollment')) {
      return `Clinical trial participants are the foundation of medical research. I can provide insights on:

- Enrollment criteria and demographics
- Participant retention and compliance
- Diversity in clinical trials
- Informed consent processes
- Safety monitoring protocols

What aspect of participant data interests you?`;
    }

    // Default response
    return `I'm a pharmaceutical research assistant with access to clinical trials, drug information, and safety data. 

I can help you with:
• Clinical trial information and analysis
• Drug profiles and mechanisms
• Adverse event monitoring
• Regulatory compliance
• Safety data interpretation

What would you like to know? Please ask specific questions about our database or research areas.`;
  }

  generateContextualResponse(message, context) {
    const parts = [];
    
    // Include database statistics if available
    if (context.databaseResults) {
      const stats = context.databaseResults;
      const totalRecords = stats.totalRecords || 0;
      
      if (totalRecords > 0) {
        // Build a detailed breakdown
        const breakdown = [];
        if (stats.trials > 0) breakdown.push(`${stats.trials} clinical trial${stats.trials !== 1 ? 's' : ''}`);
        if (stats.drugs > 0) breakdown.push(`${stats.drugs} drug${stats.drugs !== 1 ? 's' : ''}`);
        if (stats.sites > 0) breakdown.push(`${stats.sites} trial site${stats.sites !== 1 ? 's' : ''}`);
        if (stats.participants > 0) breakdown.push(`${stats.participants} participant${stats.participants !== 1 ? 's' : ''}`);
        if (stats.adverseEvents > 0) breakdown.push(`${stats.adverseEvents} adverse event${stats.adverseEvents !== 1 ? 's' : ''}`);
        
        parts.push(`📊 **Query Results: ${totalRecords} total record${totalRecords !== 1 ? 's' : ''} found**\n\nBreakdown:\n- ${breakdown.join('\n- ')}`);
      } else {
        parts.push(`📊 **Query Results: 0 records found**\n\nNo matching data found in the database for your query.`);
      }
    }

    // Include sample data if available
    if (context.data) {
      if (context.data.trials && context.data.trials.length > 0) {
        const trial = context.data.trials[0];
        parts.push(`\n**Sample Clinical Trial:**\n- Trial ID: ${trial.trialId || trial.id}\n- Title: ${trial.title || 'N/A'}\n- Phase: ${trial.phase || 'N/A'}\n- Status: ${trial.status || 'N/A'}\n- Drug: ${trial.drug || 'N/A'}`);
      }

      if (context.data.drugs && context.data.drugs.length > 0) {
        const drug = context.data.drugs[0];
        parts.push(`\n**Sample Drug:**\n- Drug ID: ${drug.drugId || drug.id}\n- Name: ${drug.name || 'N/A'}\n- Class: ${drug.class || 'N/A'}\n- Approval Status: ${typeof drug.approvalStatus === 'string' ? drug.approvalStatus : drug.approvalStatus?.status || 'N/A'}`);
      }
      
      if (context.data.sites && context.data.sites.length > 0) {
        const site = context.data.sites[0];
        parts.push(`\n**Sample Trial Site:**\n- Site ID: ${site.siteId || site.id}\n- Name: ${site.name || 'N/A'}\n- Location: ${site.address?.city || 'N/A'}, ${site.address?.country || 'N/A'}`);
      }
    }
    
    // Legacy support for old context format
    if (!context.databaseResults) {
      if (context.clinicalTrials && context.clinicalTrials.length > 0) {
        const trial = context.clinicalTrials[0];
        parts.push(`I found information about ${context.clinicalTrials.length} clinical trial(s). For example, ${trial.title || trial.id} is in Phase ${trial.phase} with ${trial.enrollmentCount || 'N/A'} participants.`);
      }

      if (context.drugs && context.drugs.length > 0) {
        const drug = context.drugs[0];
        parts.push(`Our database shows ${context.drugs.length} drug(s) matching your query. ${drug.name || drug.id} belongs to the ${drug.therapeuticArea || 'unspecified'} therapeutic area.`);
      }

      if (context.adverseEvents && context.adverseEvents.length > 0) {
        parts.push(`I found ${context.adverseEvents.length} adverse event record(s) in our safety database.`);
      }
    }

    if (parts.length > 0) {
      return parts.join('\n\n') + '\n\nWould you like more detailed information about any of these findings?';
    }

    return this.generateMockResponse(message, undefined);
  }

  estimateTokens(text) {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
