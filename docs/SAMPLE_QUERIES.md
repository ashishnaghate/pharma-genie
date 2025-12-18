# PharmaGenie Chatbot - Sample Queries

This document contains 50 sample queries to test the PharmaGenie chatbot across all 5 MongoDB collections (Clinical Trials, Drugs, Trial Sites, Participants, and Adverse Events).

---

## 📋 Clinical Trials Queries (20 queries)

### Status-Based Queries
1. `Show all active clinical trials`
2. `List recruiting trials`
3. `Find completed studies`
4. `Show suspended trials`
5. `What trials are currently active?`

### Phase-Based Queries
6. `Find Phase III diabetes studies`
7. `Show Phase I cancer trials`
8. `List Phase II trials`
9. `Phase III hypertension studies`
10. `Show all Phase I studies`

### Disease/Indication Queries
11. `Diabetes clinical trials`
12. `Cancer research studies`
13. `Hypertension trials`
14. `Alzheimer's disease studies`
15. `COVID-19 clinical trials`
16. `Migraine prevention studies`
17. `Rheumatoid arthritis trials`
18. `Depression treatment trials`

### Specific Trial Queries
19. `Show me CT-2024-001`
20. `Find trial CT-2024-007`

---

## 💊 Drug Queries (10 queries)

### Drug Information
21. `Show me drug ABC123`
22. `Tell me about XYZ789`
23. `Information on DEF456`
24. `Drug GHI101 details`
25. `Show drug JKL202`

### Drug Class & Approval
26. `Show all FDA approved drugs`
27. `List DPP-4 inhibitor medications`
28. `JAK inhibitor drugs`
29. `Tyrosine kinase inhibitors`
30. `Show drugs with EMA approval`

---

## 🏥 Trial Site Queries (8 queries)

### Location-Based
31. `Trial sites in Boston`
32. `Show facilities in New York`
33. `List sites in Los Angeles`
34. `Research centers in USA`

### Site Capabilities
35. `Show all trial sites`
36. `Sites with MRI equipment`
37. `Centers with high capacity`
38. `Active research facilities`

---

## 👥 Participant Queries (6 queries)

### Demographics & Enrollment
39. `Show enrolled participants`
40. `List active participants`
41. `Participant demographics`
42. `Show patients in trials`
43. `Male participants in studies`
44. `Participants with diabetes`

---

## ⚠️ Adverse Event Queries (6 queries)

### Safety & Severity
45. `Show serious adverse events`
46. `List all side effects reported`
47. `Moderate adverse events`
48. `Safety events in trials`
49. `Show adverse reactions`
50. `Mild side effects reported`

---

## 🔄 Combined Multi-Collection Queries

### Bonus Queries (Testing Multiple Collections)
- `Show trials for drug ABC123 at Boston sites`
- `List all Phase III trials with participants`
- `Active diabetes trials with serious adverse events`
- `Phase II cancer studies with DEF456`
- `Recruiting trials in New York facilities`
- `Hypertension drug XYZ789 trial results`
- `Show participants in COVID-19 trials`
- `Sites conducting Alzheimer's research`
- `Phase I studies with mild side effects`
- `Active trials with high enrollment`

---

## 📊 Count & Statistical Queries

### Aggregation Queries
- `How many trials are recruiting?`
- `Total number of active studies`
- `Count of Phase III trials`
- `How many participants enrolled?`
- `Number of serious adverse events`
- `Count of FDA approved drugs`
- `How many trial sites are active?`
- `Total completed trials`

---

## 🎯 Query Categories Summary

| Category | Count | Collections Used |
|----------|-------|------------------|
| Clinical Trials | 20 | `clinical_trials` |
| Drugs | 10 | `drugs` |
| Trial Sites | 8 | `trial_sites` |
| Participants | 6 | `participants` |
| Adverse Events | 6 | `adverse_events` |
| **Total** | **50** | **All 5 Collections** |

---

## 💡 Tips for Best Results

1. **Be Specific**: Use trial IDs (CT-2024-XXX), drug codes (ABC123), or specific terms
2. **Use Keywords**: Include terms like "show", "list", "find", "active", "recruiting"
3. **Combine Filters**: Mix status, phase, and disease (e.g., "active Phase III diabetes")
4. **Natural Language**: The chatbot understands conversational queries
5. **Export Data**: After viewing results, use CSV/Excel export buttons

---

## 🔍 Advanced Search Examples

### Complex Queries
- `Show active Phase III diabetes trials with drug ABC123`
- `List recruiting cancer studies at Boston Medical Research Institute`
- `Find completed COVID-19 trials with serious adverse events`
- `Phase II hypertension trials with participants over 40`
- `Show all trials at sites with capacity over 150`

### Text Search
- `Metformin diabetes management`
- `Blood pressure reduction studies`
- `Tumor growth inhibition`
- `Depression treatment efficacy`
- `Pain relief mechanisms`

---

## 📈 Expected Response Types

| Query Type | Response Format | Data Display |
|------------|----------------|--------------|
| Single Result | Detail View | Trial card with full information |
| Multiple Results | List View | Cards for each trial/item |
| Count Query | Text Response | Summary with count |
| No Results | Error Message | Suggestion to try different terms |

---

## 🚀 Getting Started

1. Open the chatbot at `http://localhost:4200`
2. Type any query from the list above
3. View formatted results with trial cards
4. Export data using CSV or Excel buttons
5. Try combining multiple filters for advanced searches

---

*Last Updated: December 3, 2025*
*PharmaGenie v2.0.0 - Multi-Collection MongoDB Integration*
