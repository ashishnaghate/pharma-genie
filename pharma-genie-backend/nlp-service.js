import natural from 'natural';
import compromise from 'compromise';
import { ClinicalTrial, Drug, TrialSite, Participant, AdverseEvent } from './models/index.js';

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;

class NLPService {
  constructor() {
    this.intentPatterns = {
      list: /\b(show|list|display|get|find|all|view)\b/i,
      count: /\b(how many|count|number of|total)\b/i,
      status: /\b(status|state|condition)\b/i,
      filter: /\b(with|having|where|that|filter)\b/i,
      export: /\b(export|download|save|extract)\b/i,
      specific: /\b(CT-\d{4}-\d{3}|trial|study)\b/i,
      drug: /\b(drug|medication|compound|pharmaceutical|medicine)\b/i,
      site: /\b(site|location|facility|center|hospital)\b/i,
      participant: /\b(participant|patient|subject|volunteer|enrollment)\b/i,
      adverse: /\b(adverse|side effect|safety|event|reaction)\b/i,
    };

    this.entityPatterns = {
      trialId: /CT-\d{4}-\d{3}/gi,
      phase: /\b(phase\s+(I{1,3}|1|2|3|IV))\b/gi,
      status: /\b(active|completed|recruiting|suspended|terminated)\b/gi,
      drug: /\b([A-Z]{3}\d{3}|[A-Z]{3}\d{4})\b/g,
      indication: /\b(hypertension|diabetes|cancer|alzheimer|arthritis|depression|covid|migraine)\b/gi,
      date: /\b(\d{4}|\d{4}-\d{2}-\d{2})\b/g,
    };
  }

  analyzeQuery(query) {
    const doc = compromise(query);
    const tokens = tokenizer.tokenize(query.toLowerCase());
    
    const analysis = {
      intent: this.detectIntent(query),
      entities: this.extractEntities(query, doc),
      keywords: this.extractKeywords(tokens),
      filters: this.buildFilters(query, doc),
      exportFormat: this.detectExportFormat(query),
      collections: this.detectCollections(query),
    };

    return analysis;
  }

  detectIntent(query) {
    const intents = [];
    
    for (const [intent, pattern] of Object.entries(this.intentPatterns)) {
      if (pattern.test(query)) {
        intents.push(intent);
      }
    }

    if (intents.length === 0) {
      intents.push('list');
    }

    return intents[0];
  }

  extractEntities(query, doc) {
    const entities = {};

    for (const [entityType, pattern] of Object.entries(this.entityPatterns)) {
      const matches = query.match(pattern);
      if (matches) {
        entities[entityType] = matches.map(m => m.trim());
      }
    }

    const places = doc.places().out('array');
    if (places.length > 0) {
      entities.sites = places;
    }

    const numbers = doc.numbers().out('array');
    if (numbers.length > 0) {
      entities.numbers = numbers;
    }

    return entities;
  }

  extractKeywords(tokens) {
    const stopwords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
                       'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
                       'show', 'me', 'get', 'find', 'list', 'all', 'what', 'how', 'when'];
    
