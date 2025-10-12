require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Dermatology AI Backend Running',
    timestamp: new Date().toISOString()
  });
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { image, anamnesis } = req.body;

    if (!image || !anamnesis) {
      return res.status(400).json({ 
        error: 'Missing required data',
        message: 'Both image and anamnesis data are required'
      });
    }

    console.log('📸 Starting analysis...');

    // Step 1: Analyze with Google Cloud Vision
    const visionResults = await analyzeImageWithVision(image);
    console.log('✅ Vision analysis complete');

    // Step 2: Generate clinical analysis with Gemini
    const clinicalAnalysis = await generateClinicalAnalysis(visionResults, anamnesis);
    console.log('✅ Clinical analysis complete');

    // Step 3: Return combined results
    res.json({
      timestamp: new Date().toISOString(),
      visionData: visionResults.responses[0],
      ...clinicalAnalysis
    });

  } catch (error) {
    console.error('❌ Analysis error:', error.message);
    res.status(500).json({ 
      error: 'Analysis failed', 
      message: error.message 
    });
  }
});

// Google Cloud Vision API
async function analyzeImageWithVision(base64Image) {
  const visionUrl = `https://vision.googleapis.com/v1/images:annotate?key=${process.env.VISION_API_KEY}`;
  
  const requestBody = {
    requests: [{
      image: {
        content: base64Image.split(',')[1]
      },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 20 },
        { type: 'WEB_DETECTION', maxResults: 10 },
        { type: 'IMAGE_PROPERTIES' }
      ]
    }]
  };

  const response = await fetch(visionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Vision API Error: ${errorData.error?.message || 'Unknown error'}`);
  }

  return await response.json();
}

// Google Gemini API
async function generateClinicalAnalysis(visionResults, anamnesisData) {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;
  
  const labels = visionResults.responses[0].labelAnnotations?.map(l => l.description).join(', ') || 'None';
  const webEntities = visionResults.responses[0].webDetection?.webEntities?.map(e => e.description).filter(Boolean).slice(0, 5).join(', ') || 'None';

  const prompt = `You are an experienced dermatologist providing consultation support to a family physician. Analyze this case and provide a structured differential diagnosis.

IMAGE ANALYSIS RESULTS:
- Detected labels: ${labels}
- Web entities: ${webEntities}

PATIENT HISTORY:
- Duration: ${anamnesisData.duration || 'Not specified'}
- Onset: ${anamnesisData.onset}
- Location: ${anamnesisData.location || 'Not specified'}
- Symptoms: ${anamnesisData.symptoms?.join(', ') || 'None reported'}
- Previous treatments: ${anamnesisData.previousTreatment || 'None'}
- Medical history: ${anamnesisData.medicalHistory || 'None reported'}
- Current medications: ${anamnesisData.medications || 'None'}
- Allergies: ${anamnesisData.allergies || 'None known'}
- Family history: ${anamnesisData.familyHistory || 'None reported'}

Provide your analysis in JSON format with exactly this structure:
{
  "differential": [
    {
      "condition": "Most likely diagnosis name",
      "confidence": "High",
      "description": "Clinical reasoning in 2-3 sentences explaining why this diagnosis fits"
    },
    {
      "condition": "Second most likely diagnosis",
      "confidence": "Moderate",
      "description": "Clinical reasoning in 2-3 sentences"
    },
    {
      "condition": "Third differential diagnosis",
      "confidence": "Low",
      "description": "Clinical reasoning in 2-3 sentences"
    }
  ],
  "urgency": "routine",
  "clinicalNotes": [
    "Key clinical obs
