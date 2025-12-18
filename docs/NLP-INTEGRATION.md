# NLP Integration in PharmaGenie

## Overview
This document explains how Natural Language Processing (NLP) is implemented in PharmaGenie and how to integrate it with OpenAI API for enhanced capabilities.

---

## Current NLP Implementation

### NPM Packages Used

PharmaGenie uses the following NPM packages for NLP functionality:

#### 1. **natural** (v6.10.0+)
- **Purpose**: Core NLP library for Node.js
- **Features Used**:
  - `WordTokenizer`: Tokenizes user queries into individual words
  - `TfIdf`: Term Frequency-Inverse Document Frequency for keyword extraction
  - Provides stemming, classification, and phonetics capabilities

#### 2. **compromise** (v14.0.0+)
- **Purpose**: Lightweight NLP library for natural language understanding
- **Features Used**:
  - Entity extraction (places, numbers, dates)
  - Part-of-speech tagging
  - Pattern matching for complex queries
  - Semantic understanding of text

### Installation
```bash
cd pharma-genie-backend
npm install natural compromise
```

---

## How NLP is Used in PharmaGenie

### File: `pharma-genie-backend/nlp-service.js`

The NLP service is implemented as a class with the following components:

### 1. **Intent Detection**
Identifies what the user wants to do with their query.

```javascript
intentPatterns: {
  list: /\b(show|list|display|get|find|all|view)\b/i,
  count: /\b(how many|count|number of|total)\b/i,
  status: /\b(status|state|condition)\b/i,
  filter: /\b(with|having|where|that|filter)\b/i,
  export: /\b(export|download|save|extract)\b/i,
  specific: /\b(CT-\d{4}-\d{3}|trial|study)\b/i,
}
```

**Supported Intents**:
- `list`: Display trials
- `count`: Count trials
- `status`: Check trial status
- `filter`: Filter trials by criteria
- `export`: Export data in different formats
- `specific`: Get specific trial details

### 2. **Entity Extraction**
Extracts key information from user queries.

```javascript
entityPatterns: {
  trialId: /CT-\d{4}-\d{3}/gi,           // Trial IDs like CT-2024-001
  phase: /\b(phase\s+(I{1,3}|1|2|3))\b/gi, // Phase I, II, III
  status: /\b(active|completed|recruiting|suspended|terminated)\b/gi,
  drug: /\b([A-Z]{3}\d{3}|[A-Z]{3}\d{4})\b/g,  // Drug codes like ABC123
  indication: /\b(hypertension|diabetes|cancer|alzheimer|arthritis|depression|covid)\b/gi,
  date: /\b(\d{4}|\d{4}-\d{2}-\d{2})\b/g,
}
```

**Extracted Entities**:
- Trial IDs
- Clinical phases
- Trial statuses
- Drug codes
- Medical indications
- Dates
- Geographic locations (via Compromise)
- Numbers and quantities

### 3. **Keyword Extraction**
Filters meaningful words from queries.

```javascript
extractKeywords(tokens) {
  const stopwords = ['the', 'a', 'an', 'and', 'or', 'but', ...];
  return tokens.filter(token => 
    !stopwords.includes(token) && 
    token.length > 2 &&
    !/^\d+$/.test(token)
  );
}
```

### 4. **Filter Building**
Converts extracted entities into database filters.

```javascript
buildFilters(query, doc) {
  const filters = {};
  
  // Status filters
  if (query.match(/\bactive\b/i)) filters.status = 'Active';
  
  // Phase filters
  const phaseMatch = query.match(/phase\s+(I{1,3}|1|2|3)/i);
  if (phaseMatch) filters.phase = `Phase ${phaseNum}`;
  
  // Drug filters
  const drugMatch = query.match(/\b([A-Z]{3}\d{3,4})\b/);
  if (drugMatch) filters.drug = drugMatch[1];
  
  return filters;
}
```

### 5. **Export Format Detection**
Determines the desired output format.

```javascript
detectExportFormat(query) {
  if (/\b(csv|comma.*separated)\b/i.test(query)) return 'csv';
  if (/\b(excel|xlsx|xls|spreadsheet)\b/i.test(query)) return 'excel';
  if (/\b(table|tabular)\b/i.test(query)) return 'table';
  return 'text';
}
```