    return tokens.filter(token => 
      !stopwords.includes(token) && 
      token.length > 2 &&
      !/^\d+$/.test(token)
    );
  }

  buildFilters(query, doc) {
    const filters = {};

    if (query.match(/\bactive\b/i)) {
      filters.status = 'Active';
    }
    if (query.match(/\bcompleted\b/i)) {
      filters.status = 'Completed';
    }
    if (query.match(/\brecruiting\b/i)) {
      filters.status = 'Recruiting';
    }
    if (query.match(/\bsuspended\b/i)) {
      filters.status = 'Suspended';
    }

    const phaseMatch = query.match(/phase\s+(I{1,3}|IV|1|2|3|4)/i);
    if (phaseMatch) {
      let phaseNum = phaseMatch[1];
      if (phaseNum === 'IV' || phaseNum === '4') {
        filters.phase = 'Phase IV';
      } else {
        phaseNum = phaseNum.replace(/I{1,3}/, m => m.length).replace(/1|2|3/, m => 'I'.repeat(parseInt(m)));
        filters.phase = `Phase ${phaseNum}`;
      }
    }

    const drugMatch = query.match(/\b([A-Z]{3}\d{3,4})\b/);
    if (drugMatch) {
      filters.drug = drugMatch[1];
    }

    const trialIdMatch = query.match(/CT-\d{4}-\d{3}/);
    if (trialIdMatch) {
      filters.trialId = trialIdMatch[0];
    }

    return filters;
  }
  detectExportFormat(query) {
    if (/\b(csv|comma.*separated)\b/i.test(query)) {
      return 'csv';
    }
    if (/\b(excel|xlsx|xls|spreadsheet)\b/i.test(query)) {
      return 'excel';
    }
    if (/\b(table|tabular)\b/i.test(query)) {
      return 'table';
    }
    return 'text';
  }

  detectCollections(query) {
    // ALWAYS query all collections for consolidated data
    // This ensures comprehensive results from all five MongoDB collections
    const collections = ['trials', 'drugs', 'sites', 'participants', 'adverseEvents'];
    
    console.log('📊 Querying all collections for consolidated data:', collections);
    
    return collections;
  }

  async matchTrials(analysis) {
    try {
      console.log('🔍 Querying all 5 collections for consolidated data...');
      
      const results = {
        trials: [],
        drugs: [],
        sites: [],
        participants: [],
        adverseEvents: []
      };

      // ALWAYS query all collections for consolidated data
      const collections = ['trials', 'drugs', 'sites', 'participants', 'adverseEvents'];

      // Query Trials with full population
      console.log('📋 Querying Clinical Trials...');
      const trialQuery = {};

      if (analysis.filters.trialId) {
        trialQuery.trialId = analysis.filters.trialId;
      }
      if (analysis.filters.status) {
        trialQuery.status = analysis.filters.status;
      }
      if (analysis.filters.phase) {
        trialQuery.phase = analysis.filters.phase;
      }
      if (analysis.filters.drug) {
        trialQuery.drug = new RegExp(analysis.filters.drug, 'i');
      }
      if (analysis.entities.indication && analysis.entities.indication.length > 0) {
        trialQuery.indication = new RegExp(analysis.entities.indication[0], 'i');
      }

      // If we have specific filters, use them
      if (Object.keys(trialQuery).length > 0) {
        results.trials = await ClinicalTrial.find(trialQuery)
          .populate('sites')
          .populate('participants')
          .populate('adverseEvents')
          .lean();
      } 
      // If we have keywords, use text search
      else if (analysis.keywords.length > 0) {
        const searchText = analysis.keywords.join(' ');
        results.trials = await ClinicalTrial.find(
          { $text: { $search: searchText } },
          { score: { $meta: 'textScore' } }
        )
          .sort({ score: { $meta: 'textScore' } })
          .populate('sites')
          .populate('participants')
          .populate('adverseEvents')
          .limit(50)
          .lean();
      } 
      // Fallback: return all trials
      else {
        results.trials = await ClinicalTrial.find({})
          .populate('sites')
          .populate('participants')
          .populate('adverseEvents')
          .limit(20)
          .lean();
      }
      console.log(`✅ Found ${results.trials.length} trials`);

      // Query ALL Drugs (or filtered if specific drug mentioned)
      console.log('💊 Querying Drugs...');
      const drugQuery = {};
      
      if (analysis.filters.drug) {
        drugQuery.$or = [
          { drugId: new RegExp(analysis.filters.drug, 'i') },
          { name: new RegExp(analysis.filters.drug, 'i') }
        ];
        results.drugs = await Drug.find(drugQuery).lean();
      } else if (analysis.keywords.length > 0) {
        // Search drugs by keywords
        const searchPattern = new RegExp(analysis.keywords.join('|'), 'i');
        results.drugs = await Drug.find({
          $or: [
            { name: searchPattern },
            { class: searchPattern },
            { description: searchPattern }
          ]
        }).lean();
        
        // If no keyword match, get all drugs
        if (results.drugs.length === 0) {
          results.drugs = await Drug.find({}).lean();
        }
      } else {
        results.drugs = await Drug.find({}).lean();
      }
      console.log(`✅ Found ${results.drugs.length} drugs`);

      // Query ALL Sites (or filtered)
      console.log('🏥 Querying Trial Sites...');
      const siteQuery = {};
      
      // Search by name or city if keywords present
      if (analysis.keywords.length > 0) {
        const searchPattern = new RegExp(analysis.keywords.join('|'), 'i');
        results.sites = await TrialSite.find({
          $or: [
            { name: searchPattern },
            { 'address.city': searchPattern },
            { 'address.country': searchPattern }
          ]
        }).lean();
        
        // If no keyword match, get all sites
        if (results.sites.length === 0) {
          results.sites = await TrialSite.find({}).lean();
        }
      } else {
        results.sites = await TrialSite.find({}).lean();
      }
      console.log(`✅ Found ${results.sites.length} sites`);

      // Query ALL Participants (or filtered)
      console.log('👥 Querying Participants...');
      const participantQuery = {};
      
      // Search by enrollment status or demographics if keywords present
      if (analysis.keywords.includes('active')) {
        participantQuery['enrollmentInfo.status'] = 'Active';
      }
      if (analysis.keywords.includes('male')) {
        participantQuery['demographics.gender'] = 'Male';
      }
      if (analysis.keywords.includes('female')) {
        participantQuery['demographics.gender'] = 'Female';
      }
      
      if (Object.keys(participantQuery).length > 0) {
        results.participants = await Participant.find(participantQuery).lean();
      } else {
        results.participants = await Participant.find({}).lean();
      }
      console.log(`✅ Found ${results.participants.length} participants`);

      // Query ALL Adverse Events (or filtered)
      console.log('⚠️ Querying Adverse Events...');
      const adverseQuery = {};
      
      if (analysis.keywords.includes('serious') || /\bserious\b/i.test(analysis.keywords.join(' '))) {
        adverseQuery['eventDetails.isSerious'] = true;
      }
      if (analysis.keywords.includes('mild')) {
        adverseQuery['eventDetails.severity'] = 'Mild';
      }
      if (analysis.keywords.includes('moderate')) {
        adverseQuery['eventDetails.severity'] = 'Moderate';
      }
      if (analysis.keywords.includes('severe')) {
        adverseQuery['eventDetails.severity'] = 'Severe';
      }
      
      if (Object.keys(adverseQuery).length > 0) {
        results.adverseEvents = await AdverseEvent.find(adverseQuery).lean();
      } else {
        results.adverseEvents = await AdverseEvent.find({}).lean();
      }
      console.log(`✅ Found ${results.adverseEvents.length} adverse events`);

      console.log('📊 Consolidated Results Summary:', {
        trials: results.trials.length,
        drugs: results.drugs.length,
        sites: results.sites.length,
        participants: results.participants.length,
        adverseEvents: results.adverseEvents.length,
        total: results.trials.length + results.drugs.length + results.sites.length + 
               results.participants.length + results.adverseEvents.length
      });

      return results;
    } catch (error) {
      console.error('❌ Error querying collections:', error);
      throw error;
    }
  }
}

export default NLPService;
