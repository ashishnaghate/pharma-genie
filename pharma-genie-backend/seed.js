import database from './config/database.js';
import { ClinicalTrial, Drug, TrialSite, Participant, AdverseEvent } from './models/index.js';

// Sample data for Clinical Trials
const clinicalTrialsData = [
  {
    trialId: 'CT-2024-001',
    title: 'Phase III Study of ABC123 in Type 2 Diabetes Mellitus',
    drug: 'ABC123',
    phase: 'Phase III',
    status: 'Recruiting',
    indication: 'Type 2 Diabetes',
    sponsor: 'PharmaCorp International',
    description: 'A randomized, double-blind, placebo-controlled study evaluating the efficacy and safety of ABC123 in patients with Type 2 Diabetes Mellitus.',
    startDate: new Date('2024-01-15'),
    estimatedCompletion: new Date('2026-06-30'),
    enrollmentTarget: 500,
    currentEnrollment: 327,
    principalInvestigator: {
      name: 'Dr. Sarah Johnson',
      affiliation: 'Medical Research Institute',
      email: 'sarah.johnson@mri.org'
    },
    inclusionCriteria: [
      'Age 18-75 years',
      'Diagnosed with Type 2 Diabetes',
      'HbA1c between 7.5% and 10.5%',
      'BMI between 25 and 40 kg/m²'
    ],
    exclusionCriteria: [
      'Type 1 Diabetes',
      'Severe renal impairment',
      'History of diabetic ketoacidosis',
      'Pregnancy or breastfeeding'
    ],
    primaryEndpoint: 'Change in HbA1c from baseline to week 24',
    secondaryEndpoints: [
      'Fasting plasma glucose levels',
      'Body weight change',
      'Incidence of hypoglycemic events'
    ]
  },
  {
    trialId: 'CT-2024-002',
    title: 'Phase II Trial of XYZ789 for Hypertension Management',
    drug: 'XYZ789',
    phase: 'Phase II',
    status: 'Active',
    indication: 'Hypertension',
    sponsor: 'CardioMed Solutions',
    description: 'A multicenter study to assess the dose-response relationship and safety of XYZ789 in patients with essential hypertension.',
    startDate: new Date('2024-03-01'),
    estimatedCompletion: new Date('2025-12-31'),
    enrollmentTarget: 300,
    currentEnrollment: 245,
    principalInvestigator: {
      name: 'Dr. Michael Chen',
      affiliation: 'Cardiovascular Research Center',
      email: 'michael.chen@crc.org'
    },
    inclusionCriteria: [
      'Age 30-70 years',
      'Systolic BP 140-180 mmHg',
      'Diastolic BP 90-110 mmHg'
    ],
    exclusionCriteria: [
      'Secondary hypertension',
      'Recent cardiovascular event',
      'Severe liver disease'
    ],
    primaryEndpoint: 'Mean change in systolic blood pressure at 12 weeks',
    secondaryEndpoints: [
      'Diastolic blood pressure change',
      'Responder rate (BP <140/90)',
      'Quality of life assessment'
    ]
  },
  {
    trialId: 'CT-2024-003',
    title: 'Phase I Safety Study of DEF456 in Advanced Solid Tumors',
    drug: 'DEF456',
    phase: 'Phase I',
    status: 'Active',
    indication: 'Advanced Cancer',
    sponsor: 'OncoPharma Research',
    description: 'First-in-human dose escalation study to evaluate safety, tolerability, and pharmacokinetics of DEF456 in patients with advanced solid tumors.',
    startDate: new Date('2024-02-10'),
    estimatedCompletion: new Date('2025-08-31'),
    enrollmentTarget: 60,
    currentEnrollment: 42,
    principalInvestigator: {
      name: 'Dr. Emily Rodriguez',
      affiliation: 'Cancer Treatment Center',
      email: 'emily.rodriguez@ctc.org'
    },
    inclusionCriteria: [
      'Age ≥18 years',
      'Histologically confirmed solid tumor',
      'Failed standard therapy or no standard therapy available',
      'ECOG performance status 0-1'
    ],
    exclusionCriteria: [
      'Brain metastases',
      'Inadequate organ function',
      'Prior treatment within 4 weeks'
    ],
    primaryEndpoint: 'Incidence of dose-limiting toxicities',
    secondaryEndpoints: [
      'Maximum tolerated dose',
      'Pharmacokinetic parameters',
      'Preliminary anti-tumor activity'
    ]
  },
  {
    trialId: 'CT-2024-004',
    title: 'Phase III Study of GHI101 in Major Depressive Disorder',
    drug: 'GHI101',
    phase: 'Phase III',
    status: 'Recruiting',
    indication: 'Major Depressive Disorder',
    sponsor: 'NeuroPharma Inc',
    description: 'A randomized, double-blind study comparing GHI101 versus placebo in adults with major depressive disorder.',
    startDate: new Date('2024-04-01'),
    estimatedCompletion: new Date('2026-03-31'),
    enrollmentTarget: 600,
    currentEnrollment: 289,
    principalInvestigator: {
      name: 'Dr. Robert Williams',
      affiliation: 'Mental Health Research Institute',
      email: 'robert.williams@mhri.org'
    },
    inclusionCriteria: [
      'Age 18-65 years',
      'DSM-5 criteria for Major Depressive Disorder',
      'HAM-D score ≥20',
      'Current depressive episode duration ≥4 weeks'
    ],
    exclusionCriteria: [
      'Bipolar disorder',
      'Active suicidal ideation',
      'Substance abuse within 6 months',
      'Treatment-resistant depression'
    ],
    primaryEndpoint: 'Change in HAM-D total score at week 8',
    secondaryEndpoints: [
      'Response rate (≥50% reduction in HAM-D)',
      'Remission rate (HAM-D ≤7)',
      'Quality of life measures'
    ]
  },
  {
    trialId: 'CT-2024-005',
    title: 'Phase II Study of JKL202 in Rheumatoid Arthritis',
    drug: 'JKL202',
    phase: 'Phase II',
    status: 'Active',
    indication: 'Rheumatoid Arthritis',
    sponsor: 'ImmunoTherapeutics Ltd',
    description: 'Evaluation of efficacy and safety of JKL202 in patients with moderate to severe rheumatoid arthritis who have inadequate response to methotrexate.',
    startDate: new Date('2024-05-15'),
    estimatedCompletion: new Date('2025-11-30'),
    enrollmentTarget: 250,
    currentEnrollment: 178,
    principalInvestigator: {
      name: 'Dr. Lisa Anderson',
      affiliation: 'Rheumatology Research Center',
      email: 'lisa.anderson@rrc.org'
    },
    inclusionCriteria: [
      'Age ≥18 years',
      'ACR criteria for rheumatoid arthritis',
      'Active disease (DAS28 >3.2)',
      'Inadequate response to methotrexate'
    ],
    exclusionCriteria: [
      'Other inflammatory arthritis',
      'Active infection',
      'Previous biologic therapy',
      'Severe comorbidities'
    ],
    primaryEndpoint: 'ACR20 response at week 12',
    secondaryEndpoints: [
      'ACR50 and ACR70 response',
      'Change in DAS28 score',
      'Radiographic progression'
    ]
  },
  {
    trialId: 'CT-2024-006',
    title: 'Phase I Study of MNO303 in Alzheimer\'s Disease',
    drug: 'MNO303',
    phase: 'Phase I',
    status: 'Recruiting',
    indication: 'Alzheimer\'s Disease',
    sponsor: 'NeuroDegen Therapeutics',
    description: 'Safety, tolerability, and pharmacokinetic study of MNO303 in patients with mild to moderate Alzheimer\'s disease.',
    startDate: new Date('2024-06-01'),
    estimatedCompletion: new Date('2025-06-30'),
    enrollmentTarget: 80,
    currentEnrollment: 45,
    principalInvestigator: {
      name: 'Dr. James Patterson',
      affiliation: 'Neuroscience Research Institute',
      email: 'james.patterson@nri.org'
    },
    inclusionCriteria: [
      'Age 55-85 years',
      'Probable Alzheimer\'s disease (NINCDS-ADRDA criteria)',
      'MMSE score 16-26',
      'Stable caregiver'
    ],
    exclusionCriteria: [
      'Other causes of dementia',
      'Significant neurological disorder',
      'Recent use of cognitive enhancers',
      'Severe agitation or psychosis'
    ],
    primaryEndpoint: 'Safety and tolerability',
    secondaryEndpoints: [
      'Pharmacokinetic parameters',
      'Change in cognitive assessments',
      'Biomarker changes'
    ]
  },
  {
    trialId: 'CT-2024-007',
    title: 'Phase III Study of PQR404 in COVID-19',
    drug: 'PQR404',
    phase: 'Phase III',
    status: 'Completed',
    indication: 'COVID-19',
    sponsor: 'Global Health Pharma',
    description: 'A randomized controlled trial evaluating PQR404 in hospitalized patients with moderate to severe COVID-19.',
    startDate: new Date('2023-09-01'),
    endDate: new Date('2024-08-31'),
    estimatedCompletion: new Date('2024-08-31'),
    enrollmentTarget: 1000,
    currentEnrollment: 1000,
    principalInvestigator: {
      name: 'Dr. Maria Garcia',
      affiliation: 'Infectious Disease Research Center',
      email: 'maria.garcia@idrc.org'
    },
    inclusionCriteria: [
      'Age ≥18 years',
      'Confirmed COVID-19 infection',
      'Hospitalized with moderate to severe disease',
      'Symptom onset within 10 days'
    ],
    exclusionCriteria: [
      'Mechanical ventilation >48 hours',
      'Severe hepatic impairment',
      'Pregnancy',
      'Known hypersensitivity'
    ],
    primaryEndpoint: 'Time to clinical improvement',
    secondaryEndpoints: [
      'Mortality at day 28',
      'Ventilator-free days',
      'Hospital length of stay'
    ]
  },
  {
    trialId: 'CT-2024-008',
    title: 'Phase II Study of STU505 in Chronic Migraine',
    drug: 'STU505',
    phase: 'Phase II',
    status: 'Recruiting',
    indication: 'Chronic Migraine',
    sponsor: 'PainRelief Pharmaceuticals',
    description: 'Efficacy and safety of STU505 in prevention of chronic migraine in adults.',
    startDate: new Date('2024-07-01'),
    estimatedCompletion: new Date('2025-12-31'),
    enrollmentTarget: 400,
    currentEnrollment: 156,
    principalInvestigator: {
      name: 'Dr. Susan Taylor',
      affiliation: 'Headache and Pain Center',
      email: 'susan.taylor@hpc.org'
    },
    inclusionCriteria: [
      'Age 18-65 years',
      'Chronic migraine (≥15 headache days/month)',
      'History of migraine for ≥1 year',
      'Failed ≥2 preventive treatments'
    ],
    exclusionCriteria: [
      'Medication overuse headache',
      'Other primary headache disorders',
      'Botulinum toxin within 4 months',
      'CGRP antagonist within 3 months'
    ],
    primaryEndpoint: 'Change in monthly migraine days at 12 weeks',
    secondaryEndpoints: [
      'Responder rate (≥50% reduction)',
      'Acute medication use',
      'Disability and quality of life'
    ]
  }
];

