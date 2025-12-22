# 🎉 What's New in PharmaGenie 2.0

## Major Updates & New Features

### 🤖 Dual AI Capabilities

**GenAI Integration (NEW!)**
- HCL AI Cafe integration with GPT-4.1
- Conversational AI for complex queries
- Context-aware responses
- Multi-turn conversations
- Session persistence

**Enhanced NLP Mode**
- Faster query processing (~200-500ms)
- Improved entity extraction
- Better keyword matching
- Structured responses

### 💾 MongoDB Atlas Integration

**Cloud Database (NEW!)**
- Migrated from JSON to MongoDB Atlas
- 6 collections with relationships:
  - Clinical Trials
  - Drugs
  - Trial Sites
  - Participants
  - Adverse Events
  - Chat Sessions (NEW!)
- Automatic data population
- Full-text search indexing
- Aggregation pipelines

### 💬 Session Management (NEW!)

**Persistent Conversations**
- Save chat history in MongoDB
- Session-based conversations
- Token usage tracking
- Cost calculation
- Metadata storage

### 🛡️ Enterprise Middleware Stack (NEW!)

**Security & Monitoring**
- **Rate Limiting** - Prevent API abuse (100 req/15min)
- **Request Logging** - Track all requests with unique IDs
- **Input Validation** - Validate all incoming data
- **Sanitization** - XSS and injection protection
- **Error Handling** - Centralized error management
- **CORS Configuration** - Secure cross-origin requests

### 📊 Enhanced Export Functionality

**Multi-Sheet Excel Export (NEW!)**
- Auto-detect single vs multi-collection data
- Multiple sheets for different data types
- Professional formatting
- Smart column sizing
- Header styling

**CSV Export (Enhanced)**
- Optimized for single collections
- Fast generation
- Standard formatting

### 🎨 Dual Chat Interface (NEW!)

**Side-by-Side Comparison**
- GenAI Chat (Left Panel)
- NLP Chat (Right Panel)
- Compare response styles
- Choose best mode for your query

### 🏗️ Architecture Improvements

**Provider Factory Pattern (NEW!)**
- Pluggable AI provider system
- Easy to add new providers
- Mock provider for testing
- HCL AI Cafe integration

**Mongoose ODM**
- Type-safe database operations
- Automatic population
- Schema validation
- Middleware hooks

**Request Tracking**
- Unique request IDs
- Request/response logging
- Performance monitoring
- Error tracking

## Breaking Changes

### API Changes
- Health endpoint now returns database stats
- Chat endpoint returns unified format
- Export endpoints accept `responseData` parameter

### Configuration Changes
- New `.env` variables required:
  - `MONGODB_URI`
  - `GENAI_PROVIDER`
  - `HCL_AICAFE_ENDPOINT`
  - `GENAI_API_KEY`

### Database Migration
- Must run `npm run seed` to populate MongoDB
- No longer using `clinical-trials.json` directly

## Migration Guide

### From Version 1.x to 2.0

1. **Update Backend**
```bash
cd pharma-genie-backend
npm install
cp .env.example .env
# Edit .env with MongoDB and HCL credentials
npm run seed
npm start
```

2. **Update Chatbot Package**
```bash
cd pharma-genie-chatbot
npm install
npm run build
npm link
```

3. **Update Demo**
```bash
cd pharma-genie-demo
npm install
npm link pharma-genie-chatbot
npm start
```

## New Environment Variables

```env
# MongoDB (REQUIRED)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pharmaGenie
MONGODB_DB_NAME=pharmaGenie

# GenAI (REQUIRED for GenAI mode)
GENAI_PROVIDER=hcl-aicafe
HCL_AICAFE_ENDPOINT=https://aicafe.hcl.com/...
HCL_DEPLOYMENT_NAME=gpt-4.1
GENAI_API_KEY=your-api-key

# AI Parameters
GENAI_TEMPERATURE=0.7
GENAI_MAX_TOKENS=2000
GENAI_TOP_P=0.95

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## New API Endpoints

### GenAI Chat
- `POST /api/genai/chat` - Conversational AI queries
- `POST /api/genai/sessions` - Create chat session
- `GET /api/genai/sessions/:id` - Get session history
- `DELETE /api/genai/sessions/:id` - Clear session
- `GET /api/genai/sessions` - List all sessions

### Enhanced Data Retrieval
- `GET /api/drugs` - All drugs
- `GET /api/drugs/:id` - Specific drug
- `GET /api/sites` - All trial sites
- `GET /api/participants` - All participants
- `GET /api/adverse-events` - All adverse events

## Performance Improvements

- **NLP Queries**: ~200-500ms response time
- **GenAI Queries**: ~1-3s with context injection
- **Database Queries**: Indexed for optimal performance
- **Export**: Streaming for large datasets

## Security Enhancements

- ✅ Rate limiting on all endpoints
- ✅ Input sanitization (XSS protection)
- ✅ Request validation
- ✅ CORS configuration
- ✅ Error handling without stack trace exposure
- ✅ Environment variable protection

## Scalability

- **Horizontal Scaling**: Stateless API design
- **Database Pooling**: MongoDB connection pooling
- **Caching**: Ready for Redis integration
- **Load Balancing**: Compatible with load balancers

## Documentation Updates

All documentation has been updated to reflect 2.0 features:
- ✅ README.md (root)
- ✅ pharma-genie-backend/README.md
- ✅ pharma-genie-chatbot/README.md
- ✅ pharma-genie-demo/README.md
- ✅ docs/README.md
- ✅ docs/API-DOCUMENTATION.md (enhanced)
- ✅ docs/SETUP-GUIDE.md (enhanced)

## Coming Soon

### Planned Features
- 🔜 User authentication (JWT)
- 🔜 Advanced analytics dashboard
- 🔜 Real-time notifications
- 🔜 Multi-language support
- 🔜 Advanced filtering UI
- 🔜 Saved queries
- 🔜 Data visualization charts

### Provider Support
- 🔜 Azure OpenAI direct integration
- 🔜 AWS Bedrock support
- 🔜 Google Vertex AI integration
- 🔜 Anthropic Claude support

## Support

For questions or issues:
- 📖 Check updated documentation in `/docs`
- 🐛 Report bugs via GitHub Issues
- 💬 Ask questions in Discussions

---

**PharmaGenie 2.0** - Enterprise-grade AI for clinical trials  
Released: December 2025
