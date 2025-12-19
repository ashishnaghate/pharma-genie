# Unified Chatbot Implementation

## Overview
Successfully unified both NLP and GenAI chatbots using a single reusable npm package (`pharma-genie-chatbot`) with mode-based configuration.

## Architecture

### NPM Package: `pharma-genie-chatbot`
Single reusable chatbot component that supports both modes through configuration.

#### Mode Configuration
```typescript
interface PharmaGenieConfig {
  apiUrl: string;
  mode: 'nlp' | 'genai';  // New: Mode selection
  genaiConfig?: {          // New: GenAI-specific config
    apiUrl: string;
    apiKey: string;
    model?: string;
  };
}
```

### NLP Mode
- **Purpose**: Database querying and data export
- **Backend**: Node.js API → NLP Service → MongoDB
- **Features**: 
  - Unified response format with statistics
  - Smart CSV/Excel export (based on query results)
  - Record counts and detailed data display
  - Supports all collections (trials, drugs, sites, participants, adverse events)

### GenAI Mode
- **Purpose**: Conversational AI assistance
- **Backend**: HCL AI Cafe API (GPT-4.1) direct integration
- **Features**:
  - Natural language conversation
  - Conversation history management
  - AI-powered insights
  - No database queries or exports (pure conversational)

## Implementation Details

### Service Layer (pharma-genie.service.ts)
```typescript
sendMessage(message: string): Observable<ChatMessage> {
  if (this.config.mode === 'genai') {
    return this.sendGenAIMessage(message);
  } else {
    return this.sendNLPMessage(message);
  }
}

private sendNLPMessage(message: string): Observable<ChatMessage> {
  // Routes to backend NLP API
  return this.http.post<any>(`${this.config.apiUrl}/chat`, { message })
    .pipe(map(response => this.formatResponse(response, 'bot')));
}

private sendGenAIMessage(message: string): Observable<ChatMessage> {
  // Direct integration with HCL AI Cafe
  this.conversationHistory.push({ role: 'user', content: message });
  
  return this.http.post<any>(
    `${this.config.genaiConfig!.apiUrl}/chat/completions`,
    {
      messages: this.conversationHistory,
      model: this.config.genaiConfig!.model || 'gpt-4.1'
    },
    { headers: { 'Authorization': `Bearer ${this.config.genaiConfig!.apiKey}` } }
  );
}
```

### Component Usage

#### NLP Chatbot Configuration
```typescript
// nlp-chat.component.ts
chatbotConfig: PharmaGenieConfig = {
  apiUrl: 'http://localhost:3000/api',
  mode: 'nlp'
};
```

#### GenAI Chatbot Configuration
```typescript
// genai-chat.component.ts
chatbotConfig: PharmaGenieConfig = {
  apiUrl: '', // Not used in GenAI mode
  mode: 'genai',
  genaiConfig: {
    apiUrl: environment.hclAICafeUrl,
    apiKey: environment.hclAICafeApiKey,
    model: 'gpt-4.1'
  }
};
```

### Conditional Features
The component automatically shows/hides features based on mode:

```html
<!-- Export buttons only in NLP mode -->
<div *ngIf="!isGenAIMode && message.data.summary && message.data.summary.totalRecords > 1">
  <button (click)="exportToCSV(message.data)">Export CSV</button>
  <button (click)="exportToExcel(message.data)">Export Excel</button>
</div>

<!-- Mode indicator in header -->
<h2>PharmaGenie Chatbot - {{ chatbotMode }}</h2>
```

## Unified Response Format

Both modes return consistent response structure:

```typescript
interface ChatResponse {
  type: 'success' | 'error';
  content: string;              // Human-readable message
  summary?: {
    totalRecords: number;
    collections: {
      trials?: number;
      drugs?: number;
      sites?: number;
      participants?: number;
      adverseEvents?: number;
    }
  };
  statistics?: {
    totalTrials: number;
    totalDrugs: number;
    totalSites: number;
    totalParticipants: number;
    totalAdverseEvents: number;
  };
  aiInsight?: string;           // AI-generated insight (from GenAI provider)
  data?: {
    trials?: Array<ClinicalTrial>;
    drugs?: Array<Drug>;
    sites?: Array<TrialSite>;
    participants?: Array<Participant>;
    adverseEvents?: Array<AdverseEvent>;
  };
}
```

