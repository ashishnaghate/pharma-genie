# 📖 User Guide - PharmaGenie Chatbot

Learn how to use the PharmaGenie chatbot to query clinical trials data.

## 🎯 Overview

PharmaGenie is an intelligent chatbot that understands natural language queries about pharmaceutical clinical trials. It uses NLP to interpret your questions and provide relevant results.

## 🚀 Getting Started

### Accessing the Chatbot

1. Open your browser to http://localhost:4200
2. You'll see the PharmaGenie landing page
3. Look for the **blue floating chat button** in the bottom-right corner
4. Click the button to open the chat window

### Chat Interface

The chatbot window includes:
- **Header**: Shows "PharmaGenie - Clinical Trials Assistant"
- **Chat Body**: Displays conversation history
- **Input Field**: Type your questions here
- **Send Button**: Click or press Enter to send
- **Clear Button**: Resets the conversation

## 💬 Supported Query Types

### 1. List Queries

Show all trials or specific subsets:

```
"Show all trials"
"List all clinical studies"
"Display all trials"
"Give me all studies"
```

**Response**: Returns all trials in a list format with export options.

### 2. Filter by Status

Find trials by their current status:

```
"Show active trials"
"List recruiting studies"
"Find completed trials"
"Show suspended studies"
```

**Supported Statuses**:
- Active
- Recruiting
- Completed
- Suspended

### 3. Filter by Phase

Find trials in specific research phases:

```
"Show Phase III trials"
"List Phase II studies"
"Find Phase I trials"
"Phase III studies only"
```

**Supported Phases**:
- Phase I
- Phase II
- Phase III
- Phase IV

### 4. Filter by Indication

Search for trials targeting specific diseases:

```
"Show diabetes trials"
"Find Alzheimer's studies"
"List cancer trials"
"Hypertension studies"
```

**Sample Indications**:
- Type 2 Diabetes
- Alzheimer's Disease
- Hypertension
- Breast Cancer
- COPD

### 5. Filter by Drug

Find trials testing specific medications:

```
"Show trials for drug ABC123"
"Find studies using XYZ789"
"List trials testing DrugName"
```

### 6. Combination Filters

Combine multiple criteria:

```
"Show active Phase III diabetes trials"
"Find recruiting Alzheimer's studies"
"List completed cancer trials"
"Active Phase II trials for ABC123"
```

### 7. Count Queries

Get the number of trials matching criteria:

```
"How many trials?"
"Count active studies"
"How many Phase III trials?"
"Total completed trials"
```

**Response**: Returns a count with breakdown.

### 8. Detail Queries

Get detailed information about specific trials:

```
"Tell me about NCT001"
"Details for trial ABC-2024-001"
"Show me trial NCT005"
"Info about ABC-2024-003"
```

**Response**: Returns comprehensive trial details including:
- Full title
- Sponsor
- Drug name
- Indication
- Phase
- Status
- Start/End dates
- Enrollment (current/target)
- Study sites
- Primary outcome
- Adverse events

### 9. Export Queries

Export results to different formats:

```
"Export to CSV"
"Download as Excel"
"Save to CSV"
"Export to Excel"
```

**Response**: Downloads file with trial data.

## 📊 Understanding Results

### List View

Trials are displayed as cards showing:
- **Trial ID**: Unique identifier
- **Status Badge**: Color-coded status (Active=green, Completed=blue, Recruiting=yellow, Suspended=red)
- **Title**: Full study title
- **Metadata**: Drug • Phase • Indication

Example:
```
┌─────────────────────────────────────┐
│ NCT001                    [Active]  │
│ Efficacy of ABC123 in Type 2        │
│ Diabetes                            │
│ ABC123 • Phase III • Type 2 Diabetes│
└─────────────────────────────────────┘
```

### Detail View

