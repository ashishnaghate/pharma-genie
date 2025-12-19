/**
 * GenAI Chat Models
 */

export interface GenAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  tokens?: number;
  model?: string;
  responseData?: GenAIResponse;  // Full response data for export
}

export interface GenAIChatRequest {
  sessionId: string;
  message: string;
  context?: Record<string, unknown>;
}

export interface GenAIResponse {
  type: 'text' | 'count' | 'detail' | 'list';
  content: string;
  summary?: {
    totalRecords: number;
    trials: number;
    drugs: number;
    sites: number;
    participants: number;
    adverseEvents: number;
  };
  statistics?: any;
  trials?: any[];
  drugs?: any[];
  sites?: any[];
  participants?: any[];
  adverseEvents?: any[];
  aiInsight?: string;
  genai?: {
    reply: string;
    model: string;
    tokens: number;
    latencyMs: number;
  };
}

export interface GenAIChatResponse {
  reply: string;
  model: string;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  latencyMs: number;
  sessionId: string;
}

export interface StreamEvent {
  type: 'token' | 'done' | 'error';
  content: string;
  metadata?: {
    model?: string;
    tokens?: number;
  };
}

export interface ChatSession {
  sessionId: string;
  userId: string;
  messages: GenAIMessage[];
  metadata: {
    provider: string;
    model: string;
    totalTokens: number;
    totalCost: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
