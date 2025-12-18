import { GenAIProvider } from './genai-provider.interface.js';

/**
 * HCL AI Cafe Provider
 * Integration with HCL AI Cafe OpenAI-compatible API
 */
export class HCLAICafeProvider extends GenAIProvider {
  constructor(config) {
    super(config);
    // HCL AI Cafe endpoint
    this.endpoint = config.endpoint || 'https://aicafe.hcl.com/AICafeService/api/v1/subscription/openai';
    this.deploymentName = config.deploymentName || 'gpt-4.1';
    this.apiVersion = config.apiVersion || '2024-12-01-preview';
    
    if (!this.config.apiKey) {
      throw new Error('HCL AI Cafe API key is required');
    }
  }

  async generate(request) {
    const startTime = Date.now();
    const sanitizedMessage = this.sanitizeMessage(request.message);

    try {
      const messages = [
        { role: 'system', content: this.getSystemPrompt() },
        ...(request.conversationHistory || []),
        { role: 'user', content: sanitizedMessage },
      ];

      // Add context from MongoDB if available
      if (request.context && Object.keys(request.context).length > 0) {
        const contextMessage = this.formatContext(request.context);
        messages.splice(1, 0, { role: 'system', content: contextMessage });
      }

      const url = `${this.endpoint}/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          model: this.deploymentName,
          messages,
          temperature: this.config.temperature || 0.7,
          maxTokens: this.config.maxTokens || 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`HCL AI Cafe API error: ${error.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      return {
        reply: data.choices[0].message.content,
        model: data.model || this.deploymentName,
        tokens: {
          prompt: data.usage?.promptTokens || 0,
          completion: data.usage?.completionTokens || 0,
          total: data.usage?.totalTokens || 0,
        },
        latencyMs,
      };
    } catch (error) {
      console.error('HCL AI Cafe generation error:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async streamGenerate(request, onChunk) {
    const sanitizedMessage = this.sanitizeMessage(request.message);

    try {
      const messages = [
        { role: 'system', content: this.getSystemPrompt() },
        ...(request.conversationHistory || []),
        { role: 'user', content: sanitizedMessage },
      ];

      if (request.context && Object.keys(request.context).length > 0) {
        const contextMessage = this.formatContext(request.context);
        messages.splice(1, 0, { role: 'system', content: contextMessage });
      }

      const url = `${this.endpoint}/deployments/${this.deploymentName}/chat/completions?api-version=${this.apiVersion}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          model: this.deploymentName,
          messages,
          temperature: this.config.temperature || 0.7,
          maxTokens: this.config.maxTokens || 2000,
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HCL AI Cafe stream error: ${response.statusText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            
            if (data === '[DONE]') {
              onChunk({ type: 'done', content: '', metadata: { model: this.deploymentName } });
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              
              if (content) {
                onChunk({ type: 'token', content });
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('HCL AI Cafe stream error:', error);
      onChunk({ type: 'error', content: error.message });
      throw error;
    }
  }
}
