import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import database from './config/database.js';
import { ClinicalTrial, Drug, TrialSite, Participant, AdverseEvent } from './models/index.js';
import NLPService from './nlp-service.js';
import genaiRoutes from './routes/genai.routes.js';
import { requestLogger, errorLogger, errorHandler } from './middleware/logger.middleware.js';
import { exportToCSV, exportToExcel, exportMultiCollectionToExcel, getSingleCollectionType } from './utils/export-utils.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use((req, res, next) => {
  console.log(`\ud83d\udfe2 Incoming request: ${req.method} ${req.url}`);
  next();
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);

const nlpService = new NLPService();

// Connect to MongoDB
await database.connect();

app.get('/api/health', async (req, res) => {
  try {
    const trialsCount = await ClinicalTrial.countDocuments();
    const drugsCount = await Drug.countDocuments();
    const sitesCount = await TrialSite.countDocuments();
    
    res.json({ 
      status: 'healthy', 
      service: 'PharmaGenie Backend',
      version: '2.0.0',
      database: 'MongoDB Atlas',
      collections: {
        trials: trialsCount,
        drugs: drugsCount,
        sites: sitesCount
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ 
        error: 'Query is required',
        type: 'error'
      });
    }

    console.log('Processing query:', query);

    const analysis = nlpService.analyzeQuery(query);
    console.log('NLP Analysis:', JSON.stringify(analysis, null, 2));

    const results = await nlpService.matchTrials(analysis);
    console.log(`Found results from collections:`, {
      trials: results.trials?.length || 0,
      drugs: results.drugs?.length || 0,
      sites: results.sites?.length || 0,
      participants: results.participants?.length || 0,
      adverseEvents: results.adverseEvents?.length || 0
    });

    const response = formatResponse(query, results, analysis);
    console.log('Response type:', response.type);
    console.log('Response content:', response.content);

    res.json(response);

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process query',
      message: error.message,
      type: 'error'
    });
  }
});

app.post('/api/export/csv', async (req, res) => {
  try {
    const { data, collectionType, responseData } = req.body;

    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // If responseData is provided (multi-collection), check if it's from single collection
    if (responseData) {
      const singleType = getSingleCollectionType(responseData);
      
      if (singleType && responseData[singleType].length > 1) {
        // Single collection with multiple records - export as CSV
        const filename = `${singleType}-${Date.now()}.csv`;
        const csvPath = path.join(exportsDir, filename);
        
        await exportToCSV(responseData[singleType], singleType, csvPath);
        
        res.download(csvPath, filename, (err) => {
          if (err) console.error('Error downloading file:', err);
          fs.unlinkSync(csvPath);
        });
      } else {
        return res.status(400).json({ 
          error: 'CSV export is only available for single collection with multiple records. Use Excel for multi-collection data.' 
        });
      }
    } else if (data && collectionType) {
      // Legacy support - direct data export
      const filename = `${collectionType}-${Date.now()}.csv`;
      const csvPath = path.join(exportsDir, filename);
      
      await exportToCSV(data, collectionType, csvPath);
      
      res.download(csvPath, filename, (err) => {
        if (err) console.error('Error downloading file:', err);
        fs.unlinkSync(csvPath);
      });
    } else {
      return res.status(400).json({ error: 'Invalid export request' });
    }

  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Error exporting CSV', message: error.message });
  }
});

app.post('/api/export/excel', async (req, res) => {
  try {
    const { data, collectionType, responseData } = req.body;

    // Ensure exports directory exists
    const exportsDir = path.join(__dirname, 'exports');
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir, { recursive: true });
    }

    // If responseData is provided (multi-collection or single collection)
    if (responseData) {
      const singleType = getSingleCollectionType(responseData);
      
      if (singleType) {
        // Single collection - export to Excel
        const filename = `${singleType}-${Date.now()}.xlsx`;
        const excelPath = path.join(exportsDir, filename);
        
        await exportToExcel(responseData[singleType], singleType, excelPath);
        
        res.download(excelPath, filename, (err) => {
          if (err) console.error('Error downloading file:', err);
          fs.unlinkSync(excelPath);
        });
      } else {
        // Multi-collection - export all to Excel with multiple sheets
        const filename = `pharma-data-${Date.now()}.xlsx`;
        const excelPath = path.join(exportsDir, filename);
        
        await exportMultiCollectionToExcel(responseData, excelPath);
        
        res.download(excelPath, filename, (err) => {
          if (err) console.error('Error downloading file:', err);
          fs.unlinkSync(excelPath);
        });
      }
    } else if (data && collectionType) {
      // Legacy support - direct data export
      const filename = `${collectionType}-${Date.now()}.xlsx`;
      const excelPath = path.join(exportsDir, filename);
      
      await exportToExcel(data, collectionType, excelPath);
      
      res.download(excelPath, filename, (err) => {
        if (err) console.error('Error downloading file:', err);
        fs.unlinkSync(excelPath);
      });
    } else {
      return res.status(400).json({ error: 'Invalid export request' });
    }

  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ error: 'Error exporting Excel', message: error.message });
  }
});

