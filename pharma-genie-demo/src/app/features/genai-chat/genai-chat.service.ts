import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenAIMessage } from '../../shared/models/genai.models';
import { HCLAICafeService } from '../../shared/services/hcl-aicafe.service';

@Injectable({
  providedIn: 'root'
})
export class GenAIChatService {
  private sessionId: string;

  // Signals for reactive state
  messages = signal<GenAIMessage[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private http: HttpClient,
    private hclAICafe: HCLAICafeService
  ) {
    this.sessionId = this.generateSessionId();
    this.addWelcomeMessage();
    console.log('🤖 GenAI Chat Service initialized with direct HCL AI Cafe integration');
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  private addWelcomeMessage(): void {
    const welcomeMessage: GenAIMessage = {
      id: this.generateMessageId(),
      role: 'assistant',
      content: `Hello! I'm PharmaGenie's GenAI assistant, powered by **HCL AI Cafe**.

I can help you with:

📊 Clinical trial analysis and insights
💊 Drug information and research  
🏥 Trial site capabilities
👥 Participant demographics
⚠️ Adverse event patterns

I'm directly connected to HCL AI Cafe's GPT-4.1 model for fast, intelligent responses. What would you like to know?`,
      timestamp: new Date()
    };

    this.messages.set([welcomeMessage]);
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Send a message and get AI response using HCL AI Cafe directly
   */
  sendMessage(message: string, context?: Record<string, unknown>): void {
    if (!message.trim()) return;

    // Add user message
    const userMessage: GenAIMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date()
    };

    this.messages.update(msgs => [...msgs, userMessage]);
    this.loading.set(true);
    this.error.set(null);

    console.log('📤 Sending message to HCL AI Cafe:', message);

    // Add to HCL AI Cafe conversation history
    this.hclAICafe.addToHistory('user', message);

    // Call HCL AI Cafe directly
    this.hclAICafe.generateResponse(message, true).subscribe({
      next: (response) => {
        this.loading.set(false);
        
        const aiReply = response.choices?.[0]?.message?.content || 'No response received';
        const model = response.model || 'gpt-4.1';
        const tokens = response.usage?.total_tokens || 0;

        console.log('✅ Received response from HCL AI Cafe:', {
          model,
          tokens,
          responseLength: aiReply.length
        });

        // Add to conversation history
        this.hclAICafe.addToHistory('assistant', aiReply);
        
        const assistantMessage: GenAIMessage = {
          id: this.generateMessageId(),
          role: 'assistant',
          content: aiReply,
          timestamp: new Date(),
          tokens: tokens,
          model: model
        };

        this.messages.update(msgs => [...msgs, assistantMessage]);
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.error?.error?.message || err.message || 'Failed to get response from HCL AI Cafe';
        this.error.set(errorMsg);

        console.error('❌ HCL AI Cafe error:', err);

        const errorMessage: GenAIMessage = {
          id: this.generateMessageId(),
          role: 'assistant',
          content: `Sorry, I encountered an error connecting to HCL AI Cafe: ${errorMsg}. Please try again.`,
          timestamp: new Date()
        };

        this.messages.update(msgs => [...msgs, errorMessage]);
      }
    });
  }

  /**
   * Clear chat history
   */
  clearMessages(): void {
    this.sessionId = this.generateSessionId();
    this.messages.set([]);
    this.error.set(null);
    this.hclAICafe.clearHistory();
    this.addWelcomeMessage();
    console.log('🧹 Chat and HCL AI Cafe history cleared');
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}
