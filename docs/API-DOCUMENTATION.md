# 🔌 API Documentation - PharmaGenie Backend

Complete reference for the PharmaGenie Backend API.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API does not require authentication. For production, implement JWT or OAuth2.

## Endpoints

### 1. Health Check

Check if the API is running and how many trials are loaded.

**Endpoint**: `GET /api/health`

**Response**:
```json
{
  "status": "healthy",
  "trialsLoaded": 8,
  "timestamp": "2025-11-26T10:00:00.000Z"
}
```

**Status Codes**:
- `200 OK` - Server is healthy
- `500 Internal Server Error` - Server issue

**Example**:
```bash
curl http://localhost:3000/api/health
```

---

### 2. Process Chat Query

Send a natural language query and get intelligent results.

**Endpoint**: `POST /api/chat`

**Request Body**:
```json
{
  "query": "show all active trials"
}
```

**Response**:
```json
{
  "query": "show all active trials",
  "analysis": {
    "intent": "list",
    "entities": {
      "status": ["active"],
      "phase": [],
      "indication": [],
      "trialId": [],
      "drug": []
    },
    "keywords": ["show", "active", "trials"]
  },
  "resultsCount": 4,
  "response": {
    "type": "list",
    "content": "Found 4 active clinical trials:",
    "trials": [...]
  },
  "data": [...],
  "format": "text"
}
```

**Response Fields**:
- `query`: Original user query
- `analysis`: NLP analysis results
  - `intent`: Detected intent (list, count, detail, export)
  - `entities`: Extracted entities
  - `keywords`: Identified keywords
- `resultsCount`: Number of matching trials
- `response`: Formatted response
  - `type`: Response type (text, list, detailed, table)
  - `content`: Human-readable message
  - `trials`: Array of matching trials (for list type)
  - `trial`: Single trial object (for detailed type)
- `data`: Raw trial data
- `format`: Output format preference

**Status Codes**:
- `200 OK` - Query processed successfully
- `400 Bad Request` - Missing or invalid query
- `500 Internal Server Error` - Processing error

**Example**:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"show active trials"}'
```

---

### 3. Get All Trials

Retrieve all clinical trials in the database.

**Endpoint**: `GET /api/trials`

**Response**:
```json
{
  "count": 8,
  "trials": [
    {
      "id": "NCT001",
      "title": "Efficacy Study of ABC123 in Type 2 Diabetes",
      "sponsor": "PharmaCorp Inc.",
      "drug": "ABC123",
      "indication": "Type 2 Diabetes",
      "phase": "Phase III",
      "status": "Active",
      "startDate": "2024-01-15",
      "endDate": "2026-12-31",
      "enrollmentTarget": 500,
      "enrollmentCurrent": 450,
      "sites": ["New York General Hospital", "Boston Medical Center"],
      "primaryOutcome": "HbA1c reduction after 12 weeks",
      "adverseEvents": 12,
      "studyType": "Interventional"
    },
    ...
  ]
}
```

**Status Codes**:
- `200 OK` - Trials retrieved successfully
- `500 Internal Server Error` - Database error

**Example**:
```bash
curl http://localhost:3000/api/trials
```

---

### 4. Get Trial by ID

Retrieve a specific trial by its ID.

**Endpoint**: `GET /api/trials/:id`

**Parameters**:
- `id` (path): Trial ID (e.g., NCT001, ABC-2024-001)

**Response**:
```json
{
  "id": "NCT001",
  "title": "Efficacy Study of ABC123 in Type 2 Diabetes",
  "sponsor": "PharmaCorp Inc.",
  "drug": "ABC123",
  "indication": "Type 2 Diabetes",
  "phase": "Phase III",
  "status": "Active",
  "startDate": "2024-01-15",
  "endDate": "2026-12-31",
  "enrollmentTarget": 500,
  "enrollmentCurrent": 450,
  "sites": ["New York General Hospital", "Boston Medical Center"],
  "primaryOutcome": "HbA1c reduction after 12 weeks",
  "adverseEvents": 12,
  "studyType": "Interventional"
}
```

**Status Codes**:
- `200 OK` - Trial found
- `404 Not Found` - Trial ID doesn't exist
- `500 Internal Server Error` - Server error

**Example**:
```bash
curl http://localhost:3000/api/trials/NCT001
```

---

### 5. Export to CSV

Export trial data to CSV format.

**Endpoint**: `POST /api/export/csv`

**Request Body**:
```json
{
  "data": [
    {
      "id": "NCT001",
      "title": "Efficacy Study...",
      ...
    }
  ]
}
```

**Response**: Binary CSV file

**Headers**:
```
Content-Type: text/csv
Content-Disposition: attachment; filename="clinical-trials.csv"
```

**CSV Format**:
```csv
ID,Title,Sponsor,Drug,Indication,Phase,Status,Start Date,End Date,Enrollment Target,Enrollment Current,Sites,Primary Outcome,Adverse Events,Study Type
NCT001,Efficacy Study of ABC123...,PharmaCorp Inc.,ABC123,Type 2 Diabetes,Phase III,Active,2024-01-15,2026-12-31,500,450,"New York General Hospital, Boston Medical Center",HbA1c reduction after 12 weeks,12,Interventional
```

**Status Codes**:
- `200 OK` - CSV generated successfully
- `400 Bad Request` - No data provided
- `500 Internal Server Error` - Export error

**Example**:
```bash
curl -X POST http://localhost:3000/api/export/csv \
  -H "Content-Type: application/json" \
  -d '{"data":[...]}' \
  -o trials.csv
