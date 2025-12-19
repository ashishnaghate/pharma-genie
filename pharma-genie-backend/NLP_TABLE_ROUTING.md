# NLP Chatbot - Table-Specific Query Routing

## Summary of Changes

As a Senior Fullstack Architect and NLP Developer, I've implemented intelligent table-specific query routing to ensure the NLP chatbot returns only relevant data based on user intent.

## Problem

Previously, the NLP service was querying **all 5 database tables** (ClinicalTrial, Drug, TrialSite, Participant, AdverseEvent) for every query, regardless of the user's intent. This resulted in:
- Inefficient database queries
- Irrelevant data in responses
- Slower response times
- Confusing user experience

## Solution

### 1. **Intelligent Collection Detection** (`detectCollections` method)

Implemented a priority-based pattern matching system that analyzes user queries and routes them to specific tables:

```javascript
// Example: "Show all active clinical trials" → Only queries ClinicalTrial table
// Example: "List all drugs" → Only queries Drug table
// Example: "How many participants are enrolled?" → Only queries Participant table
```

#### Detection Patterns (Priority Order):

1. **Drugs** - Detects: drug, medication, compound, pharmaceutical, drug codes (ABC123)
2. **Sites** - Detects: site, location, facility, hospital, clinic, city, country
3. **Participants** - Detects: participant, patient, subject, enrollment, demographics
4. **Adverse Events** - Detects: adverse, side effect, safety, serious, severity
5. **Clinical Trials** - Detects: trial, study, phase, protocol, status (active/completed)

### 2. **Conditional Table Querying** (`matchTrials` method)

Modified the query execution logic to:
- Only query tables that were detected in the user's intent
- Skip irrelevant tables completely
- Return empty arrays for non-queried collections

```javascript
// BEFORE: Always queried all 5 tables
const collections = ['trials', 'drugs', 'sites', 'participants', 'adverseEvents'];

// AFTER: Only query relevant tables
const collections = analysis.collections; // e.g., ['trials'] for trial-specific queries
```

## Test Results

All test cases pass successfully:

| Query | Collections Queried | Result |
|-------|-------------------|---------|
| "Show all active clinical trials" | `['trials']` | ✅ Only Clinical Trials |
| "List all drugs in database" | `['drugs']` | ✅ Only Drugs |
| "Show all trial sites in New York" | `['sites', 'trials']` | ✅ Sites + Trials |
| "How many participants are enrolled?" | `['participants']` | ✅ Only Participants |
| "Show all serious adverse events" | `['adverseEvents']` | ✅ Only Adverse Events |
| "Show trials with drug ABC123 and their sites" | `['drugs', 'sites', 'trials']` | ✅ Multiple relevant tables |
| "Find Phase III diabetes studies" | `['trials']` | ✅ Only Trials with filters |
| "Show me everything" | `['trials']` | ✅ Default to Trials |

## Benefits

✅ **Performance**: Reduced database queries by 60-80% for specific queries  
✅ **Relevance**: Users only see data relevant to their question  
✅ **Scalability**: Better resource utilization as database grows  
✅ **User Experience**: Faster, more accurate responses  

## Example Usage

```bash
# Test the routing logic
cd pharma-genie-backend
node test-nlp-routing.js

# Start the backend to see it in action
npm start
```

Then try these queries in the chatbot:
- "Show all active clinical trials" → Only trials data
- "List all drugs" → Only drugs data
- "How many participants?" → Only participants data

## Technical Implementation

### Files Modified:
- [`nlp-service.js`](pharma-genie-backend/nlp-service.js) - Updated `detectCollections()` and `matchTrials()` methods

### Files Created:
- [`test-nlp-routing.js`](pharma-genie-backend/test-nlp-routing.js) - Comprehensive test suite

## Architecture Pattern

```
User Query → NLP Analysis → Intent Detection → Collection Selection → Targeted DB Queries → Relevant Results
     ↓              ↓               ↓                    ↓                     ↓                    ↓
"Show active    Extract       Detect          Select only      Query only      Return only
 trials"        keywords      'trials'        ClinicalTrial    that table      trial data
```

---

**Implemented by**: Senior Fullstack Architect & NLP Developer  
**Date**: December 18, 2025  
**Impact**: ⚡ Faster queries, 🎯 Precise results, 💯 Better UX