app.get('/api/trials', async (req, res) => {
  try {
    const trials = await ClinicalTrial.find({})
      .populate('sites', 'name address.city address.country')
      .lean();
    
    res.json({
      total: trials.length,
      trials: trials
    });
  } catch (error) {
    console.error('Error fetching trials:', error);
    res.status(500).json({ error: 'Error fetching trials', message: error.message });
  }
});

app.get('/api/trials/:id', async (req, res) => {
  try {
    const trial = await ClinicalTrial.findOne({ trialId: req.params.id })
      .populate('sites', 'name address contact')
      .populate('participants', 'participantId enrollmentInfo.status demographics')
      .populate('adverseEvents', 'eventId eventDetails timing')
      .lean();
    
    if (!trial) {
      return res.status(404).json({ error: 'Trial not found' });
    }

    res.json(trial);
  } catch (error) {
    console.error('Error fetching trial:', error);
    res.status(500).json({ error: 'Error fetching trial', message: error.message });
  }
});

function formatResponse(query, results, analysis) {
  // Count total results across all collections
  const totalTrials = results.trials?.length || 0;
  const totalDrugs = results.drugs?.length || 0;
  const totalSites = results.sites?.length || 0;
  const totalParticipants = results.participants?.length || 0;
  const totalAdverseEvents = results.adverseEvents?.length || 0;
  const totalResults = totalTrials + totalDrugs + totalSites + totalParticipants + totalAdverseEvents;

  console.log('📊 Formatting consolidated response from all collections');

  if (totalResults === 0) {
    return {
      type: 'error',
      content: `<div class="error-message">No results found matching your query: "${query}". Try different search terms.</div>`,
      trials: [],
      drugs: [],
      sites: [],
      participants: [],
      adverseEvents: []
    };
  }

  // Build structured data for statistics
  const statistics = {
    trials: { count: totalTrials, breakdown: {} },
    drugs: { count: totalDrugs, breakdown: {} },
    sites: { count: totalSites, breakdown: {} },
    participants: { count: totalParticipants, breakdown: {} },
    adverseEvents: { count: totalAdverseEvents, breakdown: {} }
  };

  const responseData = {};

  // Add trials info with detailed breakdown
  if (totalTrials > 0) {
    responseData.trials = results.trials.map(t => ({
      id: t.trialId,
      trialId: t.trialId,
      title: t.title,
      drug: t.drug,
      phase: t.phase,
      status: t.status,
      indication: t.indication,
      sponsor: t.sponsor,
      startDate: t.startDate,
      endDate: t.endDate,
      currentEnrollment: t.currentEnrollment,
      enrollmentTarget: t.enrollmentTarget,
      enrollmentProgress: `${t.currentEnrollment}/${t.enrollmentTarget}`,
      sites: t.sites,
      participants: t.participants,
      adverseEvents: t.adverseEvents,
      location: t.location,
      primaryEndpoint: t.primaryEndpoint,
      safetyData: t.safetyData
    }));
    
    // Add status breakdown
    results.trials.forEach(t => {
      const status = t.status || 'Unknown';
      statistics.trials.breakdown[status] = (statistics.trials.breakdown[status] || 0) + 1;
    });
  }

  // Add drugs info with details
  if (totalDrugs > 0) {
    responseData.drugs = results.drugs.map(d => ({
      drugId: d.drugId,
      name: d.name,
      class: d.class,
      approvalStatus: d.approvalStatus,
      description: d.description,
      mechanism: d.mechanism,
      indications: d.indications,
      sideEffects: d.sideEffects,
      dosage: d.dosage,
      pharmacokinetics: d.pharmacokinetics
    }));
    
    // Add approval status breakdown - FIX for [object Object]
    results.drugs.forEach(d => {
      const approval = (typeof d.approvalStatus === 'string' ? d.approvalStatus : 
                       d.approvalStatus?.status || 'Unknown');
      statistics.drugs.breakdown[approval] = (statistics.drugs.breakdown[approval] || 0) + 1;
    });
  }

  // Add sites info with location details
  if (totalSites > 0) {
    responseData.sites = results.sites.map(s => ({
      siteId: s.siteId,
      name: s.name,
      city: s.address?.city,
      state: s.address?.state,
      country: s.address?.country,
      postalCode: s.address?.postalCode,
      capacity: s.capacity,
      currentTrials: s.currentTrials,
      contact: s.contact,
      facilities: s.facilities
    }));
    
    // Add country breakdown
    results.sites.forEach(s => {
      const country = s.address?.country || 'Unknown';
      statistics.sites.breakdown[country] = (statistics.sites.breakdown[country] || 0) + 1;
    });
  }

  // Add participants info with demographics
  if (totalParticipants > 0) {
    responseData.participants = results.participants.map(p => ({
      participantId: p.participantId,
      age: p.demographics?.age,
      gender: p.demographics?.gender,
      ethnicity: p.demographics?.ethnicity,
      enrollmentStatus: p.enrollmentInfo?.status,
      enrollmentDate: p.enrollmentInfo?.enrollmentDate,
      trialId: p.trialId,
      siteId: p.siteId,
      medicalHistory: p.medicalHistory,
      consentDate: p.consentDate
    }));
    
    // Add demographics breakdown
    results.participants.forEach(p => {
      const gender = p.demographics?.gender || 'Unknown';
      statistics.participants.breakdown[gender] = (statistics.participants.breakdown[gender] || 0) + 1;
    });
  }

  // Add adverse events info with severity breakdown
  if (totalAdverseEvents > 0) {
    responseData.adverseEvents = results.adverseEvents.map(e => ({
      eventId: e.eventId,
      severity: e.eventDetails?.severity,
      isSerious: e.eventDetails?.isSerious,
      description: e.eventDetails?.description,
      outcome: e.eventDetails?.outcome,
      reportDate: e.timing?.reportDate,
      onsetDate: e.timing?.onsetDate,
      resolutionDate: e.timing?.resolutionDate,
      participantId: e.participantId,
      trialId: e.trialId
    }));
    
    // Add severity breakdown
    results.adverseEvents.forEach(e => {
      const severity = e.eventDetails?.severity || 'Unknown';
      statistics.adverseEvents.breakdown[severity] = (statistics.adverseEvents.breakdown[severity] || 0) + 1;
    });
    
    // Add serious vs non-serious count
    const seriousCount = results.adverseEvents.filter(e => e.eventDetails?.isSerious).length;
    const nonSeriousCount = totalAdverseEvents - seriousCount;
    statistics.adverseEvents.serious = seriousCount;
    statistics.adverseEvents.nonSerious = nonSeriousCount;
  }

  // For count intent
  if (analysis.intent === 'count') {
    return {
      type: 'count',
      content: 'consolidated',
      count: totalResults,
      statistics: statistics,
      summary: {
        totalRecords: totalResults,
        trials: totalTrials,
        drugs: totalDrugs,
        sites: totalSites,
        participants: totalParticipants,
        adverseEvents: totalAdverseEvents
      },
      aiInsight: `Found ${totalResults} total records across all collections.`,
      ...responseData
    };
  }

  // For single trial detail - return consolidated data
  if (totalTrials === 1 && analysis.filters.trialId) {
    return {
      type: 'detail',
      content: 'consolidated',
      statistics: statistics,
      summary: {
        totalRecords: totalResults,
        trials: totalTrials,
        drugs: totalDrugs,
        sites: totalSites,
        participants: totalParticipants,
        adverseEvents: totalAdverseEvents
      },
      aiInsight: `Detailed information for trial ${analysis.filters.trialId}.`,
      ...responseData
    };
  }

  // For list view - return ALL consolidated data from all collections
  return {
    type: 'list',
    content: 'consolidated',
    statistics: statistics,
    summary: {
      totalRecords: totalResults,
      trials: totalTrials,
      drugs: totalDrugs,
      sites: totalSites,
      participants: totalParticipants,
      adverseEvents: totalAdverseEvents
    },
    aiInsight: `Retrieved ${totalResults} records matching your query.`,
    ...responseData
  };
}

