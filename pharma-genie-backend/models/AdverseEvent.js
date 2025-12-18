import mongoose from 'mongoose';

const adverseEventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  trial: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClinicalTrial',
    required: true,
    index: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
    index: true
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrialSite',
    required: true
  },
  eventDetails: {
    term: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: [
        'Gastrointestinal',
        'Cardiovascular',
        'Neurological',
        'Respiratory',
        'Dermatological',
        'Hematological',
        'Musculoskeletal',
        'Renal',
        'Hepatic',
        'Immunological',
        'Psychiatric',
        'Other'
      ],
      required: true,
      index: true
    },
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe', 'Life-threatening', 'Fatal'],
      required: true,
      index: true
    },
    seriousness: {
      isSerious: {
        type: Boolean,
        required: true,
        default: false
      },
      criteria: [{
        type: String,
        enum: [
          'Death',
          'Life-threatening',
          'Hospitalization',
          'Disability/Incapacity',
          'Congenital Anomaly',
          'Other Medically Important'
        ]
      }]
    }
  },
  timing: {
    onsetDate: {
      type: Date,
      required: true
    },
    detectionDate: {
      type: Date,
      required: true
    },
    resolutionDate: Date,
    duration: String, // e.g., "3 days", "2 weeks"
    timeFromDrugAdministration: String
  },
  outcome: {
    status: {
      type: String,
      enum: ['Ongoing', 'Resolved', 'Resolved with Sequelae', 'Fatal', 'Unknown'],
      required: true,
      default: 'Ongoing'
    },
    actionTaken: {
      type: String,
      enum: [
        'No Action',
        'Dose Reduced',
        'Dose Interrupted',
        'Drug Withdrawn',
        'Concomitant Medication Given',
        'Non-drug Therapy Given'
      ]
    },
    treatmentRequired: Boolean,
    treatmentDetails: String
  },
  causality: {
    relationshipToDrug: {
      type: String,
      enum: ['Unrelated', 'Unlikely', 'Possible', 'Probable', 'Definite'],
      required: true
    },
    assessedBy: String,
    assessmentDate: Date,
    alternativeCauses: [String]
  },
  reporting: {
    reportedBy: {
      name: String,
      role: String,
      date: Date
    },
    reportedToSponsor: {
      reported: Boolean,
      reportDate: Date,
      reportNumber: String
    },
    reportedToRegulatory: {
      reported: Boolean,
      authority: String,
      reportDate: Date,
      reportNumber: String
    },
    reportedToIRB: {
      reported: Boolean,
      reportDate: Date
    }
  },
  interventions: [{
    type: {
      type: String,
      enum: ['Medication', 'Procedure', 'Hospitalization', 'Other']
    },
    description: String,
    startDate: Date,
    endDate: Date,
    outcome: String
  }],
  labFindings: [{
    testName: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    date: Date,
    abnormal: Boolean
  }],
  followUp: [{
    date: Date,
    status: String,
    notes: String,
    assessedBy: String
  }],
  expectedness: {
    isExpected: Boolean,
    referenceDocument: String
  },
  narrative: {
    type: String,
    required: true
  },
  attachments: [{
    fileName: String,
    fileType: String,
    uploadDate: Date,
    description: String
  }],
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    createdBy: String,
    lastModifiedBy: String,
    version: {
      type: Number,
      default: 1
    }
  }
}, {
  timestamps: true,
  collection: 'adverse_events'
});

// Indexes
// eventId already has unique index from schema definition
adverseEventSchema.index({ trial: 1, 'eventDetails.severity': 1 });
adverseEventSchema.index({ participant: 1, 'timing.onsetDate': -1 });
adverseEventSchema.index({ 'eventDetails.category': 1, 'eventDetails.severity': 1 });
adverseEventSchema.index({ 'eventDetails.seriousness.isSerious': 1 });
adverseEventSchema.index({ 'causality.relationshipToDrug': 1 });
adverseEventSchema.index({ 'timing.onsetDate': -1 });

// Text index for search
adverseEventSchema.index({
  'eventDetails.term': 'text',
  'eventDetails.description': 'text',
  narrative: 'text'
});

// Virtual for event duration in days
adverseEventSchema.virtual('durationDays').get(function() {
  if (this.timing.resolutionDate) {
    return Math.ceil((this.timing.resolutionDate - this.timing.onsetDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for time to detection
adverseEventSchema.virtual('timeToDetectionDays').get(function() {
  return Math.ceil((this.timing.detectionDate - this.timing.onsetDate) / (1000 * 60 * 60 * 24));
});

// Middleware to update version and timestamps
adverseEventSchema.pre('save', function() {
  if (!this.isNew) {
    this.metadata.version += 1;
  }
  this.metadata.updatedAt = new Date();
});

// Method to check if immediate reporting is required
adverseEventSchema.methods.requiresImmediateReporting = function() {
  return (
    this.eventDetails.seriousness.isSerious ||
    this.eventDetails.severity === 'Life-threatening' ||
    this.eventDetails.severity === 'Fatal' ||
    this.outcome.status === 'Fatal'
  );
};

const AdverseEvent = mongoose.model('AdverseEvent', adverseEventSchema);

export default AdverseEvent;