### 6. **Trial Matching**
Matches trials based on NLP analysis.

```javascript
matchTrials(trials, analysis) {
  let results = [...trials];
  
  // Apply filters sequentially
  if (analysis.filters.id) results = results.filter(t => t.id === analysis.filters.id);
  if (analysis.filters.status) results = results.filter(t => t.status === analysis.filters.status);
  if (analysis.filters.phase) results = results.filter(t => t.phase === analysis.filters.phase);
  
  // Keyword-based search
  if (analysis.keywords.length > 0) {
    results = results.filter(trial => {
      const searchText = JSON.stringify(trial).toLowerCase();
      return keywords.some(keyword => searchText.includes(keyword));
    });
  }
  
  return results;
}
```

---

## Query Processing Flow

```
User Query
    ↓
[Tokenization] → Break into words using natural.WordTokenizer
    ↓
[Intent Detection] → Identify user intent (list, count, export, etc.)
    ↓
[Entity Extraction] → Extract trial IDs, phases, statuses, drugs, etc.
    ↓
[Keyword Extraction] → Filter meaningful keywords
    ↓
[Filter Building] → Convert entities to database filters
    ↓
[Format Detection] → Determine output format (text, table, CSV, Excel)
    ↓
[Trial Matching] → Apply filters to trial database
    ↓
[Response Generation] → Format results based on detected format
    ↓
Response to User
```

---

## Example Queries and NLP Analysis

### Example 1: Simple List Query
**Query**: "Show me all active trials"

**NLP Analysis**:
```json
{
  "intent": "list",
  "entities": {
    "status": ["active"]
  },
  "keywords": ["trials"],
  "filters": {
    "status": "Active"
  },
  "exportFormat": "text"
}
```

### Example 2: Specific Trial Query
**Query**: "Get details of trial CT-2024-001"

**NLP Analysis**:
```json
{
  "intent": "specific",
  "entities": {
    "trialId": ["CT-2024-001"]
  },
  "keywords": ["details", "trial"],
  "filters": {
    "id": "CT-2024-001"
  },
  "exportFormat": "text"
}
```

### Example 3: Complex Filter Query
**Query**: "Show active Phase II trials for diabetes in table format"

**NLP Analysis**:
```json
{
  "intent": "list",
  "entities": {
    "status": ["active"],
    "phase": ["Phase II"],
    "indication": ["diabetes"]
  },
  "keywords": ["trials", "diabetes"],
  "filters": {
    "status": "Active",
    "phase": "Phase II"
  },
  "exportFormat": "table"
}
```

### Example 4: Export Query
**Query**: "Export all completed trials to Excel"

**NLP Analysis**:
```json
{
  "intent": "export",
  "entities": {
    "status": ["completed"]
  },
  "keywords": ["trials"],
  "filters": {
    "status": "Completed"
  },
  "exportFormat": "excel"
}
```

---

## Private Network & Local Database Integration

### How NLP Works with Local Data

1. **Data Loading**: Trials are loaded from local JSON file or MongoDB
2. **In-Memory Processing**: NLP analysis happens in-memory (no external API calls)
3. **Pattern Matching**: Uses regex patterns to match against local data
4. **Offline Capability**: Fully functional without internet connection

### Advantages for Private Networks

- **Data Privacy**: No data leaves your network
- **Low Latency**: No external API calls
- **No API Costs**: Free to use
- **Compliance**: Suitable for HIPAA/GDPR requirements
- **Customizable**: Add custom patterns for your specific data

### Limitations

- **Fixed Patterns**: Requires predefined regex patterns
- **No Learning**: Cannot learn from user interactions
- **Limited Understanding**: May not handle complex or ambiguous queries
- **Manual Updates**: Patterns must be manually updated

---

## OpenAI API Integration (GPT-based)

### Why Integrate OpenAI?

OpenAI's GPT models can significantly enhance NLP capabilities:

1. **Better Understanding**: Handle complex, ambiguous queries
2. **Context Awareness**: Understand conversation context
3. **Natural Responses**: Generate human-like responses
4. **Learning**: Adapt to user patterns over time
5. **Multi-language**: Support multiple languages

