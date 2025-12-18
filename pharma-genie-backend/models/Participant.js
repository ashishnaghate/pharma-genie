import mongoose from 'mongoose';

const participantSchema = new mongoose.Schema({
  participantId: {
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
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrialSite',
    required: true
  },
  demographics: {
    ageGroup: {
      type: String,
      enum: ['18-30', '31-45', '46-60', '61-75', '76+'],
      required: true
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: true
    },
    ethnicity: String,
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'lbs'],
        default: 'kg'
      }
    },
    height: {
      value: Number,
      unit: {
        type: String,
        enum: ['cm', 'inches'],
        default: 'cm'
      }
    },
    bmi: Number
  },
  enrollmentInfo: {
    enrollmentDate: {
      type: Date,
      required: true,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['Screening', 'Enrolled', 'Active', 'Completed', 'Withdrawn', 'Discontinued'],
      default: 'Screening',
      index: true
    },
    randomizationGroup: {
      type: String,
      enum: ['Treatment', 'Placebo', 'Control', 'Not Randomized']
    },
    consentDate: Date,
    consentVersion: String
  },
  medicalHistory: {
    primaryDiagnosis: String,
    secondaryDiagnoses: [String],
    allergies: [String],
    currentMedications: [{
      name: String,
      dosage: String,
      frequency: String,
      startDate: Date
    }],
    pastMedications: [{
      name: String,
      reason: String,
      duration: String
    }],
    surgeries: [{
      type: String,
      date: Date,
      outcome: String
    }],
    familyHistory: [String]
  },
  baselineVitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number
  },
  labResults: [{
    testName: String,
    value: mongoose.Schema.Types.Mixed,
    unit: String,
    normalRange: String,
    date: Date,
    status: {
      type: String,
      enum: ['Normal', 'Abnormal', 'Critical']
    }
  }],
  visits: [{
    visitNumber: Number,
    visitType: {
      type: String,
      enum: ['Screening', 'Baseline', 'Follow-up', 'End of Study', 'Unscheduled']
    },
    scheduledDate: Date,
    actualDate: Date,
    status: {
      type: String,
      enum: ['Scheduled', 'Completed', 'Missed', 'Cancelled']
    },
    notes: String,
    proceduresPerformed: [String]
  }],
  adverseEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdverseEvent'
  }],
  compliance: {
    medicationCompliance: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    visitCompliance: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    protocolDeviations: [{
      date: Date,
      description: String,
      severity: {
        type: String,
        enum: ['Minor', 'Major']
      }
    }]
  },
  outcomes: {
    primaryOutcome: {
      measured: Boolean,
      value: mongoose.Schema.Types.Mixed,
      date: Date
    },
    secondaryOutcomes: [{
      name: String,
      value: mongoose.Schema.Types.Mixed,
      date: Date
    }]
  },
  withdrawalInfo: {
    withdrawalDate: Date,
    reason: String,
    category: {
      type: String,
      enum: ['Adverse Event', 'Lost to Follow-up', 'Voluntary', 'Protocol Violation', 'Other']
    }
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    dataEntryBy: String
  }
}, {
  timestamps: true,
  collection: 'participants'
});

// Indexes
// participantId already has unique index from schema definition
participantSchema.index({ trial: 1, 'enrollmentInfo.status': 1 });
participantSchema.index({ site: 1 });
participantSchema.index({ 'enrollmentInfo.enrollmentDate': -1 });
participantSchema.index({ 'demographics.ageGroup': 1, 'demographics.gender': 1 });

// Virtual for days in trial
participantSchema.virtual('daysInTrial').get(function() {
  const endDate = this.withdrawalInfo?.withdrawalDate || 
                  (this.enrollmentInfo.status === 'Completed' ? this.metadata.updatedAt : new Date());
  return Math.ceil((endDate - this.enrollmentInfo.enrollmentDate) / (1000 * 60 * 60 * 24));
});

// Middleware
participantSchema.pre('save', function() {
  this.metadata.updatedAt = new Date();
  
  // Calculate BMI if weight and height are available
  if (this.demographics.weight?.value && this.demographics.height?.value) {
    const weightInKg = this.demographics.weight.unit === 'lbs' 
      ? this.demographics.weight.value * 0.453592 
      : this.demographics.weight.value;
    const heightInM = this.demographics.height.unit === 'inches' 
      ? this.demographics.height.value * 0.0254 
      : this.demographics.height.value / 100;
    this.demographics.bmi = (weightInKg / (heightInM * heightInM)).toFixed(2);
  }
});

const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
