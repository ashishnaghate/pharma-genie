# 🧬 PharmaGenie - Dual Chatbot Architecture (NLP + GenAI)

[![Angular](https://img.shields.io/badge/Angular-17.3.x-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)

An intelligent pharmaceutical clinical trials chatbot platform featuring **two distinct AI approaches**:
1. **NLP Chatbot** - Pattern matching & entity extraction (Natural/Compromise)
2. **GenAI Chatbot** - Large Language Model integration (Azure OpenAI/OpenAI/Anthropic)

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [GenAI Provider Setup](#genai-provider-setup)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Angular 17.3.x)                    │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  NLP Chatbot     │              │  GenAI Chatbot   │         │
│  │   /nlp           │              │   /genai         │         │
│  │  (Existing)      │              │   (NEW)          │         │
│  └────────┬─────────┘              └────────┬─────────┘         │
│           │                                 │                   │
└───────────┼─────────────────────────────────┼───────────────────┘
            │                                 │
            │ POST /api/chat                  │ POST /api/genai/chat
            │                                 │ GET  /api/genai/stream
            │                                 │
┌───────────┼─────────────────────────────────┼───────────────────┐
│           │       BACKEND (Node.js/Express) │                   │
│  ┌────────▼────────┐              ┌─────────▼────────┐          │
│  │  NLP Service    │              │  GenAI Provider  │          │
│  │  natural 8.x    │              │  • Azure OpenAI  │          │
│  │  compromise 14.x│              │  • OpenAI        │          │
│  └────────┬────────┘              │  • Anthropic     │          │
│           │                       │  • Mock Provider │          │
│           │                       └─────────┬────────┘          │
│  ┌────────▼─────────────────────────────────▼────────┐          │
│  │         MongoDB Atlas (Shared Database)           │          │
│  │  - clinical_trials      - participants            │          │
│  │  - drugs               - adverse_events           │          │
│  │  - trial_sites         - chat_sessions (NEW)      │          │
│  └───────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### NLP Chatbot (Existing)
- ✅ Pattern-based query understanding
- ✅ Entity extraction (Trial IDs, Drug codes, Phases)
- ✅ Multi-collection MongoDB queries
- ✅ CSV/Excel export functionality
- ✅ Real-time response formatting

### GenAI Chatbot (NEW)
- 🆕 Large Language Model integration
- 🆕 Context-aware conversations
- 🆕 Streaming token responses (SSE)
- 🆕 Session history management
- 🆕 MongoDB data enrichment
- 🆕 Provider abstraction (Azure OpenAI/OpenAI/Anthropic/Mock)
- 🆕 Prompt safety & sanitization
- 🆕 Token usage tracking
- 🆕 Rate limiting (20 req/min)

---

## 📦 Prerequisites

- **Node.js**: 20.x or higher
- **npm**: 9.x or higher
- **Angular CLI**: 17.3.x
- **MongoDB Atlas**: Active cluster
- **GenAI API Key** (optional):
  - Azure OpenAI API key + endpoint, OR
  - OpenAI API key, OR
  - Anthropic API key
  - (Leave empty to use mock provider)

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd pharmaGenie
```

### 2. Install Backend Dependencies
```bash
cd pharma-genie-backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../pharma-genie-demo
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables

Create `.env` file in `pharma-genie-backend/`:

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=pharmaGenieDB

# GenAI Configuration
GENAI_PROVIDER=mock  # Options: azure-openai | openai | anthropic | mock
GENAI_MODEL=gpt-4o-mini
GENAI_TEMPERATURE=0.7
GENAI_MAX_TOKENS=2000
GENAI_TOP_P=0.95

# Azure OpenAI (if using azure-openai)
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# GENAI_API_KEY=your-azure-key

# OpenAI (if using openai)
# GENAI_API_KEY=sk-your-openai-key

# Anthropic (if using anthropic)
# GENAI_API_KEY=your-anthropic-key

# Mock Provider (default - no API key needed)
GENAI_API_KEY=
```

### Seed Database (First Time Only)

```bash
cd pharma-genie-backend
npm run seed
```

Expected output:
```
✅ MongoDB Atlas connected successfully
📦 Seeded 8 Clinical Trials
💊 Seeded 5 Drugs
🏥 Seeded 3 Trial Sites
👥 Seeded 2 Participants
⚠️ Seeded 2 Adverse Events
✅ Database seeded successfully!
```

---

## 🏃 Running the Application

### Option 1: Run Separately

**Terminal 1 - Backend:**
```bash
cd pharma-genie-backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd pharma-genie-demo
npm start
```

### Option 2: Using Concurrently (Recommended)

Add to root `package.json`:
```json
{
  "scripts": {
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:backend": "cd pharma-genie-backend && npm start",
    "start:frontend": "cd pharma-genie-demo && npm start"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
```

Then run:
```bash
npm install
npm start
```

### Access Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

---

## 🔌 API Endpoints

### NLP Chatbot (Existing)
```
POST   /api/chat               # NLP query processing
GET    /api/trials             # List all trials
GET    /api/trials/:id         # Get trial by ID
POST   /api/export/csv         # Export to CSV
POST   /api/export/excel       # Export to Excel
```

### GenAI Chatbot (NEW)
```
POST   /api/genai/chat         # GenAI chat (standard)
GET    /api/genai/stream       # GenAI chat (streaming SSE)
GET    /api/genai/sessions     # List chat sessions
GET    /api/genai/session/:id  # Get session by ID
DELETE /api/genai/session/:id  # Delete session
```

### Request/Response Examples

**GenAI Chat Request:**
```json
{
  "sessionId": "session_12345",
  "message": "Tell me about Phase III diabetes trials",
  "context": {}
}
```

**GenAI Chat Response:**
```json
{
  "reply": "Based on our clinical trials database...",
  "model": "gpt-4o-mini",
  "tokens": {
    "prompt": 120,
    "completion": 350,
    "total": 470
  },
  "latencyMs": 1234,
  "sessionId": "session_12345"
}
```

---

## 🤖 GenAI Provider Setup

### Azure OpenAI

1. Create Azure OpenAI resource
2. Deploy a model (e.g., gpt-4o-mini)
3. Get endpoint and API key
4. Configure `.env`:

```env
GENAI_PROVIDER=azure-openai
GENAI_MODEL=gpt-4o-mini
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
GENAI_API_KEY=your-azure-api-key
```

### OpenAI

1. Sign up at https://platform.openai.com/
2. Generate API key
3. Configure `.env`:

```env
GENAI_PROVIDER=openai
GENAI_MODEL=gpt-4o-mini
GENAI_API_KEY=sk-your-openai-api-key
```

### Anthropic Claude

1. Sign up at https://console.anthropic.com/
2. Generate API key
3. Configure `.env`:

```env
GENAI_PROVIDER=anthropic
GENAI_MODEL=claude-3-5-sonnet-20241022
GENAI_API_KEY=your-anthropic-api-key
```

### Mock Provider (No API Key)

For testing without external API calls:

```env
GENAI_PROVIDER=mock
GENAI_API_KEY=
```

---

## 📁 Project Structure

```
pharmaGenie/
├── pharma-genie-backend/
│   ├── providers/                    # NEW - GenAI providers
│   │   ├── genai-provider.interface.ts
│   │   ├── azure-openai-provider.ts
│   │   ├── openai-provider.ts
│   │   ├── anthropic-provider.ts
│   │   ├── mock-provider.ts
│   │   └── provider-factory.ts
│   ├── middleware/                   # NEW - Validation, rate limiting, logging
│   │   ├── validation.middleware.ts
│   │   ├── rate-limiter.middleware.ts
│   │   └── logger.middleware.ts
│   ├── routes/                       # NEW - GenAI routes
│   │   └── genai.routes.ts
│   ├── models/
│   │   ├── ClinicalTrial.js
│   │   ├── Drug.js
│   │   ├── TrialSite.js
│   │   ├── Participant.js
│   │   ├── AdverseEvent.js
│   │   ├── ChatSession.js           # NEW - GenAI chat history
│   │   └── index.js
│   ├── utils/                        # NEW - Sanitization utilities
│   │   ├── sanitizer.ts
│   │   └── request-id.ts
│   ├── nlp-service.js               # Existing NLP service
│   ├── server.js                    # Updated with GenAI routes
│   ├── seed.js
│   ├── package.json
│   ├── tsconfig.json                # NEW
│   └── .env.example                 # NEW
│
├── pharma-genie-demo/
│   └── src/app/
│       ├── features/
│       │   ├── nlp-chat/            # NEW - Wrapper for existing chatbot
│       │   │   └── nlp-chat.component.ts
│       │   └── genai-chat/          # NEW - GenAI chatbot
│       │       ├── genai-chat.component.ts
│       │       ├── genai-chat.component.html
│       │       ├── genai-chat.component.css
│       │       └── genai-chat.service.ts
│       ├── shared/
│       │   ├── models/
│       │   │   └── genai.models.ts  # NEW
│       │   └── pipes/
│       │       └── nl2br.pipe.ts    # NEW
│       ├── app.component.ts         # Updated with tabs
│       ├── app.component.html       # Updated with navigation
│       ├── app.component.css        # Updated styles
│       └── app.routes.ts            # NEW routes
│
└── docs/
    └── SAMPLE_QUERIES.md
```

---

## 🧪 Testing

### Test GenAI Mock Provider

```bash
# Start backend
cd pharma-genie-backend
npm start

# In another terminal
curl -X POST http://localhost:3000/api/genai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123",
    "message": "Tell me about clinical trials"
  }'
```

### Test Streaming

Navigate to: `http://localhost:4200/genai`

Enable "Stream responses" toggle and send a message.

### Frontend E2E Testing

```bash
cd pharma-genie-demo
npm run test
```

---

## 🔒 Security Features

- ✅ Input sanitization (8000 char limit)
- ✅ Rate limiting (20 requests/minute)
- ✅ Request ID tracking
- ✅ Prompt safety (system prompt isolation)
- ✅ Environment variable encryption
- ✅ CORS configuration
- ✅ Structured error handling

---

## 📊 Performance Considerations

- **NLP Chatbot**: ~50-200ms response time
- **GenAI Chatbot (Mock)**: ~800-1200ms simulated delay
- **GenAI Chatbot (Real)**: 1-5s depending on provider
- **Streaming**: ~50-100ms per token chunk
- **MongoDB Queries**: Indexed for <50ms retrieval

---

## 🚢 Deployment

### Backend (Node.js)

**Recommended platforms:**
- Azure App Service
- AWS Elastic Beanstalk
- Google Cloud Run
- Heroku

**Environment variables to set:**
- All `.env` variables
- `NODE_ENV=production`
- MongoDB connection string
- GenAI API credentials

### Frontend (Angular)

```bash
cd pharma-genie-demo
ng build --configuration production
```

Deploy `dist/` folder to:
- Azure Static Web Apps
- AWS S3 + CloudFront
- Netlify
- Vercel

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 📞 Support

For issues or questions:
- Create GitHub issue
- Email: support@pharmagenie.io
- Documentation: https://docs.pharmagenie.io

---

## 🎯 Roadmap

- [ ] Add user authentication
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Voice input/output
- [ ] Mobile app (React Native)
- [ ] RAG (Retrieval Augmented Generation)
- [ ] Fine-tuned domain models

---

**Built with ❤️ for pharmaceutical research and clinical trials innovation**