### Installation

```bash
cd pharma-genie-backend
npm install openai
```

### Implementation Steps

#### Step 1: Create OpenAI Service

Create `pharma-genie-backend/openai-service.js`:

```javascript
import OpenAI from 'openai';

class OpenAIService {
  constructor(apiKey) {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY
    });
    
    this.systemPrompt = `You are PharmaGenie, an AI assistant specialized in clinical trials data.
Your role is to help users query and understand clinical trial information.

Available trial fields:
- id: Trial identifier (e.g., CT-2024-001)
- title: Trial name
- phase: Clinical phase (Phase I, II, III)
- status: Trial status (Active, Completed, Recruiting, Suspended)
- indication: Medical condition being studied
- drug: Investigational drug code
- sponsor: Trial sponsor organization
- startDate: Trial start date
- endDate: Trial end date (if completed)
- enrollmentTarget: Target number of participants
- sites: Trial locations

Supported output formats:
- text: Plain text response
- table: Tabular format
- csv: CSV download
- excel: Excel spreadsheet download

Extract filters and return JSON with this structure:
{
  "intent": "list|count|specific|export",
  "filters": {
    "status": "Active|Completed|Recruiting|Suspended",
    "phase": "Phase I|Phase II|Phase III",
    "indication": "disease name",
    "drug": "drug code",
    "id": "trial id",
    "sponsor": "sponsor name",
    "site": "location"
  },
  "exportFormat": "text|table|csv|excel",
  "naturalResponse": "Human-friendly response about what will be shown"
}`;
  }

  async analyzeQuery(query, conversationHistory = []) {
    try {
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...conversationHistory,
        { role: 'user', content: query }
      ];

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for faster/cheaper
        messages: messages,
        temperature: 0.3, // Lower temperature for more consistent responses
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion.choices[0].message.content);
      return analysis;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to analyze query with OpenAI');
    }
  }

  async generateResponse(trials, query, format = 'text') {
    try {
      const prompt = `Given the following clinical trials data:
${JSON.stringify(trials, null, 2)}

User query: "${query}"

Generate a helpful response in ${format} format. Be concise and relevant.`;

      const completion = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          { role: 'system', content: this.systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI Response Generation Error:', error);
      throw new Error('Failed to generate response with OpenAI');
    }
  }
}

export default OpenAIService;
```

#### Step 2: Update Server Configuration

Update `pharma-genie-backend/server.js`:

```javascript
import express from 'express';
import cors from 'cors';
import NLPService from './nlp-service.js';
import OpenAIService from './openai-service.js';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize services
const nlpService = new NLPService();
const openaiService = process.env.OPENAI_API_KEY 
  ? new OpenAIService(process.env.OPENAI_API_KEY)
  : null;

app.use(cors());
app.use(express.json());

// Load trial data
let trialsData = [];
try {
  const dataPath = path.join(process.cwd(), 'data', 'trials.json');
  trialsData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
} catch (error) {
  console.error('Error loading trials data:', error);
}

// Chat endpoint with OpenAI fallback
app.post('/api/chat', async (req, res) => {
  try {
    const { message, useOpenAI = false, conversationHistory = [] } = req.body;

    let analysis;
    let naturalResponse = '';

    // Use OpenAI if enabled and available
    if (useOpenAI && openaiService) {
      analysis = await openaiService.analyzeQuery(message, conversationHistory);
      naturalResponse = analysis.naturalResponse || '';
    } else {
      // Use local NLP
      analysis = nlpService.analyzeQuery(message);
    }

    // Match trials based on analysis
    const matchedTrials = nlpService.matchTrials(trialsData, analysis);

    // Generate response
    let response;
    if (useOpenAI && openaiService && matchedTrials.length > 0) {
      response = await openaiService.generateResponse(
        matchedTrials, 
        message, 
        analysis.exportFormat
      );
    } else {
      response = formatResponse(matchedTrials, analysis.exportFormat);
    }

    res.json({
      success: true,
      response: response,
      naturalResponse: naturalResponse,
      analysis: analysis,
      count: matchedTrials.length,
      trials: matchedTrials
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Helper function to format responses
function formatResponse(trials, format) {
  if (trials.length === 0) {
    return 'No trials found matching your criteria.';
  }

  switch (format) {
    case 'table':
      return generateTableResponse(trials);
    case 'csv':
      return generateCSV(trials);
    case 'excel':
      return { type: 'excel', data: trials };
    default:
      return generateTextResponse(trials);
  }
}

function generateTextResponse(trials) {
  return trials.map(t => 
    `${t.id}: ${t.title} (${t.phase}, ${t.status})`
  ).join('\n');
}

function generateTableResponse(trials) {
  // Return structured data for table rendering
  return {
    type: 'table',
    headers: ['ID', 'Title', 'Phase', 'Status', 'Indication'],
    rows: trials.map(t => [t.id, t.title, t.phase, t.status, t.indication])
  };
}

function generateCSV(trials) {
  const headers = Object.keys(trials[0]).join(',');
  const rows = trials.map(t => Object.values(t).join(',')).join('\n');
  return `${headers}\n${rows}`;
}

app.listen(PORT, () => {
  console.log(`PharmaGenie Backend running on port ${PORT}`);
  console.log(`OpenAI Integration: ${openaiService ? 'Enabled' : 'Disabled'}`);
});
```

