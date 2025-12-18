/**
 * GenAI Provider Interface
 * Defines contract for all LLM provider implementations
 */

/**
 * Abstract base class for GenAI providers
 */
export class GenAIProvider {
  constructor(config) {
    this.config = config;
  }

  /**
   * Generate a response from the LLM
   */
  async generate(request) {
    throw new Error('generate() must be implemented by subclass');
  }

  /**
   * Stream a response from the LLM
   */
  async streamGenerate(request, onChunk) {
    throw new Error('streamGenerate() must be implemented by subclass');
  }

  /**
   * Sanitize user input to prevent prompt injection
   */
  sanitizeMessage(message) {
    if (typeof message !== 'string') {
      throw new Error('Message must be a string');
    }

    let sanitized = message.trim();

    // Remove potential prompt injection patterns
    sanitized = sanitized.replace(/(<\|.*?\|>)/g, '');
    sanitized = sanitized.replace(/(###\s*System|###\s*Assistant|###\s*User)/gi, '');
    sanitized = sanitized.replace(/(\[INST\]|\[\/INST\])/g, '');

    // Limit length
    const maxLength = 4000;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  /**
   * Get system prompt for pharmaceutical context
   */
  getSystemPrompt() {
    return `You are an AI assistant specialized in pharmaceutical and clinical research data analysis. 
You have access to a comprehensive database including:
- Clinical trials data
- Drug information
- Adverse events
- Participant demographics
- Safety reports

Provide accurate, evidence-based responses focused on pharmaceutical research. 
When uncertain, acknowledge limitations and suggest consulting primary sources.
Always prioritize patient safety and regulatory compliance in your guidance.`;
  }

  /**
   * Format context from MongoDB for LLM consumption
   */
  formatContext(context) {
    if (!context || Object.keys(context).length === 0) {
      return '';
    }

    const contextParts = [];
    
    if (context.clinicalTrials) {
      contextParts.push(`Clinical Trials: ${JSON.stringify(context.clinicalTrials)}`);
    }
    
    if (context.drugs) {
      contextParts.push(`Drug Information: ${JSON.stringify(context.drugs)}`);
    }
    
    if (context.adverseEvents) {
      contextParts.push(`Adverse Events: ${JSON.stringify(context.adverseEvents)}`);
    }

    return `Context from database:\n${contextParts.join('\n')}`;
  }

  /**
   * Validate provider configuration
   */
  validateConfig() {
    if (!this.config.apiKey && this.constructor.name !== 'MockProvider') {
      throw new Error('API key is required');
    }

    if (!this.config.model) {
      throw new Error('Model name is required');
    }

    if (this.config.temperature !== undefined) {
      if (this.config.temperature < 0 || this.config.temperature > 2) {
        throw new Error('Temperature must be between 0 and 2');
      }
    }

    if (this.config.maxTokens !== undefined) {
      if (this.config.maxTokens < 1 || this.config.maxTokens > 100000) {
        throw new Error('Max tokens must be between 1 and 100000');
      }
    }
  }
}