// Sample data for Drugs
const drugsData = [
  {
    drugId: 'ABC123',
    name: 'ABC123',
    genericName: 'Glucomaxin',
    brandName: 'DiabeCare',
    class: 'DPP-4 Inhibitor',
    mechanismOfAction: 'Inhibits dipeptidyl peptidase-4 enzyme, increasing incretin levels and improving glycemic control',
    indications: ['Type 2 Diabetes Mellitus', 'Metabolic Syndrome'],
    contraindications: ['Type 1 Diabetes', 'Diabetic ketoacidosis', 'Severe renal impairment'],
    sideEffects: [
      { severity: 'Mild', description: 'Headache', frequency: 'Common (5-10%)' },
      { severity: 'Mild', description: 'Nasopharyngitis', frequency: 'Common (8%)' },
      { severity: 'Moderate', description: 'Hypoglycemia (when combined with sulfonylurea)', frequency: 'Occasional (2-5%)' },
      { severity: 'Severe', description: 'Pancreatitis', frequency: 'Rare (<1%)' }
    ],
    dosageForm: 'Tablet',
    dosageStrength: [
      { value: 25, unit: 'mg' },
      { value: 50, unit: 'mg' },
      { value: 100, unit: 'mg' }
    ],
    administrationRoute: 'Oral',
    manufacturer: {
      name: 'PharmaCorp International',
      country: 'USA',
      contact: 'info@pharmacorp.com'
    },
    approvalStatus: {
      fda: {
        approved: false,
        approvalDate: null,
        nda: 'NDA-212345'
      },
      ema: {
        approved: false,
        approvalDate: null
      }
    },
    pharmacokinetics: {
      absorption: 'Rapidly absorbed, peak concentration at 1-2 hours',
      distribution: 'Volume of distribution approximately 250 L',
      metabolism: 'Primarily hepatic via CYP3A4',
      excretion: '70% renal, 30% fecal',
      halfLife: '12-14 hours'
    },
    storageConditions: 'Store at 20-25°C (68-77°F)',
    shelfLife: '24 months'
  },
  {
    drugId: 'XYZ789',
    name: 'XYZ789',
    genericName: 'Cardiozine',
    brandName: 'PressControl',
    class: 'Angiotensin Receptor-Neprilysin Inhibitor (ARNI)',
    mechanismOfAction: 'Dual mechanism: blocks angiotensin II receptors and inhibits neprilysin, reducing blood pressure and improving cardiac function',
    indications: ['Essential Hypertension', 'Heart Failure with Reduced Ejection Fraction'],
    contraindications: ['Pregnancy', 'History of angioedema', 'Concomitant ACE inhibitor use'],
    sideEffects: [
      { severity: 'Mild', description: 'Dizziness', frequency: 'Common (6%)' },
      { severity: 'Mild', description: 'Cough', frequency: 'Common (4%)' },
      { severity: 'Moderate', description: 'Hypotension', frequency: 'Occasional (3%)' },
      { severity: 'Severe', description: 'Angioedema', frequency: 'Rare (0.4%)' }
    ],
    dosageForm: 'Tablet',
    dosageStrength: [
      { value: 50, unit: 'mg' },
      { value: 100, unit: 'mg' },
      { value: 200, unit: 'mg' }
    ],
    administrationRoute: 'Oral',
    manufacturer: {
      name: 'CardioMed Solutions',
      country: 'Switzerland',
      contact: 'contact@cardiomed.ch'
    },
    approvalStatus: {
      fda: {
        approved: false,
        approvalDate: null,
        nda: 'NDA-207331'
      },
      ema: {
        approved: false,
        approvalDate: null
      }
    },
    pharmacokinetics: {
      absorption: 'Well absorbed, not significantly affected by food',
      distribution: 'Highly bound to plasma proteins (>95%)',
      metabolism: 'Hepatic metabolism by esterases',
      excretion: '60% renal, 40% biliary',
      halfLife: '11-12 hours'
    },
    storageConditions: 'Store at 15-30°C (59-86°F)',
    shelfLife: '36 months'
  },
  {
    drugId: 'DEF456',
    name: 'DEF456',
    genericName: 'Oncolysin',
    brandName: 'TumorBlock',
    class: 'Tyrosine Kinase Inhibitor',
    mechanismOfAction: 'Selectively inhibits multiple receptor tyrosine kinases involved in tumor growth and angiogenesis',
    indications: ['Advanced Solid Tumors', 'Non-Small Cell Lung Cancer', 'Renal Cell Carcinoma'],
    contraindications: ['Severe hepatic impairment', 'Pregnancy', 'Lactation'],
    sideEffects: [
      { severity: 'Mild', description: 'Diarrhea', frequency: 'Very Common (45%)' },
      { severity: 'Mild', description: 'Fatigue', frequency: 'Very Common (40%)' },
      { severity: 'Moderate', description: 'Hypertension', frequency: 'Common (25%)' },
      { severity: 'Moderate', description: 'Hand-foot syndrome', frequency: 'Common (20%)' },
      { severity: 'Severe', description: 'Hepatotoxicity', frequency: 'Occasional (5%)' }
    ],
    dosageForm: 'Capsule',
    dosageStrength: [
      { value: 200, unit: 'mg' },
      { value: 400, unit: 'mg' }
    ],
    administrationRoute: 'Oral',
    manufacturer: {
      name: 'OncoPharma Research',
      country: 'USA',
      contact: 'info@oncopharma.com'
    },
    approvalStatus: {
      fda: {
        approved: false,
        approvalDate: null,
        nda: 'NDA-208456'
      },
      ema: {
        approved: false,
        approvalDate: null
      }
    },
    pharmacokinetics: {
      absorption: 'Moderate absorption, increased with food',
      distribution: 'Extensive tissue distribution',
      metabolism: 'Hepatic via CYP3A4 and CYP2C8',
      excretion: 'Primarily fecal (77%), minimal renal',
      halfLife: '40-60 hours'
    },
    storageConditions: 'Store at 2-8°C (36-46°F)',
    shelfLife: '18 months'
  },
  {
    drugId: 'GHI101',
    name: 'GHI101',
    genericName: 'Neuromoodin',
    brandName: 'MindLift',
    class: 'Multimodal Serotonergic Agent',
    mechanismOfAction: 'Combines serotonin reuptake inhibition with 5-HT receptor modulation for enhanced antidepressant effect',
    indications: ['Major Depressive Disorder', 'Generalized Anxiety Disorder'],
    contraindications: ['MAOI use within 14 days', 'Uncontrolled epilepsy', 'Severe liver disease'],
    sideEffects: [
      { severity: 'Mild', description: 'Nausea', frequency: 'Common (20%)' },
      { severity: 'Mild', description: 'Insomnia', frequency: 'Common (15%)' },
      { severity: 'Moderate', description: 'Sexual dysfunction', frequency: 'Common (12%)' },
      { severity: 'Severe', description: 'Serotonin syndrome (with other serotonergic drugs)', frequency: 'Rare (<1%)' }
    ],
    dosageForm: 'Tablet',
    dosageStrength: [
      { value: 10, unit: 'mg' },
      { value: 20, unit: 'mg' }
    ],
    administrationRoute: 'Oral',
    manufacturer: {
      name: 'NeuroPharma Inc',
      country: 'Denmark',
      contact: 'support@neuropharma.dk'
    },
    approvalStatus: {
      fda: {
        approved: false,
        approvalDate: null,
        nda: 'NDA-204447'
      },
      ema: {
        approved: false,
        approvalDate: null
      }
    },
    pharmacokinetics: {
      absorption: 'Well absorbed, time to peak 7-11 hours',
      distribution: 'High volume of distribution',
      metabolism: 'Extensive hepatic metabolism via multiple pathways',
      excretion: 'Primarily renal (59%), fecal (26%)',
      halfLife: '66 hours'
    },
    storageConditions: 'Store at 20-25°C (68-77°F)',
    shelfLife: '36 months'
  },
  {
    drugId: 'JKL202',
    name: 'JKL202',
    genericName: 'Inflammazole',
    brandName: 'JointEase',
    class: 'JAK Inhibitor',
    mechanismOfAction: 'Selective inhibition of Janus kinases (JAK1 and JAK2), reducing inflammatory cytokine signaling',
    indications: ['Rheumatoid Arthritis', 'Psoriatic Arthritis', 'Ulcerative Colitis'],
    contraindications: ['Active serious infection', 'Severe hepatic impairment', 'Pregnancy'],
    sideEffects: [
      { severity: 'Mild', description: 'Upper respiratory infections', frequency: 'Common (14%)' },
      { severity: 'Mild', description: 'Headache', frequency: 'Common (8%)' },
      { severity: 'Moderate', description: 'Increased cholesterol', frequency: 'Common (10%)' },
      { severity: 'Severe', description: 'Serious infections', frequency: 'Occasional (3%)' }
    ],
    dosageForm: 'Tablet',
    dosageStrength: [
      { value: 5, unit: 'mg' },
      { value: 10, unit: 'mg' }
    ],
    administrationRoute: 'Oral',
    manufacturer: {
      name: 'ImmunoTherapeutics Ltd',
      country: 'UK',
      contact: 'contact@immunotherapeutics.co.uk'
    },
    approvalStatus: {
      fda: {
        approved: false,
        approvalDate: null,
        nda: 'NDA-203214'
      },
      ema: {
        approved: false,
        approvalDate: null
      }
    },
    pharmacokinetics: {
      absorption: 'Rapid absorption, peak at 0.5-1 hour',
      distribution: 'Moderate protein binding (40%)',
      metabolism: 'Hepatic via CYP3A4 and CYP2C19',
      excretion: 'Primarily renal (70%)',
      halfLife: '3 hours'
    },
    storageConditions: 'Store at 20-25°C (68-77°F)',
    shelfLife: '24 months'
  }
];

