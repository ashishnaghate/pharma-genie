import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

/**
 * Enhanced HCL AI Cafe Integration Service
 * Integrates NLP, MongoDB data, and LLM (GPT-4.1) for intelligent responses
 */
@Injectable({
  providedIn: 'root'
})
export class HCLAICafeService {
  // HCL AI Cafe Configuration
  private readonly endpoint = 'https://aicafe.hcl.com/AICafeService/api/v1/subscription/openai';
  private readonly apiKey = '194faee8-32c8-493e-bce1-35a70380cbb3';
  private readonly deploymentName = 'gpt-4.1';
  private readonly apiVersion = '2024-12-01-preview';

  // Backend API for MongoDB data
  private readonly backendUrl = 'http://localhost:3000';

  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(private http: HttpClient) {
    console.log('🚀 HCL AI Cafe Service initialized - Enhanced with NLP + MongoDB + LLM');
  }

  /**
   * Generate a response from HCL AI Cafe with MongoDB context
   * Uses NLP to extract entities and fetch relevant data from MongoDB
   */
  generateResponse(userMessage: string, includeHistory: boolean = true): Observable<any> {
    console.log('📤 Processing query with NLP + MongoDB + LLM:', userMessage);

    // Step 1: Fetch relevant data from MongoDB based on query
    return this.fetchRelevantData(userMessage).pipe(
      switchMap(contextData => {
        console.log('📊 MongoDB context fetched:', contextData);

        // Step 2: Build enhanced prompt with MongoDB data
        const enhancedPrompt = this.buildEnhancedPrompt(userMessage, contextData);
        console.log('🔧 Enhanced prompt built:', {
          hasContext: !!enhancedPrompt.contextText,
          contextLength: enhancedPrompt.contextText?.length || 0,
          userMessage: enhancedPrompt.userMessage.substring(0, 100)
        });

        // Step 3: Call HCL AI Cafe LLM with context
        return this.callHCLAICafe(enhancedPrompt, includeHistory, contextData);
      }),
      catchError(error => {
        console.error('❌ Error in enhanced pipeline:', error);
        // Fallback: call LLM without MongoDB context
        return this.callHCLAICafe({ userMessage, contextText: '' }, includeHistory, null);
      })
    );
  }

  /**
   * Fetch relevant data from MongoDB using NLP backend
   */
  private fetchRelevantData(query: string): Observable<any> {
    console.log('🔍 Fetching MongoDB data for query:', query);
    
    // Use the NLP backend endpoint that queries all MongoDB collections
    return this.http.post<any>(`${this.backendUrl}/api/chat`, { query }).pipe(
      map(response => {
        console.log('✅ NLP Backend Raw Response:', JSON.stringify(response, null, 2));
        
        // Extract data from response - backend returns data directly, not nested in 'data' property
        const contextData: any = {
          trials: response.trials || [],
          drugs: response.drugs || [],
          sites: response.sites || [],
          participants: response.participants || [],
          adverseEvents: response.adverseEvents || [],
          statistics: response.statistics || null,
          summary: response.summary || null
        };

        console.log('📊 Extracted Context Data:', {
          trialsCount: contextData.trials?.length || 0,
          drugsCount: contextData.drugs?.length || 0,
          sitesCount: contextData.sites?.length || 0,
          participantsCount: contextData.participants?.length || 0,
          adverseEventsCount: contextData.adverseEvents?.length || 0,
          hasStatistics: !!contextData.statistics,
          hasSummary: !!contextData.summary
        });

        return contextData;
      }),
      catchError(error => {
        console.error('❌ Failed to fetch MongoDB data:', error);
        return of(null);
      })
    );
  }

