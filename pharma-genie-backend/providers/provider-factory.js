import { GenAIProvider } from './genai-provider.interface.js';
import { HCLAICafeProvider } from './hcl-aicafe-provider.js';
import { MockProvider } from './mock-provider.js';

/**
 * Factory for creating GenAI provider instances
 * ONLY supports HCL AI Cafe and Mock providers
 */
export class ProviderFactory {
  static instance = null;

  /**
   * Create or retrieve singleton provider instance
   */
  static getProvider() {
    if (!this.instance) {
      this.instance = this.createProvider();
    }
    return this.instance;
  }

  /**
   * Reset provider instance (useful for testing or config changes)
   */
  static resetProvider() {
    this.instance = null;
  }

  /**
   * Create a new provider based on environment configuration
   * Only HCL AI Cafe is supported for production use
   */
  static createProvider() {
    const providerType = (process.env.GENAI_PROVIDER || 'mock').toLowerCase();
    const apiKey = process.env.GENAI_API_KEY || '';
    const endpoint = process.env.HCL_AICAFE_ENDPOINT;

    const config = {
      apiKey,
      endpoint,
      deploymentName: process.env.HCL_DEPLOYMENT_NAME || 'gpt-4.1',
      apiVersion: process.env.HCL_API_VERSION || '2024-12-01-preview',
      temperature: parseFloat(process.env.GENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.GENAI_MAX_TOKENS || '2000'),
      topP: parseFloat(process.env.GENAI_TOP_P || '0.95'),
    };

    console.log(`🤖 Initializing GenAI Provider: ${providerType}`);
    console.log(`📦 Model/Deployment: ${config.deploymentName}`);
    console.log(`🔗 Endpoint: ${endpoint || 'default'}`);

    switch (providerType) {
      case 'hcl-aicafe':
      case 'hcl':
        if (!apiKey) {
          console.warn('⚠️ HCL AI Cafe API key missing, falling back to mock provider');
          return new MockProvider(config);
        }
        console.log('✅ Using HCL AI Cafe provider');
        return new HCLAICafeProvider(config);

      case 'mock':
      default:
        console.log('🔧 Using mock provider (no real API calls)');
        return new MockProvider(config);
    }
  }

  /**
   * Create a specific provider (for testing)
   */
  static createSpecificProvider(type, config) {
    switch (type) {
      case 'hcl-aicafe':
      case 'hcl':
        return new HCLAICafeProvider(config);
      case 'mock':
        return new MockProvider(config);
      default:
        throw new Error(`Unsupported provider type: ${type}. Only 'hcl-aicafe' and 'mock' are supported.`);
    }
  }
}
