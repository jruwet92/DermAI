const App = () => {
  const [step, setStep] = React.useState('capture');
  const [imageData, setImageData] = React.useState(null);
  const [anamnesis, setAnamnesis] = React.useState(INITIAL_ANAMNESIS);
  const [results, setResults] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnamnesisChange = (field, value) => {
    setAnamnesis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setStep('analysis');
    setError(null);

    try {
      await checkBackendHealth();
      const analysisResults = await analyzeWithBackend(imageData, anamnesis);
      setResults(analysisResults);
      setIsAnalyzing(false);
      setStep('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message);
      setIsAnalyzing(false);
      setStep('anamnesis');
    }
  };

  const resetApp = () => {
    setStep('capture');
    setImageData(null);
    setAnamnesis(INITIAL_ANAMNESIS);
    setResults(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">🩺</div>
          <div className="header-text">
            <h1>Dermatology AI Consultant</h1>
            <p>Powered by Google Cloud Vision & Gemini</p>
          </div>
        </div>
      </header>

      {step !== 'analysis' && <ProgressBar currentStep={step} />}

      <main className="app-main">
        {step === 'capture' && (
          <CaptureScreen
            imagePreview={imageData}
            onImageSelect={handleImageSelect}
            onContinue={() => setStep('anamnesis')}
            onRetake={() => setImageData(null)}
          />
        )}
        
        {step === 'anamnesis' && (
          <AnamnesisScreen
            anamnesis={anamnesis}
            onChange={handleAnamnesisChange}
            onSubmit={handleAnalyze}
            onBack={() => setStep('capture')}
            error={error}
            isAnalyzing={isAnalyzing}
          />
        )}
        
        {step === 'analysis' && <AnalysisScreen />}
        
        {step === 'results' && results && (
          <ResultsScreen
            results={results}
            imagePreview={imageData}
            onNewConsult={resetApp}
            onPrint={handlePrint}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>For healthcare professional use only. Not a substitute for clinical judgment.</p>
      </footer>
    </div>
  );
};