```

---

### 6. Export to Excel

Export trial data to Excel format.

**Endpoint**: `POST /api/export/excel`

**Request Body**:
```json
{
  "data": [
    {
      "id": "NCT001",
      "title": "Efficacy Study...",
      ...
    }
  ]
}
```

**Response**: Binary Excel file (.xlsx)

**Headers**:
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="clinical-trials.xlsx"
```

**Excel Features**:
- Professional formatting
- Bold headers
- Auto-sized columns
- Filter enabled on header row
- Color-coded status cells

**Status Codes**:
- `200 OK` - Excel generated successfully
- `400 Bad Request` - No data provided
- `500 Internal Server Error` - Export error

**Example**:
```bash
curl -X POST http://localhost:3000/api/export/excel \
  -H "Content-Type: application/json" \
  -d '{"data":[...]}' \
  -o trials.xlsx
```

---

## Data Models

### Trial Object

```typescript
interface Trial {
  id: string;                    // Unique identifier
  title: string;                 // Full study title
  sponsor: string;               // Organization sponsoring the trial
  drug: string;                  // Drug being tested
  indication: string;            // Disease/condition being treated
  phase: string;                 // Study phase (Phase I, II, III, IV)
  status: string;                // Current status (Active, Recruiting, Completed, Suspended)
  startDate: string;             // Start date (YYYY-MM-DD)
  endDate: string;               // End date (YYYY-MM-DD)
  enrollmentTarget: number;      // Target number of participants
  enrollmentCurrent: number;     // Current enrolled participants
  sites?: string[];              // Study locations
  primaryOutcome?: string;       // Primary outcome measure
  adverseEvents?: number;        // Number of adverse events reported
  studyType?: string;            // Type of study (Interventional, Observational)
}
```

### Chat Query

```typescript
interface ChatQuery {
  query: string;                 // Natural language query
}
```

### Chat Response

```typescript
interface ChatResponse {
  query: string;                 // Original query
  analysis: {
    intent: string;              // Detected intent
    entities: {
      status: string[];
      phase: string[];
      indication: string[];
      trialId: string[];
      drug: string[];
    };
    keywords: string[];
  };
  resultsCount: number;          // Number of results
  response: {
    type: string;                // Response type
    content: string;             // Human-readable message
    trials?: Trial[];            // List of trials (for list type)
    trial?: Trial;               // Single trial (for detail type)
  };
  data: Trial[];                 // Raw data
  format: string;                // Format preference
}
```

### Export Request

```typescript
interface ExportRequest {
  data: Trial[];                 // Array of trials to export
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Query is required"
}
```

### 404 Not Found
```json
{
  "error": "Trial not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Implement rate limiting (e.g., 100 requests per minute)
- Use Redis for distributed rate limiting
- Return 429 Too Many Requests when exceeded

## CORS

CORS is configured to allow requests from:
```
http://localhost:4200
```

For production, update CORS configuration:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true
}));
```

## Testing the API

### Using curl

```bash
# Health check
curl http://localhost:3000/api/health

# Get all trials
curl http://localhost:3000/api/trials

# Get specific trial
curl http://localhost:3000/api/trials/NCT001

# Process query
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"show active trials"}'
```

### Using Postman

1. Import the API endpoints
2. Set base URL to `http://localhost:3000`
3. Create requests for each endpoint
4. Test different query variations

### Using JavaScript

```javascript
// Process query
fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: 'show active trials' })
})
.then(res => res.json())
.then(data => console.log(data));
```

## Production Considerations

### Security
- [ ] Add authentication (JWT/OAuth2)
- [ ] Implement rate limiting
- [ ] Enable HTTPS
- [ ] Sanitize inputs
- [ ] Add request validation

### Performance
- [ ] Add caching (Redis)
- [ ] Implement pagination
- [ ] Optimize database queries
- [ ] Add compression
- [ ] Use CDN for static assets

### Monitoring
- [ ] Add logging (Winston/Morgan)
- [ ] Implement error tracking (Sentry)
- [ ] Add health checks
- [ ] Monitor API performance
- [ ] Set up alerts

### Database
- [ ] Migrate from JSON to MongoDB
- [ ] Add database indexes
- [ ] Implement connection pooling
- [ ] Add backup strategy
- [ ] Implement data validation

---

**Need help? Check the [Setup Guide](./SETUP-GUIDE.md) or [User Guide](./USER-GUIDE.md)**