// Sample data for Trial Sites
const trialSitesData = [
  {
    siteId: 'SITE-001',
    name: 'Medical Research Institute - Boston',
    type: 'Research Center',
    address: {
      street: '123 Research Boulevard',
      city: 'Boston',
      state: 'MA',
      country: 'USA',
      postalCode: '02115',
      coordinates: {
        latitude: 42.3601,
        longitude: -71.0589
      }
    },
    contact: {
      primaryContact: {
        name: 'Dr. Sarah Johnson',
        role: 'Site Director',
        phone: '+1-617-555-0101',
        email: 'sarah.johnson@mri.org'
      },
      emergencyContact: {
        phone: '+1-617-555-0911',
        email: 'emergency@mri.org'
      }
    },
    capabilities: {
      maxCapacity: 200,
      currentLoad: 145,
      specializations: ['Endocrinology', 'Cardiology', 'Oncology'],
      equipmentAvailable: ['MRI', 'CT Scan', 'Laboratory', 'Pharmacy'],
      certifications: [
        {
          name: 'GCP Certification',
          issuedBy: 'FDA',
          validUntil: new Date('2025-12-31')
        },
        {
          name: 'CAP Accreditation',
          issuedBy: 'College of American Pathologists',
          validUntil: new Date('2026-06-30')
        }
      ]
    },
    staffing: {
      principalInvestigators: [
        {
          name: 'Dr. Sarah Johnson',
          qualification: 'MD, PhD',
          yearsOfExperience: 15,
          email: 'sarah.johnson@mri.org'
        }
      ],
      coordinators: [
        {
          name: 'Jennifer Martinez',
          role: 'Clinical Research Coordinator',
          email: 'jennifer.martinez@mri.org'
        }
      ],
      totalStaff: 45
    },
    performance: {
      totalTrialsCompleted: 28,
      averageEnrollmentTime: 45,
      protocolDeviations: 3,
      averageRating: 4.7
    },
    accreditation: {
      isAccredited: true,
      accreditingBody: 'AAHRPP',
      accreditationDate: new Date('2022-01-15'),
      expiryDate: new Date('2025-01-14')
    },
    operatingHours: {
      weekdays: '8:00 AM - 6:00 PM',
      weekends: 'Closed',
      timezone: 'EST'
    },
    isActive: true
  },
  {
    siteId: 'SITE-002',
    name: 'Cardiovascular Research Center - New York',
    type: 'Hospital',
    address: {
      street: '456 Heart Avenue',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      postalCode: '10016',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    },
    contact: {
      primaryContact: {
        name: 'Dr. Michael Chen',
        role: 'Chief Investigator',
        phone: '+1-212-555-0202',
        email: 'michael.chen@crc.org'
      },
      emergencyContact: {
        phone: '+1-212-555-0911',
        email: 'emergency@crc.org'
      }
    },
    capabilities: {
      maxCapacity: 150,
      currentLoad: 98,
      specializations: ['Cardiology', 'Interventional Cardiology', 'Electrophysiology'],
      equipmentAvailable: ['Cath Lab', 'Echocardiography', 'Stress Testing', 'Holter Monitoring'],
      certifications: [
        {
          name: 'ACC Accreditation',
          issuedBy: 'American College of Cardiology',
          validUntil: new Date('2026-03-31')
        }
      ]
    },
    staffing: {
      principalInvestigators: [
        {
          name: 'Dr. Michael Chen',
          qualification: 'MD, FACC',
          yearsOfExperience: 20,
          email: 'michael.chen@crc.org'
        }
      ],
      coordinators: [
        {
          name: 'David Thompson',
          role: 'Senior Clinical Coordinator',
          email: 'david.thompson@crc.org'
        }
      ],
      totalStaff: 38
    },
    performance: {
      totalTrialsCompleted: 35,
      averageEnrollmentTime: 38,
      protocolDeviations: 2,
      averageRating: 4.8
    },
    accreditation: {
      isAccredited: true,
      accreditingBody: 'AAHRPP',
      accreditationDate: new Date('2021-06-01'),
      expiryDate: new Date('2024-05-31')
    },
    operatingHours: {
      weekdays: '7:00 AM - 7:00 PM',
      weekends: '9:00 AM - 5:00 PM',
      timezone: 'EST'
    },
    isActive: true
  },
  {
    siteId: 'SITE-003',
    name: 'Cancer Treatment Center - Los Angeles',
    type: 'Research Center',
    address: {
      street: '789 Oncology Drive',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      postalCode: '90033',
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    },
    contact: {
      primaryContact: {
        name: 'Dr. Emily Rodriguez',
        role: 'Director of Clinical Trials',
        phone: '+1-323-555-0303',
        email: 'emily.rodriguez@ctc.org'
      },
      emergencyContact: {
        phone: '+1-323-555-0911',
        email: 'emergency@ctc.org'
      }
    },
    capabilities: {
      maxCapacity: 180,
      currentLoad: 124,
      specializations: ['Medical Oncology', 'Radiation Oncology', 'Hematology'],
      equipmentAvailable: ['PET-CT', 'Linear Accelerator', 'Bone Marrow Lab', 'Infusion Center'],
      certifications: [
        {
          name: 'NCI Designation',
          issuedBy: 'National Cancer Institute',
          validUntil: new Date('2027-12-31')
        }
      ]
    },
    staffing: {
      principalInvestigators: [
        {
          name: 'Dr. Emily Rodriguez',
          qualification: 'MD, PhD, FASCO',
          yearsOfExperience: 18,
          email: 'emily.rodriguez@ctc.org'
        }
      ],
      coordinators: [
        {
          name: 'Maria Santos',
          role: 'Lead Research Nurse',
          email: 'maria.santos@ctc.org'
        }
      ],
      totalStaff: 52
    },
    performance: {
      totalTrialsCompleted: 42,
      averageEnrollmentTime: 52,
      protocolDeviations: 4,
      averageRating: 4.9
    },
    accreditation: {
      isAccredited: true,
      accreditingBody: 'OHRP',
      accreditationDate: new Date('2020-09-15'),
      expiryDate: new Date('2025-09-14')
    },
    operatingHours: {
      weekdays: '7:00 AM - 8:00 PM',
      weekends: '8:00 AM - 4:00 PM',
      timezone: 'PST'
    },
    isActive: true
  }
];

