import mongoose from 'mongoose';

const clinicalTrialSchema = new mongoose.Schema({
  trialId: {
    type: String,
    required: true,
    unique: true,
    match: /^CT-\d{4}-\d{3}$/,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  drug: {
    type: String,
    required: true,
    uppercase: true,
    index: true
  },
  phase: {
    type: String,
    required: true,
    enum: ['Phase I', 'Phase II', 'Phase III', 'Phase IV'],
    index: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Active', 'Completed', 'Recruiting', 'Suspended', 'Terminated'],
    default: 'Recruiting',
    index: true
  },
  indication: {
    type: String,
    required: true,
    index: true
  },
  sponsor: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  estimatedCompletion: {
    type: Date
  },
  enrollmentTarget: {
    type: Number,
    required: true,
    min: 1
  },
  currentEnrollment: {
    type: Number,
    default: 0,
    min: 0
  },
  principalInvestigator: {
    name: String,
    affiliation: String,
    email: String
  },
  inclusionCriteria: [String],
  exclusionCriteria: [String],
  primaryEndpoint: String,
  secondaryEndpoints: [String],
  sites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrialSite'
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant'
  }],
  adverseEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdverseEvent'
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
    updatedBy: String
  }
}, {
  timestamps: true,
  collection: 'clinical_trials'
});

// Indexes for better query performance
clinicalTrialSchema.index({ trialId: 1, status: 1 });
clinicalTrialSchema.index({ drug: 1, phase: 1 });
clinicalTrialSchema.index({ indication: 1, status: 1 });
clinicalTrialSchema.index({ startDate: -1 });

// Text index for full-text search
clinicalTrialSchema.index({
  title: 'text',
  description: 'text',
  indication: 'text'
});

// Virtual for enrollment progress
clinicalTrialSchema.virtual('enrollmentProgress').get(function() {
  return (this.currentEnrollment / this.enrollmentTarget) * 100;
});

// Virtual for trial duration
clinicalTrialSchema.virtual('durationDays').get(function() {
  if (this.endDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Middleware to update timestamps
clinicalTrialSchema.pre('save', function() {
  this.metadata.updatedAt = new Date();
});

const ClinicalTrial = mongoose.model('ClinicalTrial', clinicalTrialSchema);

export default ClinicalTrial;