#### Step 3: Environment Configuration

Create `.env` file in `pharma-genie-backend`:

```env
# Server Configuration
PORT=3000

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Optional: Choose GPT model
OPENAI_MODEL=gpt-4-turbo-preview
# or use gpt-3.5-turbo for faster/cheaper responses

# Database Configuration (for future MongoDB integration)
# MONGODB_URI=mongodb://localhost:27017/pharmagenie
```

#### Step 4: Update Frontend to Support OpenAI

Update `pharma-genie-chatbot/src/lib/pharma-genie-chatbot.component.ts`:

```typescript
export class PharmaGenieChatbotComponent {
  @Input() apiUrl = 'http://localhost:3000/api';
  @Input() useOpenAI = false; // Enable/disable OpenAI
  
  private conversationHistory: any[] = [];

  sendMessage(message: string) {
    this.messages.push({ text: message, sender: 'user', timestamp: new Date() });
    this.isLoading = true;

    this.http.post(`${this.apiUrl}/chat`, {
      message: message,
      useOpenAI: this.useOpenAI,
      conversationHistory: this.conversationHistory
    }).subscribe({
      next: (response: any) => {
        // Add to conversation history for context
        this.conversationHistory.push(
          { role: 'user', content: message },
          { role: 'assistant', content: response.naturalResponse || response.response }
        );

        // Keep only last 10 messages for context
        if (this.conversationHistory.length > 20) {
          this.conversationHistory = this.conversationHistory.slice(-20);
        }

        this.messages.push({
          text: response.naturalResponse || response.response,
          sender: 'bot',
          timestamp: new Date(),
          data: response.trials
        });
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Chat error:', error);
        this.isLoading = false;
      }
    });
  }
}
```

### Usage in Demo App

Update `pharma-genie-demo/src/app/app.component.html`:

```html
<!-- Use Local NLP (default) -->
<pharma-genie-chatbot 
  [apiUrl]="'http://localhost:3000/api'"
  [useOpenAI]="false">
</pharma-genie-chatbot>

<!-- Use OpenAI GPT -->
<pharma-genie-chatbot 
  [apiUrl]="'http://localhost:3000/api'"
  [useOpenAI]="true">
</pharma-genie-chatbot>
```

---

## Comparison: Local NLP vs OpenAI

| Feature | Local NLP (natural + compromise) | OpenAI GPT |
|---------|----------------------------------|------------|
| **Cost** | Free | Pay per API call (~$0.002-0.03 per request) |
| **Privacy** | 100% private, data never leaves network | Data sent to OpenAI servers |
| **Latency** | Very fast (<10ms) | Slower (200-2000ms depending on network) |
| **Accuracy** | Good for predefined patterns | Excellent for complex queries |
| **Learning** | No learning capability | Can learn from context |
| **Internet Required** | No | Yes |
| **Customization** | Fully customizable patterns | Limited to prompt engineering |
| **Compliance** | HIPAA/GDPR compliant | Requires BAA for HIPAA |
| **Complexity** | Handles simple to moderate queries | Handles complex, ambiguous queries |
| **Maintenance** | Manual pattern updates | Minimal maintenance |

