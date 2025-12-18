# HCL AI Cafe Integration Guide

## Overview
Your PharmaGenie backend now supports HCL AI Cafe's OpenAI-compatible API for GenAI chat functionality.

## Configuration

### 1. Update `.env` file

Replace `your-hcl-aicafe-subscription-key-here` with your actual API key:

```env
# GenAI Provider Configuration
GENAI_PROVIDER=hcl-aicafe

# HCL AI Cafe Configuration
HCL_AICAFE_ENDPOINT=https://aicafe.hcl.com/AICafeService/api/v1/subscription/openai
HCL_DEPLOYMENT_NAME=gpt-4.1
HCL_API_VERSION=2024-12-01-preview
GENAI_API_KEY=your-actual-api-key-here

# Model Configuration
GENAI_TEMPERATURE=0.7
GENAI_MAX_TOKENS=2000
```

### 2. Restart Backend Server

```bash
cd pharma-genie-backend
npm start
```

You should see:
```
🤖 Initializing GenAI Provider: hcl-aicafe
📦 Model: gpt-4.1
```

## API Endpoint Details

### HCL AI Cafe Endpoint Structure
```
https://aicafe.hcl.com/AICafeService/api/v1/subscription/openai/deployments/{deploymentName}/chat/completions?api-version={apiVersion}
```

### Request Format
The provider sends requests with:
- **Headers**: `api-key` for authentication
- **Body**:
  - `model`: Deployment name (default: gpt-4.1)
  - `messages`: Conversation history with system/user/assistant roles
  - `temperature`: Randomness (0.7 default)
  - `maxTokens`: Max response length (2000 default)

### Response Mapping
HCL AI Cafe response format is mapped to our standard response:
```javascript
{
  reply: data.choices[0].message.content,
  model: data.model,
  tokens: {
    prompt: data.usage.promptTokens,
    completion: data.usage.completionTokens,
    total: data.usage.totalTokens
  },
  latencyMs: <calculated>
}
```

## Testing

### 1. Test with curl
```bash
curl -X POST http://localhost:3000/api/genai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is React?",
    "sessionId": "test-session"
  }'
```

### 2. Test Streaming
```bash
curl -X GET "http://localhost:3000/api/genai/stream?message=What%20is%20Java&sessionId=test"
```

### 3. Test from Frontend
Open your Angular app:
1. Navigate to "GenAI Chatbot" tab
2. Type a message
3. Click "Send" or "Stream"

## Features Supported

✅ **Standard Chat** - POST /api/genai/chat
- Synchronous request/response
- Full conversation history support
- MongoDB session persistence

✅ **Streaming Chat** - GET /api/genai/stream  
- Server-Sent Events (SSE)
- Token-by-token streaming
- Real-time responses

✅ **Context Integration**
- Automatic injection of clinical trial data
- Drug information context
- Adverse events context

✅ **Session Management**
- Create sessions: POST /api/genai/sessions
- Get history: GET /api/genai/sessions/:id
- Delete sessions: DELETE /api/genai/sessions/:id

## Provider Architecture

The HCL AI Cafe provider (`hcl-aicafe-provider.js`) extends the base `GenAIProvider` class and implements:

1. **generate()** - Synchronous chat completion
2. **streamGenerate()** - Streaming chat with SSE
3. **Automatic sanitization** - Input cleaning for security
4. **Context formatting** - MongoDB data integration
5. **Error handling** - Graceful fallback and logging

## Switching Providers

You can switch between providers by changing `GENAI_PROVIDER`:

```env
# Use HCL AI Cafe
GENAI_PROVIDER=hcl-aicafe

# Use Azure OpenAI
GENAI_PROVIDER=azure-openai

# Use OpenAI directly
GENAI_PROVIDER=openai

# Use Anthropic Claude
GENAI_PROVIDER=anthropic

# Use mock (no API calls)
GENAI_PROVIDER=mock
```

## Troubleshooting

### Error: "HCL AI Cafe API key is required"
- Check that `GENAI_API_KEY` is set in `.env`
- Verify the API key is valid

### Error: "Failed to generate response"
- Verify `HCL_AICAFE_ENDPOINT` is correct
- Check `HCL_DEPLOYMENT_NAME` matches your deployment
- Ensure `HCL_API_VERSION` is correct (2024-12-01-preview)
- Check network connectivity to aicafe.hcl.com

### Fallback to Mock Provider
If credentials are missing, the system automatically falls back to the mock provider:
```
⚠️ HCL AI Cafe API key missing, falling back to mock provider
```

## Security Notes

1. **Never commit `.env` file** - It contains your API key
2. **API key in headers** - Sent as `api-key` header (not Bearer token)
3. **Input sanitization** - All user input is sanitized before sending
4. **Rate limiting** - 20 requests per minute enforced
5. **Session isolation** - Each session has independent conversation history

## Next Steps

1. Replace `GENAI_API_KEY` with your actual HCL AI Cafe subscription key
2. Restart the backend server
3. Test the GenAI chatbot from your Angular frontend
4. Monitor console logs for successful connections
5. Check MongoDB for saved conversation sessions

## Support

For issues with:
- **HCL AI Cafe API** - Contact HCL support or check API documentation
- **Backend integration** - Check logs in terminal where `npm start` is running
- **Frontend** - Check browser console for errors
- **Database** - Verify MongoDB connection in backend logs
