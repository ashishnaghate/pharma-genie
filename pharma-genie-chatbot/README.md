# PharmaGenie Chatbot 🧬

An intelligent, dual-mode AI chatbot for pharmaceutical clinical trials, built as an Angular library with NLP and GenAI capabilities.

## Features

- 🤖 **Dual AI Modes** - Traditional NLP + Advanced GenAI (HCL AI Cafe)
- 🎨 **Pharma-themed UI** - Clean, professional design with medical branding
- 🧠 **Smart Query Processing** - Natural language understanding with entity extraction
- 💬 **Session Management** - Persistent conversation history with MongoDB
- 📊 **Multiple Export Formats** - CSV, Excel (multi-sheet), Table, and Text responses
- ♿ **Accessible** - WCAG 2.1 compliant with keyboard navigation
- 📱 **Responsive** - Works on all devices and screen sizes
- 🔌 **Easy Integration** - Drop-in component for Angular apps
- 🔒 **Secure** - Works with local/private databases, input sanitization
- 🎯 **TypeScript First** - Fully typed for better developer experience

## Installation

```bash
npm install pharma-genie-chatbot
```

## Requirements

- Angular: ^17.3.0
- TypeScript: ~5.4.0
- Node.js: 20.x or higher

## Quick Start

### 1. Import the Component

```typescript
import { Component } from '@angular/core';
import { ChatbotComponent } from 'pharma-genie-chatbot';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatbotComponent, HttpClientModule],
  template: `
    <h1>My Pharma App</h1>
    
    <!-- GenAI Mode (Conversational AI) -->
    <pharma-genie-chatbot 
      [config]="genaiConfig" 
      [mode]="'genai'">
    </pharma-genie-chatbot>
    
    <!-- NLP Mode (Fast Traditional) -->
    <pharma-genie-chatbot 
      [config]="nlpConfig" 
      [mode]="'nlp'">
    </pharma-genie-chatbot>
  `
})
export class AppComponent {
  genaiConfig = {
    apiUrl: 'http://localhost:3000',
    theme: 'light',
    position: 'bottom-left',
    enableExport: true
  };
  
  nlpConfig = {
    apiUrl: 'http://localhost:3000',
    theme: 'light',
    position: 'bottom-right',
    enableExport: true
  };
}
```

### 2. Start the Backend Server

```bash
cd pharma-genie-backend
npm install

# Configure .env file with MongoDB and HCL AI Cafe credentials
npm run seed  # Seed the database
npm start     # Start server on port 3000
```

The backend server will run on `http://localhost:3000` with both NLP and GenAI endpoints.

## Configuration Options

```typescript
interface PharmaGenieConfig {
  apiUrl: string;                    // Backend API URL
  mode?: 'nlp' | 'genai';            // Chat mode (default: 'nlp')
  theme?: 'light' | 'dark';          // UI theme
  position?: 'bottom-right' |        // Chat position
             'bottom-left' | 
             'top-right' | 
             'top-left';
  enableExport?: boolean;            // Enable CSV/Excel export
  placeholder?: string;              // Input placeholder text
  welcomeMessage?: string;           // Initial greeting message
  sessionId?: string;                // GenAI session ID (for persistence)
  maxHistoryLength?: number;         // Max conversation history (default: 10)
}
```

## Chat Modes

### NLP Mode (Fast & Structured)
- **Endpoint:** `/api/chat`
- **Best For:** Quick queries, structured data retrieval, filtering
- **Response Time:** ~200-500ms
- **Features:**
  - Fast pattern matching
  - Entity extraction (phases, drugs, statuses)
  - Keyword-based filtering
  - Consistent structured responses

**Example Queries:**
```
"Show all Phase III trials"
"Find diabetes studies"
"How many recruiting trials?"
"Export to Excel"
```

### GenAI Mode (Conversational & Intelligent)
- **Endpoint:** `/api/genai/chat`
- **Best For:** Complex questions, analysis, comparisons, explanations
- **Response Time:** ~1-3 seconds
- **Features:**
  - Conversational AI (HCL AI Cafe / GPT-4.1)
  - Context-aware responses
  - Multi-turn conversations
  - Session persistence
  - Database-grounded answers

**Example Queries:**
```
"What are the most promising diabetes treatments?"
"Compare adverse events across Phase III oncology trials"
"Explain the difference between these drug mechanisms"
"Which sites have the best enrollment rates?"
```

## Usage Examples

### Basic Usage (NLP Mode)

```typescript
<pharma-genie-chatbot 
  [config]="{ apiUrl: 'http://localhost:3000', mode: 'nlp' }">
</pharma-genie-chatbot>
```

### GenAI Mode with Session

```typescript
<pharma-genie-chatbot [config]="{
  apiUrl: 'http://localhost:3000',
  mode: 'genai',
  sessionId: 'user-123-session',
  theme: 'dark',
  position: 'bottom-left',
  welcomeMessage: 'Hello! Ask me about clinical trials.'
}"></pharma-genie-chatbot>
```

### Custom Configuration

```typescript
<pharma-genie-chatbot [config]="{
  apiUrl: 'https://api.yourcompany.com',
  mode: 'genai',
  theme: 'dark',
  position: 'bottom-left',
  maxHistoryLength: 20,
  welcomeMessage: 'Welcome to Clinical Trials Hub!'
}"></pharma-genie-chatbot>
```

### Programmatic Control

