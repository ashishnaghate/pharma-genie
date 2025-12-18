# 🧬 PharmaGenie - Clinical Trials Intelligence

**An intelligent chatbot for pharmaceutical clinical trials using NLP and Angular 17**

[![Angular](https://img.shields.io/badge/Angular-17.3.x-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📋 Overview

PharmaGenie is an intelligent chatbot designed for querying pharmaceutical clinical trials data using Natural Language Processing (NLP). Built with Angular 17, TypeScript 5.4, Node.js, and Express, it provides an intuitive interface for accessing clinical trial information.

## ✨ Features

- 🧠 **NLP-Powered Queries** - Natural language understanding using Natural.js and Compromise
- 📊 **Multiple Export Formats** - Export data to CSV and Excel
- 🎨 **Pharma-Themed UI** - Professional medical design with blue/green color scheme
- ♿ **Accessible** - WCAG 2.1 compliant
- 📦 **NPM Package** - Reusable Angular library
- 🔒 **Secure** - Zero vulnerabilities in backend
- 🚀 **Fast** - Optimized build (~135 kB)

## 🏗️ Architecture

```
pharmaGenie/
├── pharma-genie-backend/         # Backend API (Node.js + Express)
├── pharma-genie-chatbot/         # NPM Package (Angular Library)
└── pharma-genie-demo/            # Demo Application (Angular 17)
```

### Components

**Backend (pharma-genie-backend)**
- RESTful API with Express 5
- NLP engine for query processing
- CSV/Excel export functionality
- 8 sample clinical trials
- 0 security vulnerabilities

**NPM Package (pharma-genie-chatbot)**
- Standalone Angular component
- TypeScript models and interfaces
- Service layer for API communication
- Professional pharma-themed UI

**Demo Application (pharma-genie-demo)**
- Angular 17.3.x application
- Imports chatbot from NPM package
- Example implementation
- Responsive design

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Angular CLI 17.3.x

### Installation

1. **Clone the repository**
```bash
cd pharmaGenie
```

2. **Install Backend**
```bash
cd pharma-genie-backend
npm install
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
2. Click the blue chat button in the bottom-right corner
3. Try example queries:
   - "Show all active trials"
   - "Find Phase III diabetes studies"
   - "List trials for drug ABC123"
   - "Export active trials to Excel"

## 📚 Documentation

- [Setup Guide](./SETUP-GUIDE.md) - Detailed installation instructions
- [API Documentation](./API-DOCUMENTATION.md) - Backend API reference
- [NPM Package Guide](./NPM-PACKAGE-GUIDE.md) - Using the chatbot package
- [User Guide](./USER-GUIDE.md) - How to use the chatbot

## 🎯 Example Queries

The chatbot understands natural language queries:

- **List queries**: "Show all trials", "List active studies"
- **Filter queries**: "Find Phase III trials", "Show diabetes studies"
- **Count queries**: "How many trials?", "Count active studies"
- **Detail queries**: "Tell me about NCT001", "Details for trial ABC"
- **Export queries**: "Export to CSV", "Download as Excel"

## 💻 Technology Stack

### Frontend
- Angular 17.3.x
- TypeScript 5.4.x
- RxJS 7.8.x
- Standalone Components

### Backend
- Node.js 20.x
- Express 5.x
- Natural.js (NLP)
- Compromise (NLP)
- ExcelJS
- Fast-CSV

### Development
- npm link for local package development
- TypeScript compiler
- Angular CLI

## 🔧 API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Process NLP query
- `GET /api/trials` - Get all trials
- `GET /api/trials/:id` - Get trial by ID
- `POST /api/export/csv` - Export to CSV
- `POST /api/export/excel` - Export to Excel

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
