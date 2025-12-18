# 🚀 Setup Guide - PharmaGenie

Complete installation and setup instructions for the PharmaGenie project.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [NPM Package Setup](#npm-package-setup)
4. [Demo Application Setup](#demo-application-setup)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

**Node.js 20.x or higher**
```bash
node --version
# Should show v20.x.x or higher
```

**npm 10.x or higher**
```bash
npm --version
# Should show 10.x.x or higher
```

**Angular CLI 17.3.x**
```bash
npm install -g @angular/cli@17.3
ng version
```

### Download/Clone Project

Navigate to your project directory:
```bash
cd c:\Users\<your-username>\Projects\pharmaGenie
```

## Backend Setup

### 1. Navigate to Backend
```bash
cd pharma-genie-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Installation
```bash
npm list
# Should show:
# ├── express@5.x
# ├── natural@7.x
# ├── compromise@14.x
# ├── exceljs@4.x
# ├── fast-csv@5.x
# └── cors@2.x
```

### 4. Test Backend
```bash
npm start
```

Expected output:
```
🧬 PharmaGenie Backend Server
🚀 Server running on http://localhost:3000
✅ Loaded 8 clinical trials

✅ API Endpoints:
   GET  /api/health
   POST /api/chat
   GET  /api/trials
   GET  /api/trials/:id
   POST /api/export/csv
   POST /api/export/excel

🔍 Ready to process queries!
```

### 5. Test API
Open another terminal:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "trialsLoaded": 8,
  "timestamp": "2025-11-26T10:00:00.000Z"
}
```

Stop the server (Ctrl+C) and continue setup.

## NPM Package Setup

### 1. Navigate to Package
```bash
cd ..\pharma-genie-chatbot
```

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Build Package
```bash
npm run build
```

Expected output:
```
> pharma-genie-chatbot@1.0.0 build
> tsc && npm run copy-assets
```

### 4. Verify Build
```bash
dir dist
```

Should show:
```
dist/
├── index.js
├── index.d.ts
├── lib/
│   ├── components/
│   │   ├── chatbot.component.js
│   │   ├── chatbot.component.d.ts
│   │   ├── chatbot.component.html
│   │   └── chatbot.component.css
│   ├── services/
│   │   ├── pharma-genie.service.js
│   │   └── pharma-genie.service.d.ts
│   └── models/
│       ├── chat.models.js
│       └── chat.models.d.ts
```

### 5. Create NPM Link
```bash
npm link
```

Expected output:
```
added 1 package, and audited 4 packages in 1s
found 0 vulnerabilities
```

## Demo Application Setup

### 1. Navigate to Demo
```bash
cd ..\pharma-genie-demo
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Link Chatbot Package
```bash
npm link pharma-genie-chatbot
```

### 4. Verify Link
```bash
npm list pharma-genie-chatbot
```

Expected output:
```
pharma-genie-demo@0.0.0
└── pharma-genie-chatbot@1.0.0
```

### 5. Test Build
```bash
ng build
```

Expected output:
```
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial Chunk Files               | Names         |  Raw Size
main-XXXXXXXXXX.js                | main          | 134.05 kB | 
polyfills-XXXXXXXXXX.js           | polyfills     |  88.09 kB |
styles-XXXXXXXXXX.css             | styles        |  95 bytes |

Build at: 2025-11-26T10:00:00.000Z - Hash: XXXXXXXX
Time: XXXXms
```

## Verification

### 1. Start Backend
Terminal 1:
```bash
cd pharma-genie-backend
npm start
```

### 2. Start Demo
Terminal 2:
```bash
cd pharma-genie-demo
npm start
```

Expected output:
```
✔ Browser application bundle generation complete.

Initial chunk files | Names         |  Raw size
polyfills.js        | polyfills     |  88.09 kB |
main.js             | main          |  45.87 kB |
styles.css          | styles        |  95 bytes |

Application bundle generation complete. [3.205 seconds]

Watch mode enabled. Watching for file changes...
  ➜  Local:   http://localhost:4200/
```

### 3. Test Application

1. **Open Browser**: http://localhost:4200
2. **Verify UI**: Should see PharmaGenie landing page
3. **Click Chat Button**: Blue floating button in bottom-right
4. **Send Query**: Try "Show all active trials"
5. **Verify Response**: Should see trial results
6. **Test Export**: Click "Export CSV" or "Export Excel"

### 4. Verify All Endpoints

**Health Check**
```bash
curl http://localhost:3000/api/health
```

**Get All Trials**
```bash
curl http://localhost:3000/api/trials
```

**Process Query**
```bash
curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"query\":\"show active trials\"}"
```

## Troubleshooting

### Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
# In backend/server.js change: const PORT = 3001;
```

### NPM Link Not Working

**Error**: Cannot find module 'pharma-genie-chatbot'

**Solution**:
```bash
# Recreate link
cd pharma-genie-chatbot
npm unlink
npm link

cd ..\pharma-genie-demo
npm unlink pharma-genie-chatbot
npm link pharma-genie-chatbot
```

### Angular Build Errors

**Error**: TS-992012: Component imports must be standalone

**Solution**: Verify tsconfig.json has path mapping:
```json
{
  "compilerOptions": {
    "paths": {
      "pharma-genie-chatbot": ["../pharma-genie-chatbot/src/index.ts"]
    }
  }
}
```

### CORS Errors

**Error**: CORS policy blocked

**Solution**: Ensure backend CORS is configured:
```javascript
// backend/server.js
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
```

### Dependencies Vulnerabilities

**Warning**: npm audit shows vulnerabilities

**Solution**:
```bash
# Update dependencies
npm audit fix

# Force update (may break)
npm audit fix --force

# Or ignore dev dependencies warnings (safe)
```

### Module Not Found

**Error**: Cannot find module '@angular/core'

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Next Steps

After successful setup:

1. ✅ Read [User Guide](./USER-GUIDE.md) for usage instructions
2. ✅ Review [API Documentation](./API-DOCUMENTATION.md) for backend API
3. ✅ Check [NPM Package Guide](./NPM-PACKAGE-GUIDE.md) to use in other projects
4. ✅ Explore the code and customize as needed

## Production Deployment

For production deployment:

1. **Backend**: Deploy to cloud (AWS, Azure, Heroku)
2. **Database**: Migrate from JSON to MongoDB
3. **Frontend**: Build and deploy to static hosting
4. **NPM Package**: Publish to npm registry
5. **Security**: Enable HTTPS, add authentication

---

**Need Help?** Check the troubleshooting section or create an issue.
