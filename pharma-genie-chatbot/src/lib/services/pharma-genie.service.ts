import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { ChatMessage, ChatResponse, TrialData, PharmaGenieConfig } from '../models/chat.models';

@Injectable({
  providedIn: 'root'
})
export class PharmaGenieService {
  private config: PharmaGenieConfig = {
    apiUrl: 'http://localhost:3000',
    theme: 'light',
    position: 'bottom-right',
    enableExport: true,
    placeholder: 'Ask about clinical trials...',
    welcomeMessage: 'Hello! I\'m PharmaGenie. Ask me about clinical trials, drug studies, and research data.'
  };

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {
    this.addWelcomeMessage();
  }

  setConfig(config: Partial<PharmaGenieConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfig(): PharmaGenieConfig {
    return this.config;
  }

  private addWelcomeMessage(): void {
    const welcomeMsg: ChatMessage = {
      id: this.generateId(),
      text: this.config.welcomeMessage || 'Hello! How can I help you with clinical trials today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    this.messagesSubject.next([welcomeMsg]);
  }

  sendMessage(query: string): void {
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: this.generateId(),
      text: query,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, userMessage]);

    this.loadingSubject.next(true);

    this.queryChatbot(query).subscribe({
      next: (response) => {
        console.log('🔍 Raw API Response:', response);
        this.loadingSubject.next(false);
        const botMessage = this.createBotMessage(response);
        console.log('💬 Bot Message Created:', botMessage);
        this.messagesSubject.next([...this.messagesSubject.value, botMessage]);
      },
      error: (error) => {
        this.loadingSubject.next(false);
        const errorMessage: ChatMessage = {
          id: this.generateId(),
          text: 'Sorry, I encountered an error processing your request. Please try again.',
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
        this.messagesSubject.next([...this.messagesSubject.value, errorMessage]);
        console.error('Chat error:', error);
      }
    });
  }

  private queryChatbot(query: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.config.apiUrl}/api/chat`, { query });
  }

  exportData(data: any, format: 'csv' | 'excel'): Observable<Blob> {
    const endpoint = format === 'csv' ? '/api/export/csv' : '/api/export/excel';
    
    // Check if data is consolidated response format or legacy array
    const payload = Array.isArray(data) 
      ? { data, collectionType: 'trials' }  // Legacy format
      : { responseData: data };  // New consolidated format
    
    return this.http.post(`${this.config.apiUrl}${endpoint}`, payload, {
      responseType: 'blob'
    });
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
    this.addWelcomeMessage();
  }

  private createBotMessage(response: ChatResponse): ChatMessage {
    // Handle new consolidated MongoDB response format
    let messageType: 'text' | 'table' | 'detailed' | 'list' = 'text';
    let messageData: any;
    let messageText: string;

    console.log('🔍 Creating bot message from response:', response);

    // NEW FORMAT: Consolidated data with statistics
    if (response.content === 'consolidated' && response.statistics) {
      messageType = response.type === 'detail' ? 'detailed' : 'list';
      messageText = this.formatConsolidatedHTML(response);
      
      // Prepare multi-collection data
      messageData = {
        trials: response.trials || [],
        drugs: response.drugs || [],
        sites: response.sites || [],
        participants: response.participants || [],
        adverseEvents: response.adverseEvents || [],
        statistics: response.statistics,
        summary: response.summary
      };
    }
    // Standard response format
    else if (response.type) {
      messageText = response.content;
      
      // Map response types to message types
      messageType = response.type === 'error' ? 'text' :
                    response.type === 'count' ? 'list' :
                    response.type === 'detail' ? 'detailed' :
                    response.type === 'list' ? 'list' : 'text';
      
      // Extract data based on response type and available collections
      if (response.type === 'list' || response.type === 'count') {
        messageData = {
          trials: response.trials || [],
          drugs: response.drugs || [],
          sites: response.sites || [],
          participants: response.participants || [],
          adverseEvents: response.adverseEvents || [],
          count: response.count
        };
      } else if (response.type === 'detail') {
        messageData = response.trials || [];
      } else {
        messageData = null;
      }
    }
    // Legacy format (for backward compatibility)
    else if (response.response) {
      messageText = response.response.content;
      messageType = response.response.type as any;
      messageData = response.response.type === 'list' ? response.response.trials :
                    response.response.type === 'detailed' ? response.response.trial :
                    response.data;
    }
    // Fallback
    else {
      messageText = 'Received response from server';
      messageData = response;
    }

    // Normalize trial data (convert MongoDB fields to frontend expected fields)
    if (messageData && Array.isArray(messageData)) {
      messageData = messageData.map((item: any) => this.normalizeTrialData(item));
    } else if (messageData && typeof messageData === 'object' && !Array.isArray(messageData)) {
      // Handle multi-collection object
      if (messageData.trials || messageData.drugs) {
        const normalized: any = {
          statistics: messageData.statistics,
          summary: messageData.summary
        };
        if (messageData.trials) normalized.trials = messageData.trials.map((t: any) => this.normalizeTrialData(t));
        if (messageData.drugs) normalized.drugs = messageData.drugs;
        if (messageData.sites) normalized.sites = messageData.sites;
        if (messageData.participants) normalized.participants = messageData.participants;
        if (messageData.adverseEvents) normalized.adverseEvents = messageData.adverseEvents;
        if (messageData.primaryCollection) normalized.primaryCollection = messageData.primaryCollection;
        if (messageData.count !== undefined) normalized.count = messageData.count;
        messageData = normalized;
      } else {
        messageData = [this.normalizeTrialData(messageData)];
      }
    }

    console.log('📦 Final message data:', messageData);

    return {
      id: this.generateId(),
      text: messageText,
      sender: 'bot',
      timestamp: new Date(),
      type: messageType,
      data: messageData
    };
  }

  private normalizeTrialData(trial: any): any {
    if (!trial) return trial;
    
    return {
      // Use MongoDB field names as primary, with fallbacks
      id: trial.trialId || trial.id,
      trialId: trial.trialId || trial.id,
      title: trial.title,
      sponsor: trial.sponsor,
      drug: trial.drug,
      indication: trial.indication,
      phase: trial.phase,
      status: trial.status,
      startDate: trial.startDate,
      endDate: trial.endDate,
      
      // Handle enrollment fields (MongoDB uses currentEnrollment, frontend expects enrollmentCurrent)
      enrollmentCurrent: trial.currentEnrollment ?? trial.enrollmentCurrent,
      currentEnrollment: trial.currentEnrollment ?? trial.enrollmentCurrent,
      enrollmentTarget: trial.enrollmentTarget,
      enrollmentProgress: trial.enrollmentProgress || `${trial.currentEnrollment || 0}/${trial.enrollmentTarget || 0}`,
      
      // Handle endpoint/outcome fields
      primaryOutcome: trial.primaryEndpoint || trial.primaryOutcome,
      primaryEndpoint: trial.primaryEndpoint || trial.primaryOutcome,
      secondaryEndpoints: trial.secondaryEndpoints,
      
      // Handle principal investigator
      principalInvestigator: trial.principalInvestigator,
      
      // Format sites - handle both array of objects and array of strings
      sites: trial.sites,
      sitesFormatted: trial.sites?.map((site: any) => {
        if (typeof site === 'string') return site;
        if (site.name) return site.name;
        if (site.address?.city && site.address?.country) {
          return `${site.address.city}, ${site.address.country}`;
        }
        return 'Unknown Site';
      }).join(', ') || '',
      
      // Pass through other fields
      description: trial.description,
      eligibilityCriteria: trial.eligibilityCriteria,
      participants: trial.participants,
      adverseEvents: trial.adverseEvents
    };
  }

  private formatConsolidatedHTML(response: any): string {
    const stats = response.statistics;
    const summary = response.summary;
    
    let html = '<div class="consolidated-data">';
    html += '<h3 style="margin: 0 0 15px 0; color: #667eea;">📊 Consolidated Clinical Trials Data</h3>';
    
    // Summary cards
    html += '<div class="summary-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin-bottom: 20px;">';
    
    if (summary.trials > 0) {
      html += `<div class="summary-card" style="background: #f0f4ff; padding: 12px; border-radius: 8px; border-left: 4px solid #667eea;">
        <div style="font-size: 24px; font-weight: bold; color: #667eea;">${summary.trials}</div>
        <div style="font-size: 12px; color: #666;">Clinical Trials</div>
      </div>`;
    }
    
    if (summary.drugs > 0) {
      html += `<div class="summary-card" style="background: #fff0f6; padding: 12px; border-radius: 8px; border-left: 4px solid #e91e63;">
        <div style="font-size: 24px; font-weight: bold; color: #e91e63;">${summary.drugs}</div>
        <div style="font-size: 12px; color: #666;">Drugs</div>
      </div>`;
    }
    
    if (summary.sites > 0) {
      html += `<div class="summary-card" style="background: #e8f5e9; padding: 12px; border-radius: 8px; border-left: 4px solid #4caf50;">
        <div style="font-size: 24px; font-weight: bold; color: #4caf50;">${summary.sites}</div>
        <div style="font-size: 12px; color: #666;">Trial Sites</div>
      </div>`;
    }
    
    if (summary.participants > 0) {
      html += `<div class="summary-card" style="background: #fff3e0; padding: 12px; border-radius: 8px; border-left: 4px solid #ff9800;">
        <div style="font-size: 24px; font-weight: bold; color: #ff9800;">${summary.participants}</div>
        <div style="font-size: 12px; color: #666;">Participants</div>
      </div>`;
    }
    
    if (summary.adverseEvents > 0) {
      html += `<div class="summary-card" style="background: #ffebee; padding: 12px; border-radius: 8px; border-left: 4px solid #f44336;">
        <div style="font-size: 24px; font-weight: bold; color: #f44336;">${summary.adverseEvents}</div>
        <div style="font-size: 12px; color: #666;">Adverse Events</div>
      </div>`;
    }
    
    html += '</div>';
    
    // Detailed breakdowns
    html += '<div class="breakdowns" style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">';
    
    if (stats.trials?.breakdown && Object.keys(stats.trials.breakdown).length > 0) {
      html += '<div style="margin-bottom: 12px;"><strong style="color: #667eea;">Trial Status:</strong> ';
      html += Object.entries(stats.trials.breakdown)
        .map(([key, value]) => `<span style="background: #e3f2fd; padding: 4px 8px; border-radius: 4px; margin: 0 4px; font-size: 12px;">${key}: ${value}</span>`)
        .join('');
      html += '</div>';
    }
    
    if (stats.drugs?.breakdown && Object.keys(stats.drugs.breakdown).length > 0) {
      html += '<div style="margin-bottom: 12px;"><strong style="color: #e91e63;">Drug Approval:</strong> ';
      html += Object.entries(stats.drugs.breakdown)
        .map(([key, value]) => `<span style="background: #fce4ec; padding: 4px 8px; border-radius: 4px; margin: 0 4px; font-size: 12px;">${key}: ${value}</span>`)
        .join('');
      html += '</div>';
    }
    
    if (stats.sites?.breakdown && Object.keys(stats.sites.breakdown).length > 0) {
      html += '<div style="margin-bottom: 12px;"><strong style="color: #4caf50;">Site Locations:</strong> ';
      html += Object.entries(stats.sites.breakdown)
        .map(([key, value]) => `<span style="background: #e8f5e9; padding: 4px 8px; border-radius: 4px; margin: 0 4px; font-size: 12px;">${key}: ${value}</span>`)
        .join('');
      html += '</div>';
    }
    
    if (stats.participants?.breakdown && Object.keys(stats.participants.breakdown).length > 0) {
      html += '<div style="margin-bottom: 12px;"><strong style="color: #ff9800;">Demographics:</strong> ';
      html += Object.entries(stats.participants.breakdown)
        .map(([key, value]) => `<span style="background: #fff3e0; padding: 4px 8px; border-radius: 4px; margin: 0 4px; font-size: 12px;">${key}: ${value}</span>`)
        .join('');
      html += '</div>';
    }
    
    if (stats.adverseEvents?.breakdown && Object.keys(stats.adverseEvents.breakdown).length > 0) {
      html += '<div style="margin-bottom: 12px;"><strong style="color: #f44336;">Event Severity:</strong> ';
      html += Object.entries(stats.adverseEvents.breakdown)
        .map(([key, value]) => `<span style="background: #ffebee; padding: 4px 8px; border-radius: 4px; margin: 0 4px; font-size: 12px;">${key}: ${value}</span>`)
        .join('');
      if (stats.adverseEvents.serious !== undefined) {
        html += `<span style="background: #ffcdd2; padding: 4px 8px; border-radius: 4px; margin: 0 4px; font-size: 12px;">Serious: ${stats.adverseEvents.serious}</span>`;
        html += `<span style="background: #fff; padding: 4px 8px; border-radius: 4px; margin: 0 4px; font-size: 12px;">Non-Serious: ${stats.adverseEvents.nonSerious}</span>`;
      }
      html += '</div>';
    }
    
    html += '</div>';
    
    html += `<div style="text-align: center; padding: 10px; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border-radius: 8px; font-weight: bold;">
      📈 Total Records: ${summary.totalRecords} across all collections
    </div>`;
    
    html += '</div>';
    
    return html;
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
