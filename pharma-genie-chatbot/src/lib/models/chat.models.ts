export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'table' | 'detailed' | 'list';
  data?: any;
}

export interface TrialData {
  // MongoDB uses trialId instead of id
  trialId: string;
  title: string;
  sponsor: string;
  drug: string;
  indication: string;
  phase: string;
  status: string;
  startDate: string;
  endDate?: string;
  estimatedCompletion?: string;
  enrollmentTarget: number;
  // MongoDB uses currentEnrollment instead of enrollmentCurrent
  currentEnrollment: number;
  description?: string;
  principalInvestigator?: {
    name: string;
    affiliation: string;
    email: string;
  };
  sites?: Array<{
    _id?: string;
    name?: string;
    address?: {
      city?: string;
      country?: string;
    };
  }>;
  participants?: any[];
  adverseEvents?: any[];
  inclusionCriteria?: string[];
  exclusionCriteria?: string[];
  primaryEndpoint?: string;
  secondaryEndpoints?: string[];
  // Backward compatibility
  id?: string; // Computed from trialId
  enrollmentCurrent?: number; // Alias for currentEnrollment
  primaryOutcome?: string; // Alias for primaryEndpoint
  studyType?: string;
}

export interface ChatResponse {
  // New MongoDB response structure
  type: 'error' | 'count' | 'detail' | 'list';
  content: string;
  count?: number;
  trials?: TrialData[];  // Always an array, even for detail view
  trial?: TrialData;     // Legacy support only
  // Multi-collection support
  drugs?: any[];
  sites?: any[];
  participants?: any[];
  adverseEvents?: any[];
  primaryCollection?: string;
  // Consolidated data statistics
  statistics?: {
    trials?: { count: number; breakdown: Record<string, number> };
    drugs?: { count: number; breakdown: Record<string, number> };
    sites?: { count: number; breakdown: Record<string, number> };
    participants?: { count: number; breakdown: Record<string, number> };
    adverseEvents?: { count: number; breakdown: Record<string, number>; serious?: number; nonSerious?: number };
  };
  summary?: {
    totalRecords: number;
    trials: number;
    drugs: number;
    sites: number;
    participants: number;
    adverseEvents: number;
  };
  // Legacy fields for backward compatibility
  query?: string;
  analysis?: any;
  resultsCount?: number;
  response?: {
    type: string;
    content: string;
    trials?: any[];
    trial?: any;
  };
  data?: TrialData[];
  format?: string;
}

export interface PharmaGenieConfig {
  apiUrl: string;
  mode?: 'nlp' | 'genai';  // NLP uses backend API, GenAI uses HCL AI Cafe
  theme?: 'light' | 'dark';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  enableExport?: boolean;
  placeholder?: string;
  welcomeMessage?: string;
  clearOnInit?: boolean;  // Clear chat history when component initializes
  // GenAI specific config
  genaiConfig?: {
    hclAICafeUrl?: string;
    hclAICafeApiKey?: string;
    model?: string;
  };
}
