// Capture Screen
const CaptureScreen = ({ imagePreview, onImageSelect, onContinue, onRetake }) => {
  const fileInputRef = React.useRef(null);
  const cameraInputRef = React.useRef(null);

  return (
    <div className="screen">
      <h2>Skin Finding Documentation</h2>
      <p className="subtitle">Capture or upload an image of the skin lesion</p>
      
      {imagePreview ? (
        <div>
          <img src={imagePreview} alt="Skin finding" className="preview-image" />
          <div className="button-group">
            <button onClick={onRetake} className="btn-secondary">Retake</button>
            <button onClick={onContinue} className="btn-primary">Continue →</button>
          </div>
        </div>
      ) : (
        <div className="upload-options">
          <button onClick={() => cameraInputRef.current?.click()} className="upload-btn">
            <div className="upload-icon">📷</div>
            <div className="upload-text">
              <div className="upload-title">Take Photo</div>
              <div className="upload-subtitle">Use device camera</div>
            </div>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="upload-btn">
            <div className="upload-icon">📁</div>
            <div className="upload-text">
              <div className="upload-title">Upload Image</div>
              <div className="upload-subtitle">From gallery or files</div>
            </div>
          </button>
          
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" 
                 onChange={onImageSelect} style={{display: 'none'}} />
          <input ref={fileInputRef} type="file" accept="image/*" 
                 onChange={onImageSelect} style={{display: 'none'}} />
        </div>
      )}

      <div className="info-box">
        <strong>📸 Clinical Photography Guidelines:</strong> Ensure good lighting, include a ruler if possible, capture multiple angles if relevant, and maintain patient privacy.
      </div>
    </div>
  );
};