---

## Hybrid Approach (Recommended)

Use both for optimal results:

```javascript
app.post('/api/chat', async (req, res) => {
  const { message, conversationHistory = [] } = req.body;

  // Try local NLP first
  const nlpAnalysis = nlpService.analyzeQuery(message);
  const trials = nlpService.matchTrials(trialsData, nlpAnalysis);

  let response;
  
  // Use OpenAI for:
  // 1. Complex queries (many keywords, ambiguous intent)
  // 2. Conversational context
  // 3. Natural language generation
  const isComplexQuery = nlpAnalysis.keywords.length > 5 || 
                         conversationHistory.length > 0;

  if (isComplexQuery && openaiService) {
    const gptAnalysis = await openaiService.analyzeQuery(message, conversationHistory);
    const gptTrials = nlpService.matchTrials(trialsData, gptAnalysis);
    response = await openaiService.generateResponse(gptTrials, message);
  } else {
    response = formatResponse(trials, nlpAnalysis.exportFormat);
  }

  res.json({ response, trials, analysis: nlpAnalysis });
});
```

---

## Security Best Practices

### For Local NLP

1. **Input Validation**: Sanitize user input to prevent injection attacks
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Data Encryption**: Encrypt sensitive trial data at rest
4. **Access Control**: Implement authentication for API access

### For OpenAI Integration

1. **API Key Security**: 
   - Store in environment variables, never in code
   - Use key rotation policies
   - Limit key permissions

2. **Data Privacy**:
   - Remove PII before sending to OpenAI
   - Use OpenAI's data retention policies
   - Consider Azure OpenAI for enterprise compliance

3. **Cost Control**:
   - Set API usage limits
   - Implement request caching
   - Use cheaper models (gpt-3.5-turbo) when possible

4. **Error Handling**:
   - Graceful fallback to local NLP
   - Retry logic with exponential backoff
   - Monitor API usage and errors

---

## Performance Optimization

### Local NLP Optimization

1. **Caching**: Cache common queries and responses
2. **Indexing**: Create indexes on frequently queried fields
3. **Lazy Loading**: Load trial data on demand
4. **Pattern Optimization**: Optimize regex patterns for speed

### OpenAI Optimization

1. **Request Batching**: Batch multiple queries when possible
2. **Response Streaming**: Use streaming for faster UX
3. **Model Selection**: Use gpt-3.5-turbo for simple queries
4. **Prompt Caching**: Cache system prompts
5. **Token Optimization**: Minimize token usage in prompts

---

## Future Enhancements

### Local NLP Improvements

1. Add machine learning classification
2. Implement spell correction
3. Add synonym handling
4. Support query autocomplete
5. Add voice input support

### OpenAI Enhancements

1. Fine-tune model on pharma data
2. Add function calling for database queries
3. Implement RAG (Retrieval Augmented Generation)
4. Add multi-modal support (images, charts)
5. Implement conversational memory

---

## Troubleshooting

### Common Issues

#### Local NLP Not Matching Queries

**Solution**: Check and update regex patterns in `entityPatterns` and `intentPatterns`

#### OpenAI API Errors

**Solutions**:
- Verify API key is correct
- Check API rate limits
- Ensure internet connectivity
- Verify account has credits

#### Slow Performance

**Solutions**:
- Use caching for common queries
- Switch to gpt-3.5-turbo model
- Implement request queuing
- Add response streaming

---

## References

- **natural NPM Package**: https://www.npmjs.com/package/natural
- **compromise NPM Package**: https://www.npmjs.com/package/compromise
- **OpenAI API Documentation**: https://platform.openai.com/docs/api-reference
- **OpenAI Node.js Library**: https://www.npmjs.com/package/openai
- **Best Practices for OpenAI**: https://platform.openai.com/docs/guides/production-best-practices

---

## Support

For questions or issues:
1. Check existing patterns in `nlp-service.js`
2. Review query examples in this documentation
3. Test with sample queries
4. Enable debug logging for detailed analysis

**Last Updated**: November 26, 2024
