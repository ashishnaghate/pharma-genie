import mongoose from 'mongoose';

const drugSchema = new mongoose.Schema({
  drugId: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  brandName: {
    type: String,
    trim: true
  },
  class: {
    type: String,
    required: true
  },
  mechanismOfAction: {
    type: String,
    required: true
  },
  indications: [{
    type: String,
    trim: true
  }],
  contraindications: [{
    type: String,
    trim: true
  }],
  sideEffects: [{
    severity: {
      type: String,
      enum: ['Mild', 'Moderate', 'Severe']
    },
    description: String,
    frequency: String
  }],
  dosageForm: {
    type: String,
    enum: ['Tablet', 'Capsule', 'Injection', 'Syrup', 'Topical', 'Inhaler', 'Patch', 'Other']
  },
  dosageStrength: [{
    value: Number,
    unit: String
  }],
  administrationRoute: {
    type: String,
    enum: ['Oral', 'Intravenous', 'Intramuscular', 'Subcutaneous', 'Topical', 'Inhalation', 'Other']
  },
  manufacturer: {
    name: String,
    country: String,
    contact: String
  },
  approvalStatus: {
    fda: {
      approved: Boolean,
      approvalDate: Date,
      nda: String
    },
    ema: {
      approved: Boolean,
      approvalDate: Date
    },
    other: [{
      authority: String,
      approved: Boolean,
      approvalDate: Date
    }]
  },
  clinicalTrials: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ClinicalTrial'
  }],
  pharmacokinetics: {
    absorption: String,
    distribution: String,
    metabolism: String,
    excretion: String,
    halfLife: String
  },
  interactions: [{
    drug: String,
    severity: {
      type: String,
      enum: ['Minor', 'Moderate', 'Major']
    },
    description: String
  }],
  storageConditions: String,
  shelfLife: String,
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  }
}, {
  timestamps: true,
  collection: 'drugs'
});

// Indexes
// drugId already has unique index from schema definition
drugSchema.index({ name: 1 });
drugSchema.index({ class: 1 });
drugSchema.index({ 'indications': 1 });

// Text index for search
drugSchema.index({
  name: 'text',
  genericName: 'text',
  brandName: 'text',
  mechanismOfAction: 'text'
});

// Middleware
drugSchema.pre('save', function() {
  this.metadata.updatedAt = new Date();
});

const Drug = mongoose.model('Drug', drugSchema);

export default Drug;
