# PharmaGenie Backend - MongoDB Integration Guide

## 🚀 Overview

PharmaGenie is an AI-powered clinical trials chatbot backend built with Node.js, Express, NLP, and MongoDB Atlas. It provides intelligent querying capabilities for clinical trial data using natural language processing.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [MongoDB Collections](#mongodb-collections)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [API Endpoints](#api-endpoints)
- [Usage Examples](#usage-examples)
- [Project Structure](#project-structure)

## ✨ Features

- 🤖 **Natural Language Processing** - Understand user queries using NLP
- 💾 **MongoDB Atlas Integration** - Cloud-based NoSQL database
- 🔍 **Advanced Search** - Full-text search across clinical trials
- 📊 **5 Comprehensive Collections** - Trials, Drugs, Sites, Participants, Adverse Events
- 📤 **Export Capabilities** - CSV and Excel export
- 🔗 **Relational Data** - Mongoose ODM with population support
- ⚡ **RESTful API** - Well-structured endpoints

## 🛠️ Tech Stack

- **Runtime:** Node.js 20.x
- **Framework:** Express.js 5.x
- **Database:** MongoDB Atlas (Cloud)
- **ODM:** Mongoose 9.x
- **NLP Libraries:** 
  - `natural` (8.x) - Tokenization, stemming
  - `compromise` (14.x) - Text parsing
- **Other:**
  - `dotenv` - Environment variables
  - `exceljs` - Excel generation
  - `csv-writer` - CSV generation

## 📦 MongoDB Collections

### 1. **Clinical Trials** (`clinical_trials`)
```javascript
{
  trialId: 'CT-2024-001',
  title: 'Phase III Study of ABC123...',
  drug: 'ABC123',
  phase: 'Phase III',
  status: 'Recruiting',
  indication: 'Type 2 Diabetes',
  sponsor: 'PharmaCorp International',
  enrollmentTarget: 500,
  currentEnrollment: 327,
  sites: [ObjectId],
  participants: [ObjectId],
  adverseEvents: [ObjectId]
}
```

### 2. **Drugs** (`drugs`)
```javascript
{
  drugId: 'ABC123',
  name: 'Glucomaxin',
  class: 'DPP-4 Inhibitor',
  mechanismOfAction: '...',
  indications: [],
  sideEffects: [],
  approvalStatus: {},
  clinicalTrials: [ObjectId]
}
```

### 3. **Trial Sites** (`trial_sites`)
```javascript
{
  siteId: 'SITE-001',
  name: 'Medical Research Institute',
  type: 'Research Center',
  address: {},
  capabilities: {},
  activeClinicalTrials: []
}
```

### 4. **Participants** (`participants`)
```javascript
{
  participantId: 'P-2024-0001',
  trial: ObjectId,
  site: ObjectId,
  demographics: {},
  enrollmentInfo: {},
  medicalHistory: {},
  compliance: {}
}
```

### 5. **Adverse Events** (`adverse_events`)
```javascript
{
  eventId: 'AE-2024-00001',
  trial: ObjectId,
  participant: ObjectId,
  eventDetails: {},
  timing: {},
  causality: {},
  reporting: {}
}
```

## 📋 Prerequisites

- Node.js >= 20.x
- npm or yarn
- MongoDB Atlas account
- Git

## 📥 Installation

1. **Clone the repository**
```bash
cd c:\Users\ashishmahadeo.nagha\Projects\pharmaGenie\pharma-genie-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Verify installation**
```bash
npm list
```

## ⚙️ Configuration

### 1. **Set up MongoDB Atlas**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (or use existing)
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string

### 2. **Configure Environment Variables**

Update `.env` file with your MongoDB credentials:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@pharmageniedb.xxxxx.mongodb.net/pharmaGenie?retryWrites=true&w=majority
MONGODB_DB_NAME=pharmaGenie

# Server Configuration
PORT=3000
NODE_ENV=development

# OpenAI Configuration (Optional - for enhanced NLP)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
```

**Important:** Replace `<username>`, `<password>`, and `xxxxx` with your actual MongoDB Atlas credentials.

### 3. **Connection String Format**

```
mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

## 🗄️ Database Setup

### Seed the Database

Populate MongoDB with sample data:

```bash
npm run seed
```

**Expected Output:**
```
🌱 Starting database seeding...
✅ MongoDB Atlas connected successfully
🗑️  Clearing existing data...
💊 Seeding Drugs collection...
✅ Inserted 5 drugs
🏥 Seeding Trial Sites collection...
✅ Inserted 3 trial sites
🔬 Seeding Clinical Trials collection...
✅ Inserted 8 clinical trials
👥 Seeding Participants collection...
✅ Inserted 2 participants
⚠️  Seeding Adverse Events collection...
✅ Inserted 2 adverse events
🎉 Database seeding completed successfully!
```

### Verify Data

```bash
# Start the server
npm start

# Check health endpoint
curl http://localhost:3000/api/health
```

## 🌐 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "PharmaGenie Backend",
  "version": "2.0.0",
  "database": "MongoDB Atlas",
  "collections": {
    "trials": 8,
    "drugs": 5,
    "sites": 3
  }
}
```

### Chat (NLP Query)
```http
POST /api/chat
Content-Type: application/json

{
  "query": "Show me all active phase 3 trials for diabetes"
}
```

**Response:**
```json
{
  "type": "list",
  "content": "Found 2 clinical trials:",
  "trials": [
    {
      "trialId": "CT-2024-001",
      "title": "Phase III Study of ABC123...",
      "drug": "ABC123",
      "phase": "Phase III",
      "status": "Recruiting",
      "indication": "Type 2 Diabetes"
    }
  ]
}
```

### Get All Trials
```http
GET /api/trials
```

### Get Specific Trial
```http
GET /api/trials/CT-2024-001
```

**Response includes populated references:**
```json
{
  "trialId": "CT-2024-001",
  "title": "...",
  "sites": [
    {
      "name": "Medical Research Institute",
      "address": { "city": "Boston", "country": "USA" }
    }
  ],
  "participants": [...],
  "adverseEvents": [...]
}
```

### Export to CSV
```http
POST /api/export/csv
Content-Type: application/json

{
  "data": [...]
}
```

### Export to Excel
```http
POST /api/export/excel
Content-Type: application/json

{
  "data": [...]
}
```

## 💡 Usage Examples

### Query Examples

1. **List trials by status:**
```
"Show me all active trials"
"List completed studies"
"Find recruiting trials"
```

2. **Search by phase:**
```
"Phase 2 trials"
"Show phase III studies"
```

3. **Search by indication:**
```
"Diabetes trials"
"Cancer research"
"COVID-19 studies"
```

4. **Search by drug:**
```
"Trials for ABC123"
"Studies using XYZ789"
```

5. **Count queries:**
```
"How many trials are recruiting?"
"Total number of phase 3 trials"
```

6. **Specific trial:**
```
"Show me CT-2024-001"
"Details for trial CT-2024-003"
```

## 📁 Project Structure

```
pharma-genie-backend/
├── config/
│   └── database.js          # MongoDB connection config
├── models/
│   ├── ClinicalTrial.js     # Trial schema
│   ├── Drug.js              # Drug schema
│   ├── TrialSite.js         # Site schema
│   ├── Participant.js       # Participant schema
│   ├── AdverseEvent.js      # Adverse event schema
│   └── index.js             # Model exports
├── exports/                 # Generated export files
├── nlp-service.js           # NLP processing logic
├── server.js                # Express server & routes
├── seed.js                  # Database seeding script
├── .env                     # Environment variables
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── README.md               # This file
```

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Seed Database
```bash
npm run seed
```

## 🔍 Query Processing Flow

1. **User Query** → `POST /api/chat`
2. **NLP Analysis** → Intent + Entity + Keyword extraction
3. **MongoDB Query** → Build query from analysis
4. **Population** → Load related data (sites, participants)
5. **Format Response** → Structure for frontend
6. **Return JSON** → Send to client

## 🎯 NLP Capabilities

### Intent Detection
- `list` - Show trials
- `count` - Count results
- `status` - Filter by status
- `filter` - Complex filtering
- `export` - Export data
- `specific` - Specific trial lookup

### Entity Extraction
- Trial IDs (CT-YYYY-NNN)
- Phases (I, II, III, IV)
- Status (Active, Recruiting, Completed)
- Drugs (ABC123, XYZ789)
- Indications (Diabetes, Cancer, etc.)

### Keyword Processing
- Stopword removal
- Tokenization
- Relevance filtering

## 🔗 MongoDB Indexes

Optimized queries with indexes on:
- `trialId` (unique)
- `status`, `phase`, `drug` (filtered searches)
- `indication` (disease searches)
- Text indexes on `title`, `description` (full-text search)

## 📊 Sample Data

The seed script includes:
- **8 Clinical Trials** across different phases and indications
- **5 Drugs** with comprehensive details
- **3 Trial Sites** with location and capabilities
- **2 Participants** with medical history
- **2 Adverse Events** with reporting details

## 🛡️ Error Handling

- MongoDB connection errors
- Query validation
- Data not found (404)
- Server errors (500)
- Invalid input (400)

## 🔐 Security Best Practices

1. **Never commit `.env` file**
2. **Use environment variables** for sensitive data
3. **Whitelist IP addresses** in MongoDB Atlas
4. **Use strong passwords** for database users
5. **Enable authentication** in production

## 📝 License

ISC

## 👨‍💻 Author

PharmaGenie Development Team

## 🤝 Contributing

For contributions, please create a pull request or open an issue.

---

**Built with ❤️ using Node.js, Express, MongoDB, and NLP**
