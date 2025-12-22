# PharmaGenie Backend - Enterprise AI Platform

## 🚀 Overview

PharmaGenie Backend is an enterprise-grade AI-powered clinical trials platform built with Node.js, Express, MongoDB Atlas, and dual AI capabilities (NLP + GenAI). It provides intelligent querying with HCL AI Cafe integration, session management, and comprehensive middleware stack.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [MongoDB Collections](#mongodb-collections)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [GenAI Integration](#genai-integration)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)

## ✨ Features

### Dual AI Capabilities
- 🧠 **NLP Engine** - Fast traditional queries using Natural.js and Compromise
- 🤖 **GenAI Integration** - Advanced conversational AI with HCL AI Cafe (GPT-4.1)
- 🔄 **Unified Response Format** - Consistent API responses across modes

### Enterprise Architecture
- 💾 **MongoDB Atlas** - Cloud-based NoSQL with 5 collections
- 💬 **Session Management** - Persistent chat history with metadata
- 🛡️ **Middleware Stack** - Rate limiting, logging, validation, sanitization
- 📊 **Advanced Export** - Multi-sheet Excel and CSV with smart detection
- 🔗 **Relational Data** - Mongoose ODM with automatic population

### Advanced Features
- 🔍 **Full-Text Search** - Indexed search across clinical trials
- 📈 **Request Tracking** - Unique request IDs for debugging
- ⚡ **Provider Factory** - Pluggable AI provider architecture
- 🔒 **Input Sanitization** - XSS and injection protection
- 📝 **Comprehensive Logging** - Request/Response/Error logging

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Clients                      │
│    (GenAI Chat Component + NLP Chat Component)          │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                  Express Server                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Middleware Stack                    │   │
│  │  • Request Logger    • Rate Limiter             │   │
│  │  • Validator         • Sanitizer                │   │
│  │  • Error Handler     • CORS                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────┐        ┌──────────────────────┐      │
│  │  NLP Routes  │        │    GenAI Routes      │      │
│  │  /api/chat   │        │  /api/genai/chat     │      │
│  │  /api/trials │        │  /api/genai/sessions │      │
│  │  /api/export │        │                       │      │
│  └──────┬───────┘        └───────────┬──────────┘      │
│         │                            │                   │
│         ▼                            ▼                   │
│  ┌──────────────┐        ┌──────────────────────┐      │
│  │ NLP Service  │        │  Provider Factory    │      │
│  │ • Natural.js │        │  • HCL AI Cafe       │      │
│  │ • Compromise │        │  • Mock Provider     │      │
│  └──────┬───────┘        └───────────┬──────────┘      │
│         │                            │                   │
│         └────────────┬───────────────┘                  │
│                      ▼                                    │
│         ┌────────────────────────┐                       │
│         │    MongoDB Atlas       │                       │
│         │  • Clinical Trials     │                       │
│         │  • Drugs               │                       │
│         │  • Trial Sites         │                       │
│         │  • Participants        │                       │
│         │  • Adverse Events      │                       │
│         │  • Chat Sessions       │                       │
│         └────────────────────────┘                       │
└──────────────────────────────────────────────────────────┘
```

## 🛠️ Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Express.js 5.x
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose 9.x
- **NLP Libraries:** 
  - `natural` (8.x) - Tokenization, stemming, TF-IDF
  - `compromise` (14.x) - Text parsing, entity extraction
- **AI Integration:**
  - HCL AI Cafe (GPT-4.1)
  - Provider Factory Pattern
- **Export:**
  - `exceljs` (4.x) - Multi-sheet Excel generation
  - `csv-writer` (1.x) - CSV export
- **Middleware:**
  - `express-rate-limit` - API rate limiting
  - Custom validation, logging, sanitization
- **Configuration:**
  - `dotenv` - Environment variables
- **Development:**
  - TypeScript 5.9.x (type checking)
  - ESM modules

## 📦 MongoDB Collections

### 1. **Clinical Trials** (`clinical_trials`)
Primary collection for trial information
```javascript
{
  trialId: 'CT-2024-001',
  title: 'Phase III Study of ABC123...',
  drug: 'ABC123',
  phase: 'Phase III',
  status: 'Recruiting',
  indication: 'Type 2 Diabetes',
  sponsor: 'PharmaCorp International',
  enrollmentTarget: 500,
  currentEnrollment: 327,
  sites: [ObjectId],          // References to trial_sites
  participants: [ObjectId],   // References to participants
  adverseEvents: [ObjectId],  // References to adverse_events
  startDate: Date,
  estimatedCompletionDate: Date
}
```

### 2. **Drugs** (`drugs`)
Drug information and properties
```javascript
{
  drugId: 'ABC123',
  name: 'Glucomaxin',
  class: 'DPP-4 Inhibitor',
  mechanismOfAction: '...',
  indications: ['Type 2 Diabetes', 'Obesity'],
  sideEffects: ['Nausea', 'Headache'],
  approvalStatus: {
    fda: 'Approved',
    ema: 'Under Review'
  },
  clinicalTrials: [ObjectId]  // References to clinical_trials
}
```

### 3. **Trial Sites** (`trial_sites`)
Research facilities conducting trials
```javascript
{
  siteId: 'SITE-001',
  name: 'Medical Research Institute',
  type: 'Research Center',
  address: {
    street: '123 Medical Plaza',
    city: 'Boston',
    state: 'MA',
    country: 'USA',
    zipCode: '02115'
  },
  capabilities: {
    phases: ['Phase II', 'Phase III'],
    specializations: ['Oncology', 'Diabetes']
  },
  activeClinicalTrials: [ObjectId]
}
```

### 4. **Participants** (`participants`)
Trial participant information
```javascript
{
  participantId: 'P-2024-0001',
  trial: ObjectId,            // Reference to clinical_trial
  site: ObjectId,             // Reference to trial_site
  demographics: {
    age: 58,
    gender: 'Male',
    ethnicity: 'Hispanic'
  },
  enrollmentInfo: {
    enrollmentDate: Date,
    status: 'Active',
    arm: 'Treatment'
  },
  medicalHistory: {
    conditions: ['Type 2 Diabetes', 'Hypertension'],
    medications: ['Metformin', 'Lisinopril']
  },
  compliance: {
    rate: 96,
    lastVisit: Date
  }
}
```

### 5. **Adverse Events** (`adverse_events`)
Safety monitoring and event tracking
```javascript
{
  eventId: 'AE-2024-00001',
  trial: ObjectId,            // Reference to clinical_trial
  participant: ObjectId,      // Reference to participant
  eventDetails: {
    description: 'Mild nausea',
    severity: 'Mild',
    seriousness: 'Non-Serious',
    outcome: 'Recovered'
  },
  timing: {
    onsetDate: Date,
    resolutionDate: Date,
    studyDay: 14
  },
  causality: {
    investigatorAssessment: 'Possibly Related',
    reportedToSponsor: true
  },
  reporting: {
    reportedDate: Date,
    reporter: 'Site Investigator'
  }
}
```

### 6. **Chat Sessions** (`chat_sessions`)
GenAI conversation history
```javascript
{
  sessionId: 'unique-session-id',
  userId: 'user-123',
  messages: [
    {
      role: 'user',
      content: 'Show me diabetes trials',
      timestamp: Date
    },
    {
      role: 'assistant',
      content: '...',
      timestamp: Date,
      tokens: 150
    }
  ],
  metadata: {
    provider: 'hcl-aicafe',
    model: 'gpt-4.1',
    totalTokens: 1500,
    totalCost: 0.05
  },
  createdAt: Date,
  lastActivity: Date
}
```

## 📋 Prerequisites

- Node.js >= 20.x
- npm or yarn
- MongoDB Atlas account
- Git

## 📥 Installation

1. **Clone the repository**
```bash
cd c:\Users\ashishmahadeo.nagha\Projects\pharmaGenie\pharma-genie-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Verify installation**
```bash
npm list
```

## ⚙️ Configuration

### 1. **Set up MongoDB Atlas**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (or use existing)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string

### 2. **HCL AI Cafe Setup**

1. Register at [HCL AI Cafe](https://aicafe.hcl.com/)
2. Get your API key and endpoint
3. Note the deployment name (e.g., gpt-4.1)

### 3. **Configure Environment Variables**

Create `.env` file in `pharma-genie-backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/pharmaGenie?retryWrites=true&w=majority
MONGODB_DB_NAME=pharmaGenie

# Server Configuration
PORT=3000
NODE_ENV=development

# GenAI Provider Configuration
GENAI_PROVIDER=hcl-aicafe        # Options: hcl-aicafe, mock
GENAI_API_KEY=your-api-key-here

# HCL AI Cafe Configuration
HCL_AICAFE_ENDPOINT=https://aicafe.hcl.com/AICafeService/api/v1/subscription/openai
HCL_DEPLOYMENT_NAME=gpt-4.1
HCL_API_VERSION=2024-12-01-preview

# AI Parameters
GENAI_TEMPERATURE=0.7
GENAI_MAX_TOKENS=2000
GENAI_TOP_P=0.95

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000      # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Replace placeholders with your actual credentials.

### 4. **Connection String Format**

```
mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

### 5. **Provider Options**

- **hcl-aicafe** - Production GenAI with HCL AI Cafe (requires API key)
- **mock** - Testing provider (no API calls, returns mock responses)

## 🗄️ Database Setup

### Seed the Database

Populate MongoDB with sample data:

```bash
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...
✅ MongoDB Atlas connected successfully
🗑️  Clearing existing data...
💊 Seeding Drugs collection...
✅ Inserted 5 drugs
🏥 Seeding Trial Sites collection...
✅ Inserted 3 trial sites
🔬 Seeding Clinical Trials collection...
✅ Inserted 8 clinical trials
👥 Seeding Participants collection...
✅ Inserted 2 participants
⚠️  Seeding Adverse Events collection...
✅ Inserted 2 adverse events
🎉 Database seeding completed successfully!
```

### Verify Data

```bash
# Start the server
npm start

# Check health endpoint
curl http://localhost:3000/api/health
```

## 🌐 API Endpoints

### Health & Status
```http
GET /api/health
```
**Response:**
```json
{
  "status": "healthy",
  "service": "PharmaGenie Backend",
  "version": "2.0.0",
  "database": "MongoDB Atlas",
  "collections": {
    "trials": 8,
    "drugs": 5,
    "sites": 3
  }
}
```

### NLP Chat
```http
POST /api/chat
Content-Type: application/json

{
  "query": "Show me all active phase 3 trials for diabetes"
}
```
**Response:**
```json
{
  "type": "list",
  "content": "Found 2 clinical trials:",
  "trials": [...],
  "drugs": [...],
  "sites": [...],
  "canExport": true
}
```

### GenAI Chat
```http
POST /api/genai/chat
Content-Type: application/json

{
  "message": "What are the most promising diabetes treatments?",
  "sessionId": "optional-session-id",
  "conversationHistory": []
}
```
**Response:**
```json
{
  "reply": "Based on the database...",
  "model": "gpt-4.1",
  "provider": "hcl-aicafe",
  "tokens": { "prompt": 150, "completion": 200 },
  "latencyMs": 1250,
  "trials": [...],
  "drugs": [...],
  "metadata": {...}
}
```

### Session Management
```http
POST /api/genai/sessions          # Create session
GET /api/genai/sessions/:id       # Get session
GET /api/genai/sessions/:id/messages  # Get messages
DELETE /api/genai/sessions/:id    # Delete session
GET /api/genai/sessions           # List all sessions
```

### Data Retrieval
```http
GET /api/trials                   # All trials (populated)
GET /api/trials/:id               # Specific trial with related data
GET /api/drugs                    # All drugs
GET /api/drugs/:id                # Specific drug
GET /api/sites                    # All trial sites
GET /api/participants             # All participants
GET /api/adverse-events           # All adverse events
```

### Export
```http
POST /api/export/csv
Content-Type: application/json

{
  "responseData": {
    "trials": [...],
    "drugs": [...]
  }
}
```
- Single collection → CSV file
- Multiple records → CSV export

```http
POST /api/export/excel
Content-Type: application/json

{
  "responseData": {
    "trials": [...],
    "drugs": [...],
    "sites": [...]
  }
}
```
- Single collection → Excel (one sheet)
- Multiple collections → Excel (multiple sheets)

## 🤖 GenAI Integration

### Provider Factory Architecture

The backend uses a pluggable provider system for GenAI integration:

```javascript
// providers/provider-factory.js
ProviderFactory.getProvider()  // Returns configured provider
```

**Supported Providers:**
1. **HCL AI Cafe** (Production)
   - GPT-4.1 model
   - Azure OpenAI API compatible
   - Enterprise-grade reliability

2. **Mock Provider** (Testing)
   - No API calls
   - Returns mock responses
   - Useful for development

### HCL AI Cafe Integration

```javascript
// Configured via .env
GENAI_PROVIDER=hcl-aicafe
HCL_AICAFE_ENDPOINT=https://aicafe.hcl.com/...
HCL_DEPLOYMENT_NAME=gpt-4.1
GENAI_API_KEY=your-api-key
```

**Features:**
- Conversation history support
- Database context injection
- Token usage tracking
- Cost calculation
- Latency monitoring

### Request Flow

1. **User Query** → GenAI endpoint
2. **NLP Analysis** → Extract entities and intent
3. **Database Query** → Fetch relevant data
4. **Context Building** → Inject DB results into prompt
5. **Provider Call** → HCL AI Cafe / Mock
6. **Response Formatting** → Unified format
7. **Session Storage** → Save to MongoDB

### Provider Interface

```javascript
interface GenAIProvider {
  generate(request: {
    sessionId: string,
    message: string,
    conversationHistory: Message[],
    context: {
      database: {
        counts: {...},
        results: {...},
        analysis: {...}
      }
    }
  }): Promise<{
    reply: string,
    model: string,
    tokens: {...},
    latencyMs: number
  }>
}
```

## 💡 Usage Examples

### Query Examples

1. **List trials by status:**
```
"Show me all active trials"
"List completed studies"
"Find recruiting trials"
```

2. **Search by phase:**
```
"Phase 2 trials"
"Show phase III studies"
```

3. **Search by indication:**
```
"Diabetes trials"
"Cancer research"
"COVID-19 studies"
```

4. **Search by drug:**
```
"Trials for ABC123"
"Studies using XYZ789"
```

5. **Count queries:**
```
"How many trials are recruiting?"
"Total number of phase 3 trials"
```

6. **Specific trial:**
```
"Show me CT-2024-001"
"Details for trial CT-2024-003"
```

## 📁 Project Structure

```
pharma-genie-backend/
├── config/
│   └── database.js              # MongoDB connection config
│
├── models/                      # Mongoose schemas
│   ├── ClinicalTrial.js         # Trial schema with populations
│   ├── Drug.js                  # Drug schema
│   ├── TrialSite.js             # Site schema
│   ├── Participant.js           # Participant schema
│   ├── AdverseEvent.js          # Adverse event schema
│   ├── ChatSession.js           # GenAI session schema
│   └── index.js                 # Model exports
│
├── providers/                   # GenAI provider system
│   ├── genai-provider.interface.js  # Provider interface
│   ├── hcl-aicafe-provider.js       # HCL AI Cafe integration
│   ├── mock-provider.js             # Mock provider for testing
│   └── provider-factory.js          # Provider factory pattern
│
├── routes/
│   └── genai.routes.js          # GenAI chat & session routes
│
├── middleware/                  # Express middleware
│   ├── logger.middleware.js     # Request/Error logging
│   ├── rate-limiter.middleware.js  # API rate limiting
│   └── validation.middleware.js    # Input validation
│
├── utils/
│   ├── export-utils.js          # CSV/Excel multi-sheet export
│   ├── request-id.js            # Unique request ID generator
│   └── sanitizer.js             # Input sanitization (XSS protection)
│
├── data/
│   └── clinical-trials.json     # Sample data for seeding
│
├── exports/                     # Generated export files (gitignored)
│
├── nlp-service.js               # NLP engine (Natural.js + Compromise)
├── server.js                    # Express server & NLP routes
├── seed.js                      # Database seeding script
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config (type checking)
└── README.md                    # This file
```

## 🛡️ Middleware Stack

### 1. **Request Logger** (`logger.middleware.js`)
- Logs all incoming requests
- Unique request IDs
- Response time tracking
- Error logging with stack traces

### 2. **Rate Limiter** (`rate-limiter.middleware.js`)
- Prevents API abuse
- Configurable limits (100 requests / 15 min default)
- Per-IP tracking
- Graceful error responses

### 3. **Input Validator** (`validation.middleware.js`)
- Validates GenAI requests
- Ensures required fields
- Type checking
- Session ID validation

### 4. **Sanitizer** (`sanitizer.js`)
- XSS protection
- HTML entity encoding
- SQL injection prevention
- Path traversal protection

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

## 🔍 Query Processing Flow

1. **User Query** → `POST /api/chat`
2. **NLP Analysis** → Intent + Entity + Keyword extraction
3. **MongoDB Query** → Build query from analysis
4. **Population** → Load related data (sites, participants)
5. **Format Response** → Structure for frontend
6. **Return JSON** → Send to client

## 🎯 NLP Capabilities

### Intent Detection
- `list` - Show trials
- `count` - Count results
- `status` - Filter by status
- `filter` - Complex filtering
- `export` - Export data
- `specific` - Specific trial lookup

### Entity Extraction
- Trial IDs (CT-YYYY-NNN)
- Phases (I, II, III, IV)
- Status (Active, Recruiting, Completed)
- Drugs (ABC123, XYZ789)
- Indications (Diabetes, Cancer, etc.)

### Keyword Processing
- Stopword removal
- Tokenization
- Relevance filtering

## 🔗 MongoDB Indexes

Optimized queries with indexes on:
- `trialId` (unique)
- `status`, `phase`, `drug` (filtered searches)
- `indication` (disease searches)
- Text indexes on `title`, `description` (full-text search)

## 📊 Sample Data

The seed script includes:
- **8 Clinical Trials** across different phases and indications
- **5 Drugs** with comprehensive details
- **3 Trial Sites** with location and capabilities
- **2 Participants** with medical history
- **2 Adverse Events** with reporting details

## 🛡️ Error Handling

- MongoDB connection errors
- Query validation
- Data not found (404)
- Server errors (500)
- Invalid input (400)

## 🔐 Security Best Practices

1. **Never commit `.env` file**
2. **Use environment variables** for sensitive data
3. **Whitelist IP addresses** in MongoDB Atlas
4. **Use strong passwords** for database users
5. **Enable authentication** in production

## 📝 License

ISC

## 👨‍💻 Author

PharmaGenie Development Team

## 🤝 Contributing

For contributions, please create a pull request or open an issue.

---

**Built with ❤️ using Node.js, Express, MongoDB, and NLP**
