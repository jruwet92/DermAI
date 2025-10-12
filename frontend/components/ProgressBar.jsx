const ProgressBar = ({ currentStep }) => {
  const steps = ['capture', 'anamnesis', 'results'];
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        {steps.map((step, idx) => (
          <React.Fragment key={step}>
            <div className="progress-step">
              <div className={`step-circle ${
                currentStep === step ? 'active' : 
                steps.indexOf(currentStep) > idx ? 'complete' : ''
              }`}>
                {steps.indexOf(currentStep) > idx ? '✓' : idx + 1}
              </div>
              <span className="step-label">
                {step === 'capture' ? 'Image' : step === 'anamnesis' ? 'History' : 'Results'}
              </span>
            </div>
            {idx < 2 && (
              <div className={`step-line ${steps.indexOf(currentStep) > idx ? 'complete' : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
