import mongoose from 'mongoose';

const trialSiteSchema = new mongoose.Schema({
  siteId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Hospital', 'Research Center', 'University', 'Private Clinic', 'Other'],
    required: true
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true,
      index: true
    },
    state: String,
    country: {
      type: String,
      required: true,
      index: true
    },
    postalCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    primaryContact: {
      name: String,
      role: String,
      phone: String,
      email: String
    },
    emergencyContact: {
      phone: String,
      email: String
    }
  },
  capabilities: {
    maxCapacity: {
      type: Number,
      required: true,
      min: 1
    },
    currentLoad: {
      type: Number,
      default: 0,
      min: 0
    },
    specializations: [String],
    equipmentAvailable: [String],
    certifications: [{
      name: String,
      issuedBy: String,
      validUntil: Date
    }]
  },
  staffing: {
    principalInvestigators: [{
      name: String,
      qualification: String,
      yearsOfExperience: Number,
      email: String
    }],
    coordinators: [{
      name: String,
      role: String,
      email: String
    }],
    totalStaff: Number
  },
  activeClinicalTrials: [{
    trial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ClinicalTrial'
    },
    enrollmentTarget: Number,
    currentEnrollment: Number,
    startDate: Date,
    status: {
      type: String,
      enum: ['Active', 'Recruiting', 'Completed', 'Suspended']
    }
  }],
  performance: {
    totalTrialsCompleted: {
      type: Number,
      default: 0
    },
    averageEnrollmentTime: Number, // in days
    protocolDeviations: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  accreditation: {
    isAccredited: {
      type: Boolean,
      default: false
    },
    accreditingBody: String,
    accreditationDate: Date,
    expiryDate: Date
  },
  operatingHours: {
    weekdays: String,
    weekends: String,
    timezone: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
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
  collection: 'trial_sites'
});

// Indexes
// siteId already has unique index from schema definition
trialSiteSchema.index({ 'address.city': 1, 'address.country': 1 });
trialSiteSchema.index({ type: 1 });
trialSiteSchema.index({ isActive: 1 });
trialSiteSchema.index({ 'address.coordinates': '2dsphere' });

// Text index
trialSiteSchema.index({
  name: 'text',
  'address.city': 'text',
  'address.country': 'text',
  'capabilities.specializations': 'text'
});

// Virtual for capacity utilization
trialSiteSchema.virtual('capacityUtilization').get(function() {
  return (this.capabilities.currentLoad / this.capabilities.maxCapacity) * 100;
});

// Middleware
trialSiteSchema.pre('save', function() {
  this.metadata.updatedAt = new Date();
});

const TrialSite = mongoose.model('TrialSite', trialSiteSchema);

export default TrialSite;
