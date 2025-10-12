// Configuration and constants

const URGENCY_CONFIG = {
  routine: { 
    color: 'bg-green-100 text-green-800 border-green-300',
    label: 'Routine Follow-up'
  },
  soon: { 
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    label: 'Follow-up Soon'
  },
  urgent: { 
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    label: 'Urgent Evaluation'
  },
  emergency: { 
    color: 'bg-red-100 text-red-800 border-red-300',
    label: 'Emergency Referral'
  }
};

const SYMPTOM_OPTIONS = [
  'Itching', 'Pain', 'Burning', 'Bleeding', 'Oozing', 
  'Scaling', 'Swelling', 'Warmth', 'Numbness'
];

const INITIAL_ANAMNESIS = {
  duration: '',
  onset: 'gradual',
  location: '',
  symptoms: [],
  previousTreatment: '',
  medicalHistory: '',
  medications: '',
  allergies: '',
  familyHistory: ''
};
