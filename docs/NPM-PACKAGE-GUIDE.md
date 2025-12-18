# 📦 NPM Package Guide - pharma-genie-chatbot

Complete guide to using the PharmaGenie chatbot as an NPM package in your Angular projects.

## 📋 Overview

`pharma-genie-chatbot` is a standalone Angular component library that provides an intelligent chatbot interface for querying pharmaceutical clinical trials data.

## 🎯 Features

- ✅ Standalone Angular 17 component
- ✅ TypeScript 5.4 support
- ✅ Fully typed with TypeScript interfaces
- ✅ Professional pharma-themed UI
- ✅ Responsive and accessible (WCAG 2.1)
- ✅ Export functionality (CSV/Excel)
- ✅ Configurable appearance and behavior
- ✅ RxJS observable patterns

## 📦 Installation

### From NPM Link (Local Development)

```bash
# In the pharma-genie-chatbot directory
npm link

# In your project directory
npm link pharma-genie-chatbot
```

### From Local Package

```bash
npm install /path/to/pharma-genie-chatbot
```

### From NPM Registry (After Publishing)

```bash
npm install pharma-genie-chatbot
```

## 🚀 Quick Start

### 1. Import the Component

```typescript
import { Component } from '@angular/core';
import { ChatbotComponent } from 'pharma-genie-chatbot';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChatbotComponent],
  template: `
    <h1>My Application</h1>
    <app-chatbot [config]="chatConfig"></app-chatbot>
  `
})
export class AppComponent {
  chatConfig = {
    apiUrl: 'http://localhost:3000',
    theme: 'light',
    enableExport: true
  };
}
```

### 2. Configure tsconfig.json

Add path mapping if using local package:

```json
{
  "compilerOptions": {
    "paths": {
      "pharma-genie-chatbot": ["../pharma-genie-chatbot/src/index.ts"]
    }
  }
}
```

### 3. Configure HttpClient

Ensure HttpClient is provided in your app:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient()
  ]
};
```

## 📚 API Reference

### ChatbotComponent

The main chatbot component.

**Selector**: `app-chatbot`

**Inputs**:
- `config?: Partial<PharmaGenieConfig>` - Configuration object

**Example**:
```html
<app-chatbot [config]="myConfig"></app-chatbot>
```

### PharmaGenieConfig

Configuration interface for the chatbot.

```typescript
interface PharmaGenieConfig {
  apiUrl: string;                    // Backend API URL (required)
  theme?: 'light' | 'dark';          // UI theme (default: 'light')
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  enableExport?: boolean;            // Enable CSV/Excel export (default: true)
  placeholder?: string;              // Input placeholder text
  welcomeMessage?: string;           // Initial bot message
}
```

**Default Configuration**:
```typescript
{
  apiUrl: 'http://localhost:3000',
  theme: 'light',
  position: 'bottom-right',
  enableExport: true,
  placeholder: 'Ask about clinical trials...',
  welcomeMessage: 'Hello! I\'m PharmaGenie. Ask me about clinical trials, drug studies, and research data.'
}
```

### PharmaGenieService

Service for managing chatbot state and API communication.

```typescript
import { PharmaGenieService } from 'pharma-genie-chatbot';

constructor(private pharmaGenieService: PharmaGenieService) {}

// Send a message
this.pharmaGenieService.sendMessage('show active trials');

// Subscribe to messages
this.pharmaGenieService.messages$.subscribe(messages => {
  console.log(messages);
});

// Subscribe to loading state
this.pharmaGenieService.loading$.subscribe(isLoading => {
  console.log('Loading:', isLoading);
});

// Export data
this.pharmaGenieService.exportData(data, 'csv').subscribe(blob => {
  // Handle blob
});

// Clear messages
this.pharmaGenieService.clearMessages();
```

### Data Models

```typescript
// Chat Message
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'table' | 'detailed' | 'list';
  data?: any;
}

// Trial Data
interface TrialData {
  id: string;
  title: string;
  sponsor: string;
  drug: string;
  indication: string;
  phase: string;
  status: string;
  startDate: string;
  endDate: string;
  enrollmentTarget: number;
  enrollmentCurrent: number;
  sites?: string[];
  primaryOutcome?: string;
  adverseEvents?: number;
  studyType?: string;
}

// Chat Response
interface ChatResponse {
  query: string;
  analysis: any;
  resultsCount: number;
  response: {
    type: string;
    content: string;
    trials?: any[];
    trial?: any;
  };
  data: TrialData[];
  format: string;
}
```

## 🎨 Customization

### Theme Customization

Override CSS variables to customize the appearance:

```css
/* In your global styles.css */
app-chatbot {
  --pg-primary: #4A90E2;
  --pg-primary-dark: #357ABD;
  --pg-secondary: #50C878;
  --pg-bg-light: #F8F9FA;
  --pg-bg-white: #FFFFFF;
  --pg-text-dark: #2C3E50;
  --pg-text-light: #6C757D;
  --pg-border: #E0E0E0;
  --pg-shadow: rgba(0, 0, 0, 0.1);
}
```

### Custom Configuration

```typescript
export class AppComponent {
  chatConfig: PharmaGenieConfig = {
    apiUrl: 'https://api.myapp.com',
    theme: 'dark',
    position: 'bottom-left',
    enableExport: true,
    placeholder: 'Ask about our clinical trials...',
    welcomeMessage: 'Welcome! How can I help you today?'
  };
}
```

### Programmatic Control

```typescript
import { Component, ViewChild } from '@angular/core';
import { ChatbotComponent, PharmaGenieService } from 'pharma-genie-chatbot';