// Sample data for Participants
const participantsData = [
  {
    participantId: 'P-2024-0001',
    demographics: {
      ageGroup: '46-60',
      gender: 'Male',
      ethnicity: 'Caucasian',
      weight: { value: 85, unit: 'kg' },
      height: { value: 175, unit: 'cm' }
    },
    enrollmentInfo: {
      enrollmentDate: new Date('2024-02-15'),
      status: 'Active',
      randomizationGroup: 'Treatment',
      consentDate: new Date('2024-02-10'),
      consentVersion: 'v2.1'
    },
    medicalHistory: {
      primaryDiagnosis: 'Type 2 Diabetes Mellitus',
      secondaryDiagnoses: ['Hypertension', 'Dyslipidemia'],
      allergies: ['Penicillin'],
      currentMedications: [
        {
          name: 'Metformin',
          dosage: '1000mg',
          frequency: 'Twice daily',
          startDate: new Date('2022-06-01')
        }
      ]
    },
    baselineVitals: {
      bloodPressure: { systolic: 138, diastolic: 88 },
      heartRate: 72,
      temperature: 36.8,
      respiratoryRate: 16,
      oxygenSaturation: 98
    },
    compliance: {
      medicationCompliance: 95,
      visitCompliance: 100
    }
  },
  {
    participantId: 'P-2024-0002',
    demographics: {
      ageGroup: '31-45',
      gender: 'Female',
      ethnicity: 'Hispanic',
      weight: { value: 68, unit: 'kg' },
      height: { value: 162, unit: 'cm' }
    },
    enrollmentInfo: {
      enrollmentDate: new Date('2024-03-20'),
      status: 'Active',
      randomizationGroup: 'Placebo',
      consentDate: new Date('2024-03-18'),
      consentVersion: 'v2.1'
    },
    medicalHistory: {
      primaryDiagnosis: 'Essential Hypertension',
      secondaryDiagnoses: [],
      allergies: [],
      currentMedications: []
    },
    baselineVitals: {
      bloodPressure: { systolic: 152, diastolic: 95 },
      heartRate: 78,
      temperature: 36.6,
      respiratoryRate: 14,
      oxygenSaturation: 99
    },
    compliance: {
      medicationCompliance: 98,
      visitCompliance: 100
    }
  }
];