  /**
   * Build enhanced prompt with MongoDB data context
   * Returns structured context for RAG-based prompting
   */
  private buildEnhancedPrompt(userMessage: string, contextData: any): { userMessage: string; contextText: string } {
    // Check if we have ANY actual data
    const hasData = contextData && (
      (contextData.trials && contextData.trials.length > 0) ||
      (contextData.drugs && contextData.drugs.length > 0) ||
      (contextData.sites && contextData.sites.length > 0) ||
      (contextData.participants && contextData.participants.length > 0) ||
      (contextData.adverseEvents && contextData.adverseEvents.length > 0)
    );

    if (!hasData) {
      return { userMessage, contextText: '' };
    }

    let contextText = '### CLINICAL TRIALS DATABASE CONTEXT ###\n\n';

    // Add statistics summary
    if (contextData.statistics) {
      contextText += `\n### Database Statistics:\n`;
      contextText += `- Total Clinical Trials: ${contextData.statistics.totalTrials || 0}\n`;
      contextText += `- Total Drugs: ${contextData.statistics.totalDrugs || 0}\n`;
      contextText += `- Total Sites: ${contextData.statistics.totalSites || 0}\n`;
      contextText += `- Total Participants: ${contextData.statistics.totalParticipants || 0}\n`;
      contextText += `- Total Adverse Events: ${contextData.statistics.totalAdverseEvents || 0}\n`;
    }

    // Add summary if available
    if (contextData.summary) {
      contextText += `\n### Summary:\n`;
      if (contextData.summary.byStatus) {
        contextText += `Trial Status: ${JSON.stringify(contextData.summary.byStatus)}\n`;
      }
      if (contextData.summary.byPhase) {
        contextText += `Trial Phases: ${JSON.stringify(contextData.summary.byPhase)}\n`;
      }
    }

    // Add trials data
    if (contextData.trials && contextData.trials.length > 0) {
      contextText += `\n### Clinical Trials Found (${contextData.trials.length}):\n`;
      contextData.trials.slice(0, 5).forEach((trial: any, index: number) => {
        contextText += `${index + 1}. ${trial.title || trial.trialId}\n`;
        contextText += `   - ID: ${trial.id || trial.trialId}\n`;
        contextText += `   - Drug: ${trial.drug}\n`;
        contextText += `   - Phase: ${trial.phase}\n`;
        contextText += `   - Status: ${trial.status}\n`;
        contextText += `   - Indication: ${trial.indication}\n`;
        if (trial.sponsor) contextText += `   - Sponsor: ${trial.sponsor}\n`;
      });
      if (contextData.trials.length > 5) {
        contextText += `... and ${contextData.trials.length - 5} more trials\n`;
      }
    }

    // Add drugs data
    if (contextData.drugs && contextData.drugs.length > 0) {
      contextText += `\n### Drugs Found (${contextData.drugs.length}):\n`;
      contextData.drugs.slice(0, 5).forEach((drug: any, index: number) => {
        contextText += `${index + 1}. ${drug.name} (${drug.drugId})\n`;
        contextText += `   - Class: ${drug.class}\n`;
        contextText += `   - Target: ${drug.target}\n`;
        const approvalStatus = typeof drug.approvalStatus === 'string' 
          ? drug.approvalStatus 
          : (drug.approvalStatus?.status || drug.approvalStatus?.FDA ? 'FDA Approved' : 'Unknown');
        contextText += `   - Approval: ${approvalStatus}\n`;
      });
    }

    // Add sites data
    if (contextData.sites && contextData.sites.length > 0) {
      contextText += `\n### Trial Sites Found (${contextData.sites.length}):\n`;
      contextData.sites.forEach((site: any, index: number) => {
        contextText += `${index + 1}. ${site.name} (${site.siteId})\n`;
        contextText += `   - Location: ${site.city}, ${site.country}\n`;
        contextText += `   - Capacity: ${site.capacity}\n`;
      });
    }

    // Add participants data
    if (contextData.participants && contextData.participants.length > 0) {
      contextText += `\n### Participants Found (${contextData.participants.length}):\n`;
      contextData.participants.forEach((participant: any, index: number) => {
        contextText += `${index + 1}. ${participant.participantId}\n`;
        contextText += `   - Age: ${participant.age}, Gender: ${participant.gender}\n`;
        contextText += `   - Status: ${participant.enrollmentStatus}\n`;
      });
    }

    // Add adverse events data
    if (contextData.adverseEvents && contextData.adverseEvents.length > 0) {
      contextText += `\n### Adverse Events Found (${contextData.adverseEvents.length}):\n`;
      contextData.adverseEvents.forEach((event: any, index: number) => {
        contextText += `${index + 1}. ${event.eventId}\n`;
        contextText += `   - Description: ${event.description}\n`;
        contextText += `   - Severity: ${event.severity}${event.isSerious ? ' (Serious)' : ''}\n`;
      });
    }

    // Return structured context
    return {
      userMessage,
      contextText: contextText.trim()
    };
  }