export class AppComponent {
  constructor(private chatService: PharmaGenieService) {}

  sendCustomQuery() {
    this.chatService.sendMessage('Show Phase III trials');
  }

  clearChat() {
    this.chatService.clearMessages();
  }

  exportResults() {
    // Get last message data and export
    this.chatService.messages$.subscribe(messages => {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage?.data) {
        this.chatService.exportData(lastMessage.data, 'excel').subscribe(blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'trials.xlsx';
          a.click();
        });
      }
    });
  }
}
```

## 🔧 Advanced Usage

### Multiple Chatbots

You can have multiple chatbot instances:

```typescript
@Component({
  template: `
    <app-chatbot [config]="config1"></app-chatbot>
    <app-chatbot [config]="config2"></app-chatbot>
  `
})
export class AppComponent {
  config1 = { apiUrl: 'http://api1.example.com' };
  config2 = { apiUrl: 'http://api2.example.com' };
}
```

### Event Handling

Subscribe to service observables for custom handling:

```typescript
export class AppComponent implements OnInit {
  constructor(private chatService: PharmaGenieService) {}

  ngOnInit() {
    // Track all messages
    this.chatService.messages$.subscribe(messages => {
      console.log('Total messages:', messages.length);
      // Send analytics
      // Save to local storage
      // etc.
    });

    // Track loading state
    this.chatService.loading$.subscribe(isLoading => {
      if (isLoading) {
        console.log('Processing query...');
      }
    });
  }
}
```

### Custom Styling

Add custom CSS to override default styles:

```css
/* Make chatbot larger */
app-chatbot ::ng-deep .pg-chat-window {
  width: 500px;
  height: 700px;
}

/* Change primary color */
app-chatbot ::ng-deep .pg-chat-toggle {
  background: linear-gradient(135deg, #FF6B6B, #FF4757);
}

/* Customize message bubbles */
app-chatbot ::ng-deep .pg-message.pg-bot .pg-message-bubble {
  background: #f0f0f0;
  color: #333;
}
```

## 📱 Responsive Behavior

The chatbot is fully responsive:

- **Desktop**: 380px × 600px floating window
- **Mobile**: Full-screen mode (calc(100vw - 40px) × calc(100vh - 100px))
- **Tablet**: Adapts to screen size

## ♿ Accessibility

Built with accessibility in mind:

- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ High contrast mode support
- ✅ Focus management

## 🧪 Testing

### Unit Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { ChatbotComponent, PharmaGenieService } from 'pharma-genie-chatbot';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChatbotComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ChatbotComponent, HttpClientTestingModule]
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ChatbotComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

## 📦 Package Structure

```
pharma-genie-chatbot/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── chatbot.component.ts
│   │   │   ├── chatbot.component.html
│   │   │   └── chatbot.component.css
│   │   ├── services/
│   │   │   └── pharma-genie.service.ts
│   │   └── models/
│   │       └── chat.models.ts
│   └── index.ts                     # Public API
├── dist/                            # Compiled output
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Publishing

### Build the Package

```bash
cd pharma-genie-chatbot
npm run build
```

### Test Locally

```bash
npm pack
# Creates pharma-genie-chatbot-1.0.0.tgz
```

### Publish to NPM

```bash
npm login
npm publish
```

### Version Management

```bash
# Patch version (1.0.0 -> 1.0.1)
npm version patch

# Minor version (1.0.0 -> 1.1.0)
npm version minor

# Major version (1.0.0 -> 2.0.0)
npm version major
```

## 🐛 Troubleshooting

### Component Not Found

**Error**: `Cannot find module 'pharma-genie-chatbot'`

**Solution**:
```bash
# Verify installation
npm list pharma-genie-chatbot

# Reinstall if needed
npm uninstall pharma-genie-chatbot
npm install pharma-genie-chatbot
```

### Type Errors

**Error**: Type errors with TypeScript

**Solution**: Ensure TypeScript version compatibility:
```json
{
  "peerDependencies": {
    "typescript": "~5.4.0"
  }
}
```

### Styles Not Loading

**Error**: Chatbot appears unstyled

**Solution**: Verify CSS is included in build. Check `angular.json`:
```json
{
  "styles": [
    "node_modules/pharma-genie-chatbot/dist/lib/components/chatbot.component.css"
  ]
}
```

## 📞 Support

- **Documentation**: Check the [User Guide](./USER-GUIDE.md)
- **API Reference**: See [API Documentation](./API-DOCUMENTATION.md)
- **Issues**: Create an issue on GitHub
- **Email**: support@example.com

---

**Happy Coding! 🧬**