// Anamnesis Screen
const AnamnesisScreen = ({ anamnesis, onChange, onSubmit, onBack, error, isAnalyzing }) => (
  <div className="screen">
    <div className="screen-header">
      <h2>Clinical History</h2>
      <button onClick={onBack} className="back-btn">← Back</button>
    </div>
    
    {error && (
      <div className="error-box">
        <strong>⚠️ Error:</strong> {error}
      </div>
    )}
    
    <div className="form-group">
      <label>Duration of Lesion</label>
      <input 
        type="text" 
        value={anamnesis.duration} 
        onChange={(e) => onChange('duration', e.target.value)}
        placeholder="e.g., 2 weeks, 3 months" 
      />
    </div>

    <div className="form-group">
      <label>Onset Pattern</label>
      <div className="toggle-group">
        {['gradual', 'sudden'].map(onset => (
          <button
            key={onset}
            onClick={() => onChange('onset', onset)}
            className={`toggle-btn ${anamnesis.onset === onset ? 'active' : ''}`}
          >
            {onset.charAt(0).toUpperCase() + onset.slice(1)}
          </button>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label>Body Location</label>
      <input 
        type="text" 
        value={anamnesis.location}
        onChange={(e) => onChange('location', e.target.value)}
        placeholder="e.g., left forearm, trunk" 
      />
    </div>

    <div className="form-group">
      <label>Associated Symptoms</label>
      <div className="symptom-grid">
        {SYMPTOM_OPTIONS.map(symptom => (
          <button
            key={symptom}
            onClick={() => {
              const newSymptoms = anamnesis.symptoms.includes(symptom)
                ? anamnesis.symptoms.filter(s => s !== symptom)
                : [...anamnesis.symptoms, symptom];
              onChange('symptoms', newSymptoms);
            }}
            className={`symptom-btn ${anamnesis.symptoms.includes(symptom) ? 'selected' : ''}`}
          >
            {symptom}
          </button>
        ))}
      </div>
    </div>

    <div className="form-group">
      <label>Previous Treatments</label>
      <textarea 
        value={anamnesis.previousTreatment}
        onChange={(e) => onChange('previousTreatment', e.target.value)}
        placeholder="Any OTC or prescribed treatments tried"
        rows="3"
      />
    </div>

    <div className="form-group">
      <label>Relevant Medical History</label>
      <textarea 
        value={anamnesis.medicalHistory}
        onChange={(e) => onChange('medicalHistory', e.target.value)}
        placeholder="Diabetes, immunosuppression, skin conditions, etc."
        rows="3"
      />
    </div>

    <div className="form-group">
      <label>Current Medications</label>
      <textarea 
        value={anamnesis.medications}
        onChange={(e) => onChange('medications', e.target.value)}
        placeholder="List current medications"
        rows="2"
      />
    </div>

    <div className="form-group">
      <label>Known Allergies</label>
      <input 
        type="text" 
        value={anamnesis.allergies}
        onChange={(e) => onChange('allergies', e.target.value)}
        placeholder="Drug or contact allergies" 
      />
    </div>

    <div className="form-group">
      <label>Family History</label>
      <textarea 
        value={anamnesis.familyHistory}
        onChange={(e) => onChange('familyHistory', e.target.value)}
        placeholder="Relevant family history of skin conditions"
        rows="2"
      />
    </div>

    <button 
      onClick={onSubmit} 
      disabled={isAnalyzing}
      className="btn-primary btn-full"
    >
      {isAnalyzing ? 'Analyzing...' : 'Generate AI Analysis →'}
    </button>
  </div>
);

// Analysis Screen
const AnalysisScreen = () => (
  <div className="screen analysis-screen">
    <div className="spinner"></div>
    <h3>Analyzing Clinical Data</h3>
    <p>Processing with Google Cloud Vision & Gemini AI...</p>
    <p className="analysis-note">This may take 10-30 seconds</p>
  </div>
);

// Results Screen
const ResultsScreen = ({ results, imagePreview, onNewConsult, onPrint }) => (
  <div className="screen results-screen">
    <div className="results-header">
      <h2>Consultation Results</h2>
      <button onClick={onPrint} className="icon-btn">🖨</button>
    </div>
    
    <div className={`urgency-banner ${URGENCY_CONFIG[results.urgency]?.color || 'bg-green-100'}`}>
      <strong>{URGENCY_CONFIG[results.urgency]?.label || 'Assessment Complete'}</strong>
      <p>Based on AI analysis of clinical presentation</p>
    </div>

    <div className="result-section">
      <h3>Clinical Image</h3>
      <img src={imagePreview} alt="Finding" className="result-image" />
    </div>

    {results.differential && results.differential.length > 0 && (
      <div className="result-section">
        <h3>Differential Diagnosis</h3>
        {results.differential.map((dx, idx) => (
          <div key={idx} className="diagnosis-item">
            <div className="dx-header">
              <strong>{dx.condition}</strong>
              <span className={`confidence ${dx.confidence.toLowerCase()}`}>{dx.confidence}</span>
            </div>
            <p>{dx.description}</p>
          </div>
        ))}
      </div>
    )}

    {results.clinicalNotes && results.clinicalNotes.length > 0 && (
      <div className="result-section">
        <h3>Clinical Observations</h3>
        <ul>
          {results.clinicalNotes.map((note, idx) => (
            <li key={idx}>{note}</li>
          ))}
        </ul>
      </div>
    )}

    {results.recommendations?.immediate && results.recommendations.immediate.length > 0 && (
      <div className="result-section">
        <h3>Immediate Actions</h3>
        <ul className="action-list">
          {results.recommendations.immediate.map((rec, idx) => (
            <li key={idx}>✓ {rec}</li>
          ))}
        </ul>
      </div>
    )}

    {results.recommendations?.followUp && results.recommendations.followUp.length > 0 && (
      <div className="result-section">
        <h3>Follow-up Plan</h3>
        <ul className="action-list">
          {results.recommendations.followUp.map((rec, idx) => (
            <li key={idx}>📅 {rec}</li>
          ))}
        </ul>
      </div>
    )}

    {results.recommendations?.redFlags && results.recommendations.redFlags.length > 0 && (
      <div className="result-section red-flags">
        <h3>⚠️ Red Flags - Refer if Present</h3>
        <ul>
          {results.recommendations.redFlags.map((flag, idx) => (
            <li key={idx}>🚨 {flag}</li>
          ))}
        </ul>
      </div>
    )}

    <div className="disclaimer">
      ⚠️ <strong>Clinical Decision Support Tool:</strong> This AI-assisted analysis is intended to support, not replace, clinical judgment. Always correlate with physical examination and your clinical expertise.
    </div>

    <div className="button-group">
      <button onClick={onNewConsult} className="btn-secondary">New Consultation</button>
      <button onClick={onPrint} className="btn-primary">🖨 Print Report</button>
    </div>
  </div>
);
