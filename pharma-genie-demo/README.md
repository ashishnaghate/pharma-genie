# PharmaGenie Demo

Demo application showcasing dual-mode AI chatbot capabilities for pharmaceutical clinical trials.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.0.

## Features

- 🤖 **Dual Chat Interface** - GenAI (left) and NLP (right) side-by-side
- 🧠 **GenAI Chat** - Conversational AI powered by HCL AI Cafe (GPT-4.1)
- ⚡ **NLP Chat** - Fast traditional query processing
- 📊 **Export Functionality** - CSV and Excel (multi-sheet) export
- 🎨 **Pharma-Themed UI** - Professional medical design
- 📱 **Responsive Design** - Works on all screen sizes

## Architecture

```
pharma-genie-demo/
├── src/
│   ├── app/
│   │   ├── features/
│   │   │   ├── genai-chat/              # GenAI chat component
│   │   │   │   ├── genai-chat.component.ts
│   │   │   │   ├── genai-chat.service.ts
│   │   │   │   └── genai-chatbot/       # Chatbot UI component
│   │   │   │
│   │   │   └── nlp-chat/                # NLP chat component
│   │   │       ├── nlp-chat.component.ts
│   │   │       └── (uses pharma-genie-chatbot package)
│   │   │
│   │   └── shared/
│   │       ├── models/                   # TypeScript interfaces
│   │       ├── services/                 # API services
│   │       └── pipes/                    # Custom pipes
│   │
│   └── environments/                     # Environment configs
│
└── Uses: pharma-genie-chatbot (NPM link)
```

## Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher
- Angular CLI 17.3.x
- Backend server running (pharma-genie-backend)
- Chatbot package linked (pharma-genie-chatbot)

## Setup Instructions

### 1. Install Dependencies

```bash
cd pharma-genie-demo
npm install
```

### 2. Link Chatbot Package

```bash
# First, build and link the chatbot package
cd ../pharma-genie-chatbot
npm run build
npm link

# Then link it in the demo
cd ../pharma-genie-demo
npm link pharma-genie-chatbot
```

### 3. Start Backend Server

```bash
cd ../pharma-genie-backend
npm start
# Runs on http://localhost:3000
```

### 4. Start Demo Application

```bash
cd ../pharma-genie-demo
npm start
# Runs on http://localhost:4200
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Usage

### Dual Chat Interface

The demo displays two chat interfaces side-by-side:

**Left Panel - GenAI Chat**
- Conversational AI with HCL AI Cafe
- Best for complex questions and analysis
- Maintains conversation context
- Response time: ~1-3 seconds

**Right Panel - NLP Chat**
- Fast traditional NLP processing
- Best for quick queries and filtering
- Structured responses
- Response time: ~200-500ms

### Example Queries

**GenAI Chat (Conversational):**
```
"What are the most promising treatments for Type 2 Diabetes?"
"Compare the safety profiles of ABC123 and XYZ789"
"Which trial sites have the highest enrollment success rates?"
"Explain the mechanism of action for DPP-4 inhibitors"
```

**NLP Chat (Quick Queries):**
```
"Show all active trials"
"Find Phase III diabetes studies"
"How many completed trials?"
"List trials for drug ABC123"
"Export to Excel"
```

### Export Functionality

Both chat interfaces support data export:
- **CSV Export** - Single collection data
- **Excel Export** - Multi-sheet workbooks
- Automatic format detection
- Professional formatting

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
