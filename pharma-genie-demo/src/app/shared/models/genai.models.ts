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
}

export interface GenAIChatRequest {
  sessionId: string;
  message: string;
  context?: Record<string, unknown>;
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