## Export Functionality

### Smart Export Rules (NLP Mode Only)
1. **Single Collection + Multiple Records → CSV**
   - E.g., "show all drugs" returns 5 drugs → CSV with drug-specific columns
   
2. **Multiple Collections OR Single Collection → Excel**
   - Multi-collection: Each collection gets its own worksheet
   - Single collection: One worksheet with dynamic headers

### Collection-Specific Headers
Each collection type has optimized export columns:

- **Clinical Trials**: Trial ID, Title, Phase, Status, Start Date, End Date, Sponsor, etc.
- **Drugs**: Drug ID, Name, Type, Approval Status, Manufacturer, Indication, etc.
- **Trial Sites**: Site ID, Name, Location, Contact, Country, Status, etc.
- **Participants**: Participant ID, Age, Gender, Enrollment Date, Status, etc.
- **Adverse Events**: Event ID, Type, Severity, Date, Description, Participant ID, etc.

## Testing

### Servers Running
```
✅ Backend Server: http://localhost:3000
✅ Frontend App: http://localhost:4200
```

### Test Scenarios

#### NLP Mode Tests
1. **Single Collection Query**
   - Query: "show all drugs"
   - Expected: 5 drugs with CSV export button
   
2. **Multi-Collection Query**
   - Query: "show trials with drugs"
   - Expected: Mixed results with Excel export button

3. **No Results**
   - Query: "show trials in Antarctica"
   - Expected: Friendly message, no export buttons

#### GenAI Mode Tests
1. **Conversational Query**
   - Query: "What are the benefits of Phase III trials?"
   - Expected: AI-generated conversational response
   
2. **Follow-up Questions**
   - Query 1: "Tell me about clinical trials"
   - Query 2: "What are the phases?"
   - Expected: Context-aware responses with conversation history

3. **No Export Buttons**
   - Verify: Export buttons never appear in GenAI mode

## File Changes Summary

### NPM Package (`pharma-genie-chatbot`)
- ✅ `models/chat.models.ts`: Added mode and genaiConfig
- ✅ `services/pharma-genie.service.ts`: Mode routing, GenAI integration
- ✅ `components/chatbot.component.ts`: Mode detection, conditional rendering
- ✅ `components/chatbot.component.html`: Dynamic header, conditional exports
- ✅ `components/chatbot.component.css`: Export button styles

### Demo App (`pharma-genie-demo`)
- ✅ `features/genai-chat/genai-chat.component.ts`: Uses unified ChatbotComponent
- ✅ `features/genai-chat/genai-chat.component.html`: Simplified to <app-chatbot>
- ✅ `features/nlp-chat/nlp-chat.component.ts`: Added explicit mode='nlp'
- ✅ `environments/environment.ts`: Added HCL AI Cafe configuration

### Backend (`pharma-genie-backend`)
- ✅ `routes/genai.routes.js`: Unified response format
- ✅ `server.js`: Updated export endpoints, added aiInsight
- ✅ `utils/export-utils.js`: Dynamic export utilities

## Benefits

1. **Code Reusability**: Single npm package for all chatbot needs
2. **Maintainability**: One codebase to maintain instead of two
3. **Consistency**: Unified UI/UX across both modes
4. **Flexibility**: Easy to add new modes or features
5. **Type Safety**: Full TypeScript support with proper interfaces
6. **Scalability**: Clean separation of concerns, easy to extend

## Next Steps

1. ✅ Build npm package: `cd pharma-genie-chatbot && npm run build`
2. ✅ Install in demo: `cd pharma-genie-demo && npm install ../pharma-genie-chatbot`
3. ✅ Start backend: `cd pharma-genie-backend && node server.js`
4. ✅ Start frontend: `cd pharma-genie-demo && ng serve`
5. 🔄 Configure HCL AI Cafe API key in `environment.ts`
6. 🔄 Test both NLP and GenAI modes
7. 🔄 Verify export functionality in NLP mode

## Environment Configuration

Create `pharma-genie-demo/src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  hclAICafeUrl: 'YOUR_HCL_AICAFE_URL',
  hclAICafeApiKey: 'YOUR_API_KEY'
};
```

## Conclusion

Successfully unified both chatbots into a single reusable npm package with mode-based configuration, maintaining distinct functionality while sharing common UI components and patterns.