Detailed information formatted as:
```
Trial ID: NCT001
Title: Efficacy Study of ABC123 in Type 2 Diabetes
Sponsor: PharmaCorp Inc.
Drug: ABC123
Indication: Type 2 Diabetes
Phase: Phase III
Status: Active
Start Date: 2024-01-15
End Date: 2026-12-31
Enrollment: 450/500
Sites: New York General Hospital, Boston Medical Center
Primary Outcome: HbA1c reduction after 12 weeks
Adverse Events: 12
```

### Export Formats

**CSV Format**:
```csv
ID,Title,Sponsor,Drug,Indication,Phase,Status,StartDate,EndDate,Enrollment
NCT001,Efficacy Study...,PharmaCorp Inc.,ABC123,Type 2 Diabetes,Phase III,Active,2024-01-15,2026-12-31,450/500
```

**Excel Format**:
- Professional formatting
- Headers in bold
- Color-coded status
- Auto-sized columns
- Filters enabled

## 🎓 Best Practices

### Writing Effective Queries

**DO**:
- ✅ Use natural language: "Show me active trials"
- ✅ Be specific: "Phase III diabetes studies"
- ✅ Use common terms: "recruiting", "completed", "active"
- ✅ Combine filters: "active Phase III trials"

**DON'T**:
- ❌ Use complex SQL syntax
- ❌ Include special characters unnecessarily
- ❌ Use ambiguous abbreviations
- ❌ Write overly long queries

### Example Conversation

```
User: "Hello"
Bot: "Hello! I'm PharmaGenie. Ask me about clinical trials..."

User: "Show all active trials"
Bot: "Found 4 active clinical trials:" [Shows list with export buttons]

User: "Tell me about NCT001"
Bot: [Shows detailed information about NCT001]

User: "Export to Excel"
Bot: [Downloads Excel file]
```

## 💡 Tips & Tricks

### Quick Filters

- **Status**: Just type the status name (e.g., "active", "recruiting")
- **Phase**: Include "Phase" followed by number (e.g., "Phase III")
- **Count**: Start with "how many" or "count"

### Export Options

After any list query, you'll see export buttons:
- **📄 Export CSV**: Plain text, comma-separated
- **📊 Export Excel**: Formatted spreadsheet

Click the button to download instantly.

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift+Enter**: New line in message
- **Esc**: Close chat window (if implemented)

## ❓ Common Questions

**Q: What data is included in the system?**
A: Currently 8 sample clinical trials covering various phases, indications, and statuses.

**Q: Can I search by sponsor?**
A: Not directly, but you can filter by other criteria and review the sponsor in results.

**Q: How recent is the data?**
A: Sample data is static. In production, this would connect to a live database.

**Q: Can I export filtered results?**
A: Yes! Any list query includes export buttons for CSV and Excel.

**Q: What if my query doesn't work?**
A: Try rephrasing it using simpler terms or break it into multiple queries.

**Q: Can I see trial history?**
A: The chat shows conversation history. Use the Clear button to start fresh.

## 🔍 Sample Queries

Try these queries to explore the chatbot:

```
1. "Show all trials"
2. "Find active trials"
3. "How many Phase III studies?"
4. "Show diabetes trials"
5. "Active Phase III trials"
6. "Details about NCT001"
7. "Export to Excel"
8. "Count completed trials"
9. "Show recruiting studies"
10. "Phase II trials for ABC123"
```

## 🚨 Troubleshooting

### No Results

**Issue**: Query returns "No trials found"

**Solutions**:
- Check spelling of disease names
- Use common phase names (Phase I, II, III, IV)
- Try broader queries first
- Verify the backend is running

### Slow Response

**Issue**: Chatbot takes long to respond

**Solutions**:
- Check backend server is running (http://localhost:3000)
- Verify network connection
- Refresh the page
- Check browser console for errors

### Export Not Working

**Issue**: Export buttons don't download files

**Solutions**:
- Ensure backend server is running
- Check browser popup blockers
- Verify file download permissions
- Try a different browser

## 📞 Need Help?

- Check the [Setup Guide](./SETUP-GUIDE.md) for installation issues
- Review [API Documentation](./API-DOCUMENTATION.md) for technical details
- Create an issue on GitHub for bugs

---

**Happy Querying! 🧬**