  /**
   * Call HCL AI Cafe LLM with prepared prompt (RAG-based approach)
   */
  private callHCLAICafe(promptData: { userMessage: string; contextText: string } | string, includeHistory: boolean, contextData: any): Observable<any> {
    const url = `${this.endpoint}/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;

    // Extract user message and context
    const userMessage = typeof promptData === 'string' ? promptData : promptData.userMessage;
    const databaseContext = typeof promptData === 'object' ? promptData.contextText : '';

    // Build context-aware system prompt with HTML formatting instructions
    let systemPrompt = `You are PharmaGenie AI, an intelligent assistant specializing in pharmaceutical clinical trials and drug development.

## YOUR ROLE:
You have access to a live clinical trials database and must provide accurate, data-driven responses based on the available information.

## CRITICAL INSTRUCTIONS:
1. **ALWAYS use the database context provided below to answer questions**
2. **CITE SPECIFIC DATA**: Reference actual trial IDs, drug names, phases, sites, and statistics from the database
3. **BE PRECISE**: Use exact numbers, dates, and details from the context
4. **NEVER HALLUCINATE**: Do not invent trial data, drug names, or statistics not present in the context
5. **ACKNOWLEDGE LIMITATIONS**: If the database doesn't contain requested information, clearly state this

## RESPONSE FORMATTING (CRITICAL):
Use ULTRA-COMPACT HTML - NO TABLES at all:

### STRICT RULES:
- Write HTML on single lines with NO whitespace between tags
- NO <hr>, NO multiple <br>, NO empty tags
- NEVER use <table> - use cards or lists instead
- margin: 6px 0 max for any element

### List Trials/Drugs/Sites (Use Cards):
<div style="background:#f0f4ff;padding:8px;border-radius:6px;border-left:3px solid #667eea;margin:6px 0;"><strong style="color:#667eea;">Trial NCT12345</strong><br><span style="font-size:12px;">Drug: Pembrolizumab | Phase: III | Status: <span style="background:#4caf50;color:white;padding:2px 5px;border-radius:3px;font-size:10px;">Active</span></span><br><span style="font-size:11px;color:#666;">Indication: NSCLC | Enrollment: 450/600</span></div>

### Key-Value Data (Use compact list):
<div style="margin:6px 0;"><strong>Field:</strong> Value<br><strong>Another:</strong> Data</div>

### Badge:
<span style="background:#e3f2fd;padding:2px 5px;border-radius:3px;font-size:11px;margin-right:3px;">Active</span>

### Header:
<h3 style="margin:6px 0 4px 0;font-size:15px;color:#667eea;">📊 Section</h3>

Colors: Trials #667eea, Drugs #e91e63, Sites #4caf50

## YOUR CAPABILITIES:
✓ Analyze clinical trial data and provide insights
✓ Compare trials, drugs, phases, and outcomes
✓ Explain trial protocols, eligibility criteria, and methodologies
✓ Provide site and participant information
✓ Analyze adverse events and safety profiles
✓ Generate summaries and statistical overviews`;

    // Add database context if available
    if (databaseContext && databaseContext.trim().length > 0) {
      systemPrompt += `\n\n## DATABASE CONTEXT:\n${databaseContext}\n\n**IMPORTANT**: Base your response ONLY on the above database information. Reference specific trials, drugs, and data points. Use the HTML formatting structure described above.`;
    } else {
      // No database context - use simpler instructions without HTML formatting
      systemPrompt = `You are PharmaGenie AI, a helpful assistant for pharmaceutical and clinical trials questions.

Provide clear, concise, and accurate information using simple markdown formatting.
If you don't have specific data, acknowledge this and provide general guidance.`;
    }

