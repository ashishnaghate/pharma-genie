# 🧬 PharmaGenie - Enterprise Clinical Trials Intelligence

**An enterprise-grade AI-powered chatbot for pharmaceutical clinical trials with dual NLP and GenAI capabilities**

[![Angular](https://img.shields.io/badge/Angular-17.3.x-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Overview

PharmaGenie is an enterprise-grade intelligent chatbot platform for pharmaceutical clinical trials, featuring **dual AI capabilities**: traditional NLP for fast queries and advanced GenAI (HCL AI Cafe/GPT-4.1) for conversational intelligence. Built with Angular 17, TypeScript 5.4, Node.js, Express, and MongoDB Atlas.

## ✨ Features

### Dual AI Modes
- 🧠 **NLP Mode** - Fast traditional queries (~200-500ms) using Natural.js and Compromise
- 🤖 **GenAI Mode** - Conversational AI (~1-3s) powered by HCL AI Cafe (GPT-4.1)
- 🔄 **Mode Switching** - Choose best mode for your query type

### Enterprise Architecture
- 💾 **MongoDB Atlas** - Cloud NoSQL database with 5 collections
- 💬 **Session Management** - Persistent chat history with metadata
- 🛡️ **Middleware Stack** - Rate limiting, logging, validation, sanitization
- 📊 **Advanced Export** - Multi-sheet Excel and CSV with smart detection
- 🔗 **Relational Data** - Mongoose ODM with automatic population

### User Experience
- 🎨 **Pharma-Themed UI** - Professional medical design
- ♿ **WCAG 2.1 Compliant** - Fully accessible
- 📦 **NPM Package** - Reusable Angular library
- 🔒 **Secure** - Zero vulnerabilities, comprehensive security
- 🚀 **Fast & Responsive** - Optimized performance

## 🏗️ Architecture

```
pharmaGenie/
├── pharma-genie-backend/         # Backend API Server
│   ├── Node.js 20.x + Express 5.x
│   ├── MongoDB Atlas (5 Collections)
│   ├── Dual AI: NLP + GenAI (HCL AI Cafe)
│   ├── Provider Factory Pattern
│   ├── Middleware Stack (Logging, Rate Limiting, Validation)
│   ├── Session Management
│   └── Multi-Sheet Excel/CSV Export
│
├── pharma-genie-chatbot/         # NPM Package (Angular Library)
│   ├── Standalone Angular 17 Component
│   ├── TypeScript Models & Services
│   ├── Dual Mode Support (NLP + GenAI)
│   ├── Export Functionality
│   └── Professional Pharma UI
│
└── pharma-genie-demo/            # Demo Application
    ├── Angular 17.3.x
    ├── Dual Chat Interface (GenAI + NLP)
    ├── Side-by-Side Comparison
    └── Example Implementation
```

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│     GenAI Chat Component │ NLP Chat Component          │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                  Express Server                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │   Middleware: Logger│Rate Limiter│Validator     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────┐        ┌──────────────────────┐      │
│  │  NLP Routes  │        │    GenAI Routes      │      │
│  │  /api/chat   │        │  /api/genai/chat     │      │
│  └──────┬───────┘        └───────────┬──────────┘      │
│         │                            │                   │
│         ▼                            ▼                   │
│  ┌──────────────┐        ┌──────────────────────┐      │
│  │ NLP Service  │        │  Provider Factory    │      │
│  │ Natural.js   │        │  HCL AI Cafe GPT-4.1│      │
│  └──────┬───────┘        └───────────┬──────────┘      │
│         └────────────┬───────────────┘                  │
│                      ▼                                    │
│         ┌────────────────────────┐                       │
│         │    MongoDB Atlas       │                       │
│         │  6 Collections         │                       │
│         └────────────────────────┘                       │
└──────────────────────────────────────────────────────────┘
```

### Components

**Backend (pharma-genie-backend)**
- RESTful API with Express 5.x
- Dual AI: NLP Engine + GenAI (HCL AI Cafe)
- MongoDB Atlas with 6 collections
- Session management for conversations
- Multi-sheet Excel/CSV export
- Enterprise middleware stack
- 0 security vulnerabilities

**NPM Package (pharma-genie-chatbot)**
- Standalone Angular 17 component
- Dual mode support (NLP + GenAI)
- TypeScript models and interfaces
- Service layer for API communication
- Professional pharma-themed UI
- Export functionality

**Demo Application (pharma-genie-demo)**
- Angular 17.3.x application
- Dual chat interface (side-by-side)
- GenAI and NLP comparison
- Example implementation
- Responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Angular CLI 17.3.x
- MongoDB Atlas account (free tier available)
- HCL AI Cafe API key (for GenAI mode)

### Installation

1. **Clone the repository**
```bash
cd pharmaGenie
```

2. **Install Backend**
```bash
cd pharma-genie-backend
npm install

# Configure .env file
cp .env.example .env
# Edit .env with your MongoDB URI and HCL AI Cafe credentials

# Seed the database
npm run seed
```

3. **Install Chatbot Package**
```bash
cd ../pharma-genie-chatbot
npm install
npm run build
npm link
```

4. **Install Demo**
```bash
cd ../pharma-genie-demo
npm install
npm link pharma-genie-chatbot
```

### Running the Application

**Start Backend (Terminal 1)**
```bash
cd pharma-genie-backend
npm start
```
Backend runs on: http://localhost:3000

**Start Demo (Terminal 2)**
```bash
cd pharma-genie-demo
npm start
```
Demo runs on: http://localhost:4200

### Using the Chatbot

1. Open http://localhost:4200 in your browser
2. **Left Panel (GenAI Chat)** - Ask complex conversational questions
3. **Right Panel (NLP Chat)** - Quick structured queries
4. Try example queries:
   - GenAI: "What are the most promising diabetes treatments?"
   - NLP: "Show all active Phase III trials"
5. Export results to CSV or Excel

## 📚 Documentation

- [Setup Guide](./SETUP-GUIDE.md) - Detailed installation instructions
- [API Documentation](./API-DOCUMENTATION.md) - Backend API reference
- [NPM Package Guide](./NPM-PACKAGE-GUIDE.md) - Using the chatbot package
- [User Guide](./USER-GUIDE.md) - How to use the chatbot

## 🎯 Example Queries

### NLP Mode (Fast & Structured)
The NLP chatbot excels at quick, structured queries:

- **List queries**: "Show all trials", "List active studies", "Find recruiting trials"
- **Filter queries**: "Find Phase III trials", "Show diabetes studies", "Active oncology trials"
- **Drug queries**: "Trials for ABC123", "Studies using XYZ789"
- **Count queries**: "How many trials?", "Count active studies", "Total Phase III trials"
- **Detail queries**: "Tell me about CT-2024-001", "Details for trial ABC"
- **Export queries**: "Export to CSV", "Download as Excel"

### GenAI Mode (Conversational & Analytical)
The GenAI chatbot handles complex, conversational queries:

- **Analysis**: "What are the most promising diabetes treatments in Phase III?"
- **Comparison**: "Compare adverse event rates between ABC123 and XYZ789 trials"
- **Explanation**: "Explain the mechanism of action for DPP-4 inhibitors"
- **Insights**: "Which trial sites have the highest enrollment success rates?"
- **Trends**: "Show me enrollment trends across oncology trials"
- **Recommendations**: "What trials should we prioritize for recruitment?"
- **Complex**: "Analyze participant demographics in cardiovascular trials and compare to diabetes studies"

## 💻 Technology Stack

### Frontend
- **Angular** 17.3.x (Standalone Components)
- **TypeScript** 5.4.x
- **RxJS** 7.8.x
- Responsive Design
- WCAG 2.1 Accessibility

### Backend
- **Node.js** 20.x
- **Express** 5.x
- **Mongoose** 9.x (MongoDB ODM)
- **Natural.js** 8.x (NLP - Tokenization, TF-IDF)
- **Compromise** 14.x (NLP - Entity Extraction)
- **ExcelJS** 4.x (Excel generation)
- **Fast-CSV** 1.x (CSV export)

### Database
- **MongoDB Atlas** (Cloud)
- 6 Collections:
  - Clinical Trials
  - Drugs
  - Trial Sites
  - Participants
  - Adverse Events
  - Chat Sessions
- Full-text indexing
- Reference population
- Aggregation pipelines

### AI Integration
- **HCL AI Cafe** (GPT-4.1)
- Provider Factory Pattern
- Mock Provider (testing)
- Conversation history
- Context injection
- Token tracking

### Middleware & Security
- **Rate Limiting** - express-rate-limit
- **Request Logging** - Custom middleware
- **Input Validation** - Custom middleware
- **Sanitization** - XSS protection
- **Error Handling** - Centralized error handling
- **CORS** - Configured for security

### Development Tools
- npm link (local package development)
- TypeScript compiler (type checking)
- Angular CLI
- ESM modules

## 🔧 API Endpoints

### Health & Status
- `GET /api/health` - Health check with database stats

### NLP Chat (Fast Queries)
- `POST /api/chat` - Process NLP query
- `GET /api/trials` - Get all trials (with population)
- `GET /api/trials/:id` - Get trial by ID with related data
- `GET /api/drugs` - Get all drugs
- `GET /api/drugs/:id` - Get specific drug
- `GET /api/sites` - Get all trial sites
- `GET /api/participants` - Get all participants
- `GET /api/adverse-events` - Get all adverse events

### GenAI Chat (Conversational)
- `POST /api/genai/chat` - GenAI conversational query
- `POST /api/genai/sessions` - Create chat session
- `GET /api/genai/sessions/:id` - Get session with history
- `GET /api/genai/sessions/:id/messages` - Get session messages
- `DELETE /api/genai/sessions/:id` - Clear session
- `GET /api/genai/sessions` - List all sessions

### Export
- `POST /api/export/csv` - Export to CSV (single collection)
- `POST /api/export/excel` - Export to Excel (multi-sheet support)
  - Auto-detects single vs multi-collection data
  - Professional formatting
  - Multiple sheets for different data types

## 📦 Using the NPM Package

### Installation
```bash
npm install pharma-genie-chatbot
```

### Usage
```typescript
import { Component } from '@angular/core';
import { ChatbotComponent } from 'pharma-genie-chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatbotComponent],
  template: `<app-chatbot [config]="config"></app-chatbot>`
})
export class AppComponent {
  config = {
    apiUrl: 'http://localhost:3000',
    theme: 'light',
    enableExport: true
  };
}
```

## 🛡️ Security

- ✅ Backend: 0 vulnerabilities
- ✅ Input validation implemented
- ✅ CORS configured
- ✅ Environment variables supported
- ✅ Private network compatible

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Natural.js and Compromise for NLP capabilities
- The pharmaceutical research community

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation in the `docs/` folder

---

**Built with ❤️ using Angular 17, TypeScript 5.4, and NLP**