// Mount GenAI routes
console.log('\ud83d\udce6 Mounting GenAI routes at /api/genai');
app.use('/api/genai', (req, res, next) => {
  console.log(`\ud83d\udd35 GenAI route middleware hit: ${req.method} ${req.url}`);
  next();
}, genaiRoutes);

// Error handling middleware
app.use(errorLogger);
app.use(errorHandler);

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
});

app.listen(PORT, async () => {
  const trialsCount = await ClinicalTrial.countDocuments();
  const drugsCount = await Drug.countDocuments();
  const sitesCount = await TrialSite.countDocuments();
  const participantsCount = await Participant.countDocuments();
  const adverseEventsCount = await AdverseEvent.countDocuments();

  console.log(`\n🚀 PharmaGenie Backend Server`);
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`💾 Database: MongoDB Atlas Connected`);
  console.log(`\n📊 Collections Summary:`);
  console.log(`   ✅ Clinical Trials: ${trialsCount}`);
  console.log(`   ✅ Drugs: ${drugsCount}`);
  console.log(`   ✅ Trial Sites: ${sitesCount}`);
  console.log(`   ✅ Participants: ${participantsCount}`);
  console.log(`   ✅ Adverse Events: ${adverseEventsCount}`);
  console.log(`\n✅ API Endpoints:`);
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/chat                    [NLP Chatbot]`);
  console.log(`   POST /api/genai/chat              [GenAI Chatbot]`);
  console.log(`   GET  /api/genai/stream            [GenAI Streaming]`);
  console.log(`   GET  /api/genai/sessions          [GenAI History]`);
  console.log(`   GET  /api/trials`);
  console.log(`   GET  /api/trials/:id`);
  console.log(`   POST /api/export/csv`);
  console.log(`   POST /api/export/excel`);
  console.log(`\n🤖 NLP Service: Active`);
  console.log(`🤖 GenAI Provider: ${process.env.GENAI_PROVIDER || 'mock'}`);
  console.log(`🔧 Ready to process queries!\n`);
});

export default app;
