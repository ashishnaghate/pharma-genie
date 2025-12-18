# 🧬 PharmaGenie - Clinical Trials Intelligence

**An intelligent NLP-powered chatbot for pharmaceutical clinical trials**

[![Angular](https://img.shields.io/badge/Angular-17.3.x-red)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.x-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

PharmaGenie is a professional chatbot application for querying pharmaceutical clinical trials using Natural Language Processing (NLP). Built with Angular 17, TypeScript 5.4, Node.js, and Express.

## ✨ Features

- 🧠 **NLP-Powered** - Natural language query processing using Natural.js and Compromise
- 📊 **Multi-Format Export** - Export data to CSV and Excel with professional formatting
- 🎨 **Pharma-Themed UI** - Professional medical design with blue/green color scheme
- ♿ **Accessible** - WCAG 2.1 compliant with keyboard navigation
- 📦 **NPM Package** - Reusable Angular component library
- 🔒 **Secure** - Zero vulnerabilities, input validation, CORS configured
- 🚀 **Optimized** - Fast builds (~135 kB) and responsive design

## 🏗️ Project Structure

```
pharmaGenie/
├── pharma-genie-backend/         # Backend API Server
│   ├── Node.js 20.x + Express 5.x
│   ├── NLP Engine (Natural.js + Compromise)
│   ├── 8 Sample Clinical Trials
│   └── CSV/Excel Export
│
├── pharma-genie-chatbot/         # NPM Package (Angular Library)
│   ├── Standalone Angular 17 Component
│   ├── TypeScript Models & Services
│   └── Professional UI Components
│
└── pharma-genie-demo/            # Demo Application
    ├── Angular 17.3.x
    ├── Imports chatbot from NPM package
    └── Example implementation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Angular CLI 17.3.x

### Installation & Running

**1. Backend Server**
```bash
cd pharma-genie-backend
npm install
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
2. Click the blue chat button (bottom-right)
3. Try: "Show all active trials"
4. Export results to CSV or Excel

## 💬 Example Queries

```
"Show all active trials"
"Find Phase III diabetes studies"
"List trials for drug ABC123"
"How many completed trials?"
"Tell me about NCT001"
"Export to Excel"
```

## 📚 Documentation

Complete documentation is available in the `/docs` folder:

- **[README](./docs/README.md)** - Project overview and features
- **[Setup Guide](./docs/SETUP-GUIDE.md)** - Detailed installation instructions
- **[User Guide](./docs/USER-GUIDE.md)** - How to use the chatbot
- **[API Documentation](./docs/API-DOCUMENTATION.md)** - Backend API reference
- **[NPM Package Guide](./docs/NPM-PACKAGE-GUIDE.md)** - Using the chatbot package

## 🔌 API Endpoints

- `GET /api/health` - Health check
- `POST /api/chat` - Process NLP query
- `GET /api/trials` - Get all trials
- `GET /api/trials/:id` - Get trial by ID
- `POST /api/export/csv` - Export to CSV
- `POST /api/export/excel` - Export to Excel

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
- Angular 17.3.x
- TypeScript 5.4.x
- RxJS 7.8.x
- Standalone Components

**Backend**
- Node.js 20.x
- Express 5.x
- Natural.js (NLP)
- Compromise (NLP)
- ExcelJS
- Fast-CSV

**Development**
- npm link
- TypeScript compiler
- Angular CLI

## 🔒 Security

✅ Backend: 0 vulnerabilities  
✅ Input validation  
✅ CORS configured  
✅ Environment variables supported  
✅ Private network compatible

## 📊 Project Status

✅ Backend API - Operational  
✅ NPM Package - Built & Linked  
✅ Demo Application - Running  
✅ Documentation - Complete  
✅ Testing - Verified  
✅ Production Ready

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