    console.log('🎯 System Prompt Decision:', {
      hasDatabaseContext: !!(databaseContext && databaseContext.trim().length > 0),
      contextLength: databaseContext?.length || 0,
      usingHTMLFormat: !!(databaseContext && databaseContext.trim().length > 0)
    });

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    // Add conversation history if requested
    if (includeHistory && this.conversationHistory.length > 0) {
      messages.push(...this.conversationHistory.slice(-10)); // Last 10 messages
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage
    });

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-key': this.apiKey
    });

    const body = {
      model: this.deploymentName,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 0.95,
      frequency_penalty: 0,
      presence_penalty: 0
    };

    console.log('📤 Sending RAG-enhanced request to HCL AI Cafe:', {
      deployment: this.deploymentName,
      messageCount: messages.length,
      hasContext: !!contextData,
      contextLength: databaseContext?.length || 0,
      userQuery: userMessage.substring(0, 100)
    });

    // Debug: Log messages being sent
    console.log('📨 Messages array:', JSON.stringify(messages.map(m => ({
      role: m.role,
      contentLength: m.content.length,
      contentPreview: m.content.substring(0, 200)
    })), null, 2));

    // Debug: Log complete request body
    console.log('📋 Request body:', JSON.stringify({
      model: body.model,
      messagesCount: body.messages.length,
      temperature: body.temperature,
      max_tokens: body.max_tokens
    }, null, 2));

    return this.http.post(url, body, { headers }).pipe(
      map((response: any) => {
        console.log('✅ HCL AI Cafe Raw Response:', {
          hasChoices: !!response.choices,
          choicesLength: response.choices?.length || 0,
          model: response.model,
          usage: response.usage
        });

        if (response.choices && response.choices[0]?.message?.content) {
          console.log('📝 Response content preview:', response.choices[0].message.content.substring(0, 200));
        }

        // Post-process response to add database statistics header if context was provided
        if (databaseContext && contextData && response.choices?.[0]?.message?.content) {
          const originalContent = response.choices[0].message.content;
          const enhancedContent = this.addStatisticsHeader(originalContent, contextData);
          response.choices[0].message.content = enhancedContent;
          console.log('🎨 Added statistics header to response');
        }
        return response;
      }),
      catchError(error => {
        console.error('❌ HCL AI Cafe API Error:', {
          status: error.status,
          statusText: error.statusText,
          message: error.message,
          error: error.error
        });
        throw error;
      })
    );
  }

  /**
   * Add statistics header to response (similar to NLP chatbot)
   */
  private addStatisticsHeader(content: string, contextData: any): string {
    if (!contextData || !contextData.statistics) return content;

    const stats = contextData.statistics;
    const summary = contextData.summary || {};

    // Check if there's any actual data to show
    const hasAnyData = (
      (stats.totalTrials && stats.totalTrials > 0) ||
      (stats.totalDrugs && stats.totalDrugs > 0) ||
      (stats.totalSites && stats.totalSites > 0) ||
      (stats.totalParticipants && stats.totalParticipants > 0) ||
      (stats.totalAdverseEvents && stats.totalAdverseEvents > 0)
    );

    // Don't show header if no data
    if (!hasAnyData) return content;

    let header = '<div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:10px 12px;border-radius:8px;color:white;margin-bottom:8px;">';
    header += '<h3 style="margin:0 0 8px 0;font-size:14px;font-weight:600;">📊 Database Results</h3>';
    header += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:6px;">';
    
    if (stats.totalTrials > 0) {
      header += `<div style="background:rgba(255,255,255,0.2);padding:6px;border-radius:6px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${stats.totalTrials}</div><div style="font-size:10px;opacity:0.9;">Trials</div></div>`;
    }
    
    if (stats.totalDrugs > 0) {
      header += `<div style="background:rgba(255,255,255,0.2);padding:6px;border-radius:6px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${stats.totalDrugs}</div><div style="font-size:10px;opacity:0.9;">Drugs</div></div>`;
    }
    
    if (stats.totalSites > 0) {
      header += `<div style="background:rgba(255,255,255,0.2);padding:6px;border-radius:6px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${stats.totalSites}</div><div style="font-size:10px;opacity:0.9;">Sites</div></div>`;
    }
    
    if (stats.totalParticipants > 0) {
      header += `<div style="background:rgba(255,255,255,0.2);padding:6px;border-radius:6px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${stats.totalParticipants}</div><div style="font-size:10px;opacity:0.9;">Participants</div></div>`;
    }
    
    if (stats.totalAdverseEvents > 0) {
      header += `<div style="background:rgba(255,255,255,0.2);padding:6px;border-radius:6px;text-align:center;"><div style="font-size:20px;font-weight:bold;">${stats.totalAdverseEvents}</div><div style="font-size:10px;opacity:0.9;">Events</div></div>`;
    }
    
    header += '</div></div>';
    
    // Combine header with LLM response - NO extra spacing
    return header + content;
  }

  /**
   * Add message to conversation history
   */
  addToHistory(role: 'user' | 'assistant', content: string): void {
    this.conversationHistory.push({ role, content });

    // Keep only last 20 messages to prevent token overflow
    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
    console.log('🧹 Conversation history cleared');
  }

  /**
   * Get current conversation history
   */
  getHistory(): Array<{ role: string; content: string }> {
    return [...this.conversationHistory];
  }
}