// Sample data for Adverse Events
const adverseEventsData = [
  {
    eventId: 'AE-2024-00001',
    eventDetails: {
      term: 'Headache',
      description: 'Mild headache reported by participant, resolved with over-the-counter analgesic',
      category: 'Neurological',
      severity: 'Mild',
      seriousness: {
        isSerious: false,
        criteria: []
      }
    },
    timing: {
      onsetDate: new Date('2024-03-25'),
      detectionDate: new Date('2024-03-25'),
      resolutionDate: new Date('2024-03-26'),
      duration: '1 day',
      timeFromDrugAdministration: '4 hours'
    },
    outcome: {
      status: 'Resolved',
      actionTaken: 'Concomitant Medication Given',
      treatmentRequired: true,
      treatmentDetails: 'Acetaminophen 500mg as needed'
    },
    causality: {
      relationshipToDrug: 'Possible',
      assessedBy: 'Dr. Sarah Johnson',
      assessmentDate: new Date('2024-03-26'),
      alternativeCauses: ['Stress', 'Caffeine withdrawal']
    },
    reporting: {
      reportedBy: {
        name: 'Jennifer Martinez',
        role: 'Clinical Research Coordinator',
        date: new Date('2024-03-25')
      },
      reportedToSponsor: {
        reported: true,
        reportDate: new Date('2024-03-26'),
        reportNumber: 'SPR-2024-001'
      },
      reportedToRegulatory: {
        reported: false
      },
      reportedToIRB: {
        reported: false
      }
    },
    narrative: 'A 52-year-old male participant in the ABC123 diabetes trial reported mild headache 4 hours after taking study medication. The headache was treated with acetaminophen 500mg and resolved within 24 hours. The investigator assessed the event as possibly related to study drug.'
  },
  {
    eventId: 'AE-2024-00002',
    eventDetails: {
      term: 'Hypotension',
      description: 'Transient symptomatic hypotension requiring dose adjustment',
      category: 'Cardiovascular',
      severity: 'Moderate',
      seriousness: {
        isSerious: false,
        criteria: []
      }
    },
    timing: {
      onsetDate: new Date('2024-04-10'),
      detectionDate: new Date('2024-04-10'),
      resolutionDate: new Date('2024-04-15'),
      duration: '5 days',
      timeFromDrugAdministration: '2 hours'
    },
    outcome: {
      status: 'Resolved',
      actionTaken: 'Dose Reduced',
      treatmentRequired: false,
      treatmentDetails: 'Dose reduced from 200mg to 100mg daily'
    },
    causality: {
      relationshipToDrug: 'Probable',
      assessedBy: 'Dr. Michael Chen',
      assessmentDate: new Date('2024-04-11'),
      alternativeCauses: []
    },
    reporting: {
      reportedBy: {
        name: 'David Thompson',
        role: 'Senior Clinical Coordinator',
        date: new Date('2024-04-10')
      },
      reportedToSponsor: {
        reported: true,
        reportDate: new Date('2024-04-11'),
        reportNumber: 'SPR-2024-002'
      },
      reportedToRegulatory: {
        reported: false
      },
      reportedToIRB: {
        reported: true,
        reportDate: new Date('2024-04-11')
      }
    },
    narrative: 'A 38-year-old female participant experienced symptomatic hypotension (BP 88/55 mmHg) with dizziness 2 hours after taking XYZ789 200mg. The dose was reduced to 100mg daily. Blood pressure normalized within 5 days. The investigator assessed the event as probably related to study medication.'
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to database
    await database.connect();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      ClinicalTrial.deleteMany({}),
      Drug.deleteMany({}),
      TrialSite.deleteMany({}),
      Participant.deleteMany({}),
      AdverseEvent.deleteMany({})
    ]);
    console.log('✅ Existing data cleared\n');

    // Seed Drugs first (referenced by trials)
    console.log('💊 Seeding Drugs collection...');
    const drugs = await Drug.insertMany(drugsData);
    console.log(`✅ Inserted ${drugs.length} drugs\n`);

    // Seed Trial Sites
    console.log('🏥 Seeding Trial Sites collection...');
    const sites = await TrialSite.insertMany(trialSitesData);
    console.log(`✅ Inserted ${sites.length} trial sites\n`);

    // Seed Clinical Trials with references
    console.log('🔬 Seeding Clinical Trials collection...');
    const trialsWithRefs = clinicalTrialsData.map((trial, index) => ({
      ...trial,
      sites: [sites[index % sites.length]._id]
    }));
    const trials = await ClinicalTrial.insertMany(trialsWithRefs);
    console.log(`✅ Inserted ${trials.length} clinical trials\n`);

    // Update drugs with trial references
    console.log('🔗 Linking drugs to trials...');
    for (const drug of drugs) {
      const relatedTrials = trials.filter(t => t.drug === drug.drugId);
      drug.clinicalTrials = relatedTrials.map(t => t._id);
      await drug.save();
    }
    console.log('✅ Drug-trial links updated\n');

    // Seed Participants with references
    console.log('👥 Seeding Participants collection...');
    const participantsWithRefs = participantsData.map((participant, index) => ({
      ...participant,
      trial: trials[index % trials.length]._id,
      site: sites[index % sites.length]._id
    }));
    const participants = await Participant.insertMany(participantsWithRefs);
    console.log(`✅ Inserted ${participants.length} participants\n`);

    // Seed Adverse Events with references
    console.log('⚠️  Seeding Adverse Events collection...');
    const adverseEventsWithRefs = adverseEventsData.map((event, index) => ({
      ...event,
      trial: trials[index % trials.length]._id,
      participant: participants[index % participants.length]._id,
      site: sites[index % sites.length]._id
    }));
    const adverseEvents = await AdverseEvent.insertMany(adverseEventsWithRefs);
    console.log(`✅ Inserted ${adverseEvents.length} adverse events\n`);

    // Update trial references with participants and adverse events
    console.log('🔗 Linking participants and adverse events to trials...');
    for (const trial of trials) {
      const trialParticipants = participants.filter(p => p.trial.toString() === trial._id.toString());
      const trialAdverseEvents = adverseEvents.filter(ae => ae.trial.toString() === trial._id.toString());
      trial.participants = trialParticipants.map(p => p._id);
      trial.adverseEvents = trialAdverseEvents.map(ae => ae._id);
      await trial.save();
    }
    console.log('✅ All references linked\n');

    // Print summary
    console.log('📊 Database Seeding Summary:');
    console.log('═'.repeat(50));
    console.log(`✅ Clinical Trials: ${trials.length}`);
    console.log(`✅ Drugs: ${drugs.length}`);
    console.log(`✅ Trial Sites: ${sites.length}`);
    console.log(`✅ Participants: ${participants.length}`);
    console.log(`✅ Adverse Events: ${adverseEvents.length}`);
    console.log('═'.repeat(50));
    console.log('\n🎉 Database seeding completed successfully!\n');

    // Sample queries to verify
    console.log('🔍 Running verification queries...\n');

    const activeTrials = await ClinicalTrial.find({ status: 'Active' }).countDocuments();
    console.log(`   Active Trials: ${activeTrials}`);

    const phase3Trials = await ClinicalTrial.find({ phase: 'Phase III' }).countDocuments();
    console.log(`   Phase III Trials: ${phase3Trials}`);

    const recruitingTrials = await ClinicalTrial.find({ status: 'Recruiting' }).countDocuments();
    console.log(`   Recruiting Trials: ${recruitingTrials}\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
