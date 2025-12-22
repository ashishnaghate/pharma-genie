# 🧬 PharmaGenie - Clinical Trials Intelligence

**An intelligent AI-powered chatbot for pharmaceutical clinical trials with dual NLP and GenAI capabilities**

[![Angular](https://img.shields.io/badge/Angular-17.3.x-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

PharmaGenie is an enterprise-grade chatbot application for pharmaceutical clinical trials, featuring dual AI capabilities: traditional NLP and advanced GenAI integration. Built with Angular 17, TypeScript 5.4, Node.js, Express, and MongoDB Atlas.

## ✨ Key Features

### Dual AI Capabilities
- 🧠 **NLP Mode** - Fast, traditional query processing using Natural.js and Compromise
- 🤖 **GenAI Mode** - Advanced conversational AI powered by HCL AI Cafe (GPT-4.1)
- 🔄 **Seamless Switching** - Toggle between modes based on query complexity

### Data & Integration
- 💾 **MongoDB Atlas** - Cloud-based NoSQL database with 5 collections
- 🔗 **Relational Data** - Mongoose ODM with population support
- 📊 **Multi-Format Export** - CSV and Excel with multi-sheet support
- 🔍 **Advanced Search** - Full-text search across clinical trials

### Enterprise Features
- 💬 **Session Management** - Persistent chat history with MongoDB
- 🛡️ **Security** - Rate limiting, input validation, CORS configured
- 📈 **Middleware Stack** - Logging, error handling, request tracking
- 🎨 **Pharma-Themed UI** - Professional medical design
- ♿ **WCAG 2.1 Compliant** - Accessible with keyboard navigation
- 📦 **NPM Package** - Reusable Angular component library

## 🏗️ Project Structure

```
pharmaGenie/
├── pharma-genie-backend/         # Backend API Server
│   ├── Node.js 20.x + Express 5.x
│   ├── MongoDB Atlas (Cloud Database)
│   ├── Dual AI: NLP + GenAI (HCL AI Cafe)
│   ├── 5 MongoDB Collections (Trials, Drugs, Sites, Participants, Adverse Events)
│   ├── Chat Session Management
│   ├── Middleware (Logging, Rate Limiting, Validation)
│   └── CSV/Excel Multi-Sheet Export
│
├── pharma-genie-chatbot/         # NPM Package (Angular Library)
│   ├── Standalone Angular 17 Component
│   ├── TypeScript Models & Services
│   ├── Dual Mode Support (NLP + GenAI)
│   └── Professional UI Components
│
└── pharma-genie-demo/            # Demo Application
    ├── Angular 17.3.x
    ├── Two Chat Components (GenAI + NLP)
    ├── Imports chatbot from NPM package
    └── Example implementation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Angular CLI 17.3.x
- MongoDB Atlas account (or local MongoDB)

### Installation & Running

**1. Backend Server**
```bash
cd pharma-genie-backend
npm install

# Configure environment variables
# Copy .env.example to .env and update:
# - MONGODB_URI (your MongoDB Atlas connection string)
# - GENAI_PROVIDER (hcl-aicafe or mock)
# - HCL_AICAFE_ENDPOINT (HCL AI Cafe endpoint)
# - GENAI_API_KEY (your HCL API key)

# Seed the database
npm run seed

# Start the server
npm start
# Runs on http://localhost:3000
```

**2. Chatbot Package**
```bash
cd pharma-genie-chatbot
npm install
npm run build
npm link
```

**3. Demo Application**
```bash
cd pharma-genie-demo
npm install
npm link pharma-genie-chatbot
npm start
# Runs on http://localhost:4200
```

### Try It Out

1. Open http://localhost:4200
2. **GenAI Chat** (Left panel) - Conversational AI with HCL AI Cafe
3. **NLP Chat** (Right panel) - Fast traditional NLP queries
4. Try: "Show all active Phase III trials"
5. Export results to CSV or Excel

## 💬 Example Queries

### NLP Mode (Fast & Structured)
```
"Show all active trials"
"Find Phase III diabetes studies"
"List trials for drug ABC123"
"How many completed trials?"
"Tell me about NCT001"
"Export to Excel"
```

### GenAI Mode (Conversational & Intelligent)
```
"What are the most promising diabetes treatments in Phase III?"
"Compare enrollment rates across oncology trials"
"Tell me about adverse events in ABC123 trials"
"Which sites are most productive?"
"Analyze participant demographics"
```

## 📚 Documentation

Complete documentation is available in the `/docs` folder:

- **[README](./docs/README.md)** - Project overview and features
- **[Setup Guide](./docs/SETUP-GUIDE.md)** - Detailed installation instructions
- **[User Guide](./docs/USER-GUIDE.md)** - How to use the chatbot
- **[API Documentation](./docs/API-DOCUMENTATION.md)** - Backend API reference
- **[NPM Package Guide](./docs/NPM-PACKAGE-GUIDE.md)** - Using the chatbot package

## 🔌 API Endpoints

### NLP Chat Endpoints
- `GET /api/health` - Health check with database stats
- `POST /api/chat` - Process NLP query
- `GET /api/trials` - Get all trials (with population)
- `GET /api/trials/:id` - Get trial by ID (with related data)
- `POST /api/export/csv` - Export to CSV
- `POST /api/export/excel` - Export to Excel (multi-sheet support)

### GenAI Endpoints
- `POST /api/genai/chat` - GenAI conversational query (HCL AI Cafe)
- `POST /api/genai/sessions` - Create chat session
- `GET /api/genai/sessions/:id` - Get session history
- `GET /api/genai/sessions/:id/messages` - Get session messages
- `DELETE /api/genai/sessions/:id` - Clear session
- `GET /api/genai/sessions` - List all sessions

### Data Retrieval
- `GET /api/drugs` - Get all drugs
- `GET /api/drugs/:id` - Get drug by ID
- `GET /api/sites` - Get all trial sites
- `GET /api/participants` - Get all participants
- `GET /api/adverse-events` - Get all adverse events

## 📦 Using as NPM Package

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

## 💻 Technology Stack

**Frontend**
- Angular 17.3.x (Standalone Components)
- TypeScript 5.4.x
- RxJS 7.8.x
- Responsive Design

**Backend**
- Node.js 20.x
- Express 5.x
- Mongoose 9.x (ODM)
- Natural.js 8.x (NLP)
- Compromise 14.x (NLP)
- ExcelJS 4.x
- Fast-CSV 1.x

**Database**
- MongoDB Atlas (Cloud)
- 5 Collections: Clinical Trials, Drugs, Sites, Participants, Adverse Events
- Full-text indexing
- Reference population

**AI Integration**
- HCL AI Cafe (GPT-4.1)
- Provider Factory Pattern
- Mock Provider (for testing)
- Conversation history support

**Middleware & Security**
- Rate Limiting
- Request Logging
- Error Handling
- Input Validation
- Sanitization
- CORS Configuration

## 🔒 Security

✅ Backend: 0 vulnerabilities  
✅ Input validation  
✅ CORS configured  
✅ Environment variables supported  
✅ Private network compatible

## 📊 Project Status

✅ **Backend API** - Operational (MongoDB Atlas + GenAI)  
✅ **Dual AI Modes** - NLP + GenAI (HCL AI Cafe)  
✅ **NPM Package** - Built & Linkable  
✅ **Demo Application** - Dual Chat Interface  
✅ **MongoDB Collections** - 5 Collections with Relationships  
✅ **Session Management** - Persistent Chat History  
✅ **Middleware Stack** - Logging, Rate Limiting, Validation  
✅ **Export Functionality** - CSV & Excel Multi-Sheet  
✅ **Documentation** - Comprehensive & Updated  
✅ **Production Ready** - Enterprise-Grade Architecture

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Angular team for the amazing framework
- Natural.js and Compromise for NLP capabilities
- The pharmaceutical research community

## 📞 Support

- 📖 Check the [documentation](./docs/)
- 🐛 Report issues on GitHub
- 💬 Ask questions in discussions

---

**Built with ❤️ using Angular 17, TypeScript 5.4, and NLP**

*For detailed setup instructions, see [Setup Guide](./docs/SETUP-GUIDE.md)*