```typescript
import { PharmaGenieService } from 'pharma-genie-chatbot';

export class MyComponent {
  constructor(private chatService: PharmaGenieService) {}

  sendQuery() {
    this.chatService.sendMessage('Show all active Phase III trials');
  }

  clearHistory() {
    this.chatService.clearMessages();
  }

  exportData() {
    this.chatService.exportData(data, 'excel').subscribe(blob => {
      // Handle downloaded file
    });
  }
}
```

## Query Examples

The chatbot understands natural language queries:

- "Show all active clinical trials"
- "Find Phase III diabetes trials"
- "List trials for drug ABC123"
- "How many completed trials are there?"
- "Show recruiting Alzheimer's studies"
- "Export active trials to Excel"

## Backend Setup

### Local Development

1. Navigate to backend directory:
```bash
cd pharma-genie-backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment (.env):
```env
# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pharmaGenie
MONGODB_DB_NAME=pharmaGenie

# GenAI (for GenAI mode)
GENAI_PROVIDER=hcl-aicafe
HCL_AICAFE_ENDPOINT=https://aicafe.hcl.com/...
HCL_DEPLOYMENT_NAME=gpt-4.1
GENAI_API_KEY=your-api-key

# Server
PORT=3000
```

4. Seed database:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

### Production Setup

For production, ensure MongoDB Atlas and HCL AI Cafe are properly configured:

```javascript
// MongoDB with connection pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000
});

// GenAI with rate limiting
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

## NLP Integration

The chatbot uses two powerful NLP libraries for query analysis:

### 1. Natural.js (8.x)
- **Tokenization** - Break queries into meaningful tokens
- **TF-IDF** - Keyword extraction and relevance scoring
- **Stemming** - Normalize words to root forms
- **Text Classification** - Intent detection

### 2. Compromise (14.x)
- **Named Entity Recognition** - Extract trial IDs, drugs, phases
- **Date/Number Extraction** - Parse temporal and numeric data
- **Part-of-Speech Tagging** - Grammatical analysis
- **Entity Normalization** - Standardize extracted entities

### NLP Processing Flow

```
User Query: "Show me active Phase III diabetes trials"
     ↓
┌────────────────────────────────────────────┐
│  1. Intent Detection                       │
│     → "list" (show/find/list)             │
└────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────┐
│  2. Entity Extraction                      │
│     → status: "active"                     │
│     → phase: "Phase III"                   │
│     → indication: "diabetes"               │
└────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────┐
│  3. Keyword Analysis                       │
│     → ["diabetes", "trials", "phase"]     │
└────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────┐
│  4. MongoDB Query Builder                  │
│     { status: "Recruiting",                │
│       phase: "Phase III",                  │
│       indication: /diabetes/i }            │
└────────────────────────────────────────────┘
     ↓
┌────────────────────────────────────────────┐
│  5. Database Query with Population         │
│     .populate('sites participants drugs')  │
└────────────────────────────────────────────┘
     ↓
  Formatted Response
```

### Supported Intents

- **list** - Show/find/list trials
- **count** - Count/total/how many
- **status** - Filter by trial status
- **filter** - Complex multi-field filtering
- **export** - Export to CSV/Excel
- **specific** - Get specific trial by ID

### Entity Types

- **Trial IDs** - CT-YYYY-NNN pattern
- **Phases** - Phase I, II, III, IV
- **Status** - Active, Recruiting, Completed, Suspended
- **Drugs** - Drug IDs (ABC123, XYZ789)
- **Indications** - Disease names (Diabetes, Cancer, Alzheimer's)
- **Numbers** - Counts, thresholds

## Security Best Practices

### 1. API Security

```typescript
// Add authentication headers
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${getToken()}`
    }
  });
  return next(authReq);
};
```

### 2. Input Validation

The backend validates all inputs to prevent injection attacks.

### 3. CORS Configuration

```javascript
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}));
```

### 4. Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

## Private Network Setup

### For Local/Private Databases

1. **VPN Configuration** - Ensure backend server is accessible via VPN
2. **Firewall Rules** - Allow traffic on port 3000
3. **SSL Certificates** - Use self-signed certs for HTTPS
4. **Environment Variables** - Store sensitive configs

```bash
# .env file
DB_HOST=192.168.1.100
DB_PORT=27017
DB_NAME=clinical_trials
API_PORT=3000
NODE_ENV=production
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| POST | /api/chat | Process chat query |
| GET | /api/trials | Get all trials |
| GET | /api/trials/:id | Get specific trial |
| POST | /api/export/csv | Export to CSV |
| POST | /api/export/excel | Export to Excel |

## Troubleshooting

### Common Issues

**1. CORS Errors**
```javascript
// Update server.js
app.use(cors({
  origin: 'http://localhost:4200'
}));
```

**2. Module Not Found**
```bash
npm install --legacy-peer-deps
```

**3. TypeScript Errors**
```json
// tsconfig.json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## Accessibility

- Keyboard navigation (Tab, Enter, Escape)
- Screen reader support with ARIA labels
- High contrast mode compatible
- Focus indicators
- Reduced motion support

## License

MIT

## Support

For issues and questions:
- GitHub Issues: [Create an issue](#)
- Email: support@pharmagenie.com
- Documentation: [Full Docs](#)

## Contributing

Contributions are welcome! Please read our contributing guidelines.

## Changelog

### v1.0.0
- Initial release
- NLP-powered query understanding
- Multi-format export (CSV, Excel)
- Pharma-themed responsive UI
- Accessibility features
