// API service to call secure backend

const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3001'
  : '';

async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
      throw new Error('Backend server returned an error');
    }
    return await response.json();
  } catch (error) {
    console.error('Backend health check failed:', error);
    throw new Error('Backend server is not running. Please start it with: cd backend && npm start');
  }
}

async function analyzeWithBackend(imageData, anamnesisData) {
  try {
    const response = await fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageData,
        anamnesis: anamnesisData
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || errorData.error || 'Analysis failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Backend API error:', error);
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Make sure backend is running.');
    }
    throw error;
  }
}
