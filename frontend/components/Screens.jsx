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
            📷 Take Photo
            <span className="upload-subtitle">Use device camera</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="upload-btn">
            📁 Upload Image
            <span className="upload-subtitle">From gallery or files</span>
          </button>
          
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" 
                 onChange={onImageSelect} style={{display: 'none'}} />
          <input ref={fileInputRef} type="file" accept="image/*" 
                 onChange={onImageSelect} style={{display: 'none'}} />
        </div>
      )}

      <div className="info-box">
        <strong>📸 Clinical Photography Guidelines:</strong> Ensure good lighting, include a
