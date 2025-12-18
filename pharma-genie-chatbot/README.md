# PharmaGenie Chatbot 🧬

An intelligent, NLP-powered chatbot for pharmaceutical clinical trials, built as an Angular library.

## Features

- 🎨 **Pharma-themed UI** - Clean, professional design with medical branding
- 🧠 **NLP Integration** - Natural language processing for query understanding
- 📊 **Multiple Export Formats** - CSV, Excel, Table, and Text responses
- ♿ **Accessible** - WCAG 2.1 compliant with keyboard navigation
- 📱 **Responsive** - Works on all devices
- 🔌 **Easy Integration** - Drop-in component for Angular apps
- 🔒 **Secure** - Works with local/private databases

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
    <pharma-genie-chatbot [config]="chatConfig"></pharma-genie-chatbot>
  `
})
export class AppComponent {
  chatConfig = {
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
npm start
```

The backend server will run on `http://localhost:3000`

## Configuration Options

```typescript
interface PharmaGenieConfig {
  apiUrl: string;                    // Backend API URL
  theme?: 'light' | 'dark';          // UI theme
  position?: 'bottom-right' |        // Chat position
             'bottom-left' | 
             'top-right' | 
             'top-left';
  enableExport?: boolean;            // Enable CSV/Excel export
  placeholder?: string;              // Input placeholder text
  welcomeMessage?: string;           // Initial greeting message
}
```

## Usage Examples

### Basic Usage

```typescript
<pharma-genie-chatbot></pharma-genie-chatbot>
```

### Custom Configuration

```typescript
<pharma-genie-chatbot [config]="{
  apiUrl: 'https://api.yourcompany.com',
  theme: 'dark',
  position: 'bottom-left',
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

3. Start the server:
```bash
npm start
```

### Production Setup

For production, replace the JSON data source with MongoDB:

```javascript
// Update server.js
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI);

const TrialSchema = new mongoose.Schema({
  id: String,
  title: String,
  // ... other fields
});

const Trial = mongoose.model('Trial', TrialSchema);
```

## NLP Integration

The chatbot uses two NLP libraries for query analysis:

### 1. Natural.js
- Tokenization
- TF-IDF keyword extraction
- Text classification

### 2. Compromise
- Named entity recognition
- Date/number extraction
- Part-of-speech tagging

### How It Works

1. **Intent Detection** - Identifies query type (list, count, filter, export)
2. **Entity Extraction** - Extracts trial IDs, drugs, phases, statuses
3. **Keyword Matching** - Finds relevant terms for database filtering
4. **Filter Building** - Constructs database queries from natural language
5. **Response Formatting** - Returns results in requested format

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
