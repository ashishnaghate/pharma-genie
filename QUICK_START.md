# Quick Setup Guide - PharmaGenie GenAI Integration

## 🚀 Quick Start (5 Minutes)

### Step 1: Install Backend Dependencies
```powershell
cd pharma-genie-backend
npm install
```

**New packages installed:**
- TypeScript 5.4.x
- @types/node, @types/express, @types/cors

### Step 2: Configure Environment
```powershell
# Copy example environment file
cp .env.example .env

# Edit .env with your MongoDB credentials
# Leave GENAI_PROVIDER=mock for testing without API keys
```

### Step 3: Seed Database (if not done already)
```powershell
npm run seed
```

### Step 4: Start Backend
```powershell
npm start
```

Expected output:
```
✅ MongoDB Atlas connected successfully
🤖 Initializing GenAI Provider: mock
📦 Model: gpt-4o-mini
🔧 Using mock provider (no API calls)
📡 Server running on http://localhost:3000
```

### Step 5: Start Frontend
```powershell
# In a new terminal
cd pharma-genie-demo
npm start
```

### Step 6: Access Application

Open browser: **http://localhost:4200**

You'll see two tabs:
- **🧠 NLP Chatbot** (existing - works immediately)
- **🤖 GenAI Chatbot** (new - works with mock provider)

---

## 🎯 Testing the GenAI Chatbot

1. Click **"GenAI Chatbot"** tab
2. Try example queries:
   - "Tell me about Phase III clinical trials for diabetes"
   - "What drugs are currently in our database?"
   - "Show me information about trial CT-2024-001"

3. Toggle **"Stream responses"** to see token-by-token streaming

---

## 🔑 Enable Real GenAI (Optional)

### Option A: Azure OpenAI
```env
GENAI_PROVIDER=azure-openai
GENAI_MODEL=gpt-4o-mini
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
GENAI_API_KEY=your-azure-api-key
```

### Option B: OpenAI
```env
GENAI_PROVIDER=openai
GENAI_MODEL=gpt-4o-mini
GENAI_API_KEY=sk-your-openai-api-key
```

### Option C: Anthropic Claude
```env
GENAI_PROVIDER=anthropic
GENAI_MODEL=claude-3-5-sonnet-20241022
GENAI_API_KEY=your-anthropic-api-key
```

**Restart backend after changing provider:**
```powershell
npm start
```

---

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Frontend loads at http://localhost:4200
- [ ] Two tabs visible in header
- [ ] NLP Chatbot works (existing functionality)
- [ ] GenAI Chatbot responds with mock provider
- [ ] Streaming toggle works
- [ ] Messages display correctly
- [ ] Session ID shown in footer

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Check Node version (should be 20.x+)
node --version

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Frontend compilation errors
```powershell
cd pharma-genie-demo
npm install
ng serve
```

### MongoDB connection failed
- Check `MONGODB_URI` in `.env`
- Ensure IP whitelisted in MongoDB Atlas
- Test connection: `mongosh "your-connection-string"`

### GenAI responses not showing
- Check browser console (F12)
- Verify backend logs for errors
- Test API: `curl http://localhost:3000/api/health`

---

## 📚 Next Steps

1. **Customize System Prompt**: Edit `providers/genai-provider.interface.ts` → `getSystemPrompt()`
2. **Add Context Enrichment**: Modify `routes/genai.routes.ts` → `enrichContextWithData()`
3. **Adjust Rate Limits**: Change `middleware/rate-limiter.middleware.ts`
4. **Styling**: Update `genai-chat.component.css`
5. **Add Analytics**: Track token usage, latency, user patterns

---

## 📖 Full Documentation

See **GENAI_README.md** for complete documentation including:
- Architecture diagrams
- API reference
- Provider configuration
- Deployment guide
- Security best practices

---

**Need Help?**
- Review logs in terminal
- Check browser DevTools console
- See example queries in UI
- Read GENAI_README.md for detailed docs
