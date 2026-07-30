import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Memories.css';
import { uploadImage } from "../services/cloudinaryService";
import { saveMemory } from "../firebase/memories";

const Memories = () => {
  const [playerName, setPlayerName] = useState(
  localStorage.getItem("playerName") || ""
);

const [hasName, setHasName] = useState(
  localStorage.getItem("fromGames") === "true"
);
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const requestRef = useRef(0);

  const [imageData, setImageData] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [isStarting, setIsStarting] = useState(true);
  

  const stopCamera = useCallback(() => {
    requestRef.current += 1;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startCamera = useCallback(async () => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setCameraError('');
    setIsStarting(true);

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        'Camera access is not supported by this browser. Please try a modern browser or device.',
      );
      setIsStarting(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      if (requestRef.current !== requestId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      if (requestRef.current !== requestId) return;

      const permissionDenied =
        error?.name === 'NotAllowedError' ||
        error?.name === 'PermissionDeniedError';

      setCameraError(
        permissionDenied
          ? 'Camera permission was denied. Please allow camera access in your browser settings and try again.'
          : 'We could not start your camera. Check that it is connected and not being used by another app.',
      );
    } finally {
      if (requestRef.current === requestId) {
        setIsStarting(false);
      }
    }
  }, []);

  useEffect(() => {
  if (hasName) {
    startCamera();
  }

  return stopCamera;
}, [hasName, startCamera, stopCamera]);

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      setCameraError('The camera is still getting ready. Please try again.');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const capturedImage = canvas.toDataURL('image/png');
    setImageData(capturedImage);
    stopCamera();
  };

  const handleRetake = () => {
    setImageData(null);
    startCamera();
  };

  const handleUpload = async (capturedImage) => {
  try {
    // Upload to Cloudinary
    const imageUrl = await uploadImage(capturedImage);

    // Get player's name
    const playerName =
      localStorage.getItem("playerName") || "Anonymous";

    // Save to Firestore
    await saveMemory(playerName, imageUrl);

    alert("Photo uploaded successfully!");

    // Go to Memory Wall
    navigate("/memories");

  } catch (err) {
    console.error(err);
    alert("Upload failed.");
  }
};
const handleNameContinue = () => {
  if (playerName.trim().length < 3) {
    alert("Enter at least 3 characters");
    return;
  }

  localStorage.setItem("playerName", playerName.trim());
  setHasName(true);
};
  return (
    <main className="memories-page">
      <div className="memories-orb memories-orb-one" aria-hidden="true" />
      <div className="memories-orb memories-orb-two" aria-hidden="true" />

      <section className="memories-content">
        <button
          className="memories-back-button"
          type="button"
          onClick={() => navigate('/games')}
        >
          ← Game Hub
        </button>

        <header className="memories-header">
          <span className="memories-eyebrow">RUDRA PLAYHUB</span>
          <h1 className="memories-title">📸 Rudra Memories</h1>
          <p className="memories-subtitle">Capture your best moment!</p>
        </header>
        {!hasName ? (

<div className="camera-card">

  <div className="name-card">

    <div className="name-icon">📸</div>

    <h2>Capture Your Moment</h2>

    <p>Enter your name before taking your picture.</p>

    <input
      type="text"
      placeholder="Your Name"
      value={playerName}
      onChange={(e) => setPlayerName(e.target.value)}
    />

    <button
      className="memory-button upload-button"
      onClick={handleNameContinue}
    >
      Continue →
    </button>

  </div>

</div>

) : (

<div className="camera-card">
          <div className="camera-frame">
            {imageData ? (
              <img
                className="captured-image"
                src={imageData}
                alt="Your captured Rudra memory"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  className="camera-preview"
                  autoPlay
                  muted
                  playsInline
                  aria-label="Live camera preview"
                />

                {isStarting && !cameraError && (
                  <div className="camera-status" role="status">
                    <span className="camera-loader" aria-hidden="true" />
                    <span>Starting your camera…</span>
                  </div>
                )}

                {cameraError && (
                  <div className="camera-error" role="alert">
                    <span className="camera-error-icon" aria-hidden="true">
                      📷
                    </span>
                    <p>{cameraError}</p>
                    <button
                      className="memory-button retry-button"
                      type="button"
                      onClick={startCamera}
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </>
            )}

            <span className="frame-corner corner-top-left" aria-hidden="true" />
            <span className="frame-corner corner-top-right" aria-hidden="true" />
            <span
              className="frame-corner corner-bottom-left"
              aria-hidden="true"
            />
            <span
              className="frame-corner corner-bottom-right"
              aria-hidden="true"
            />
          </div>

          <canvas ref={canvasRef} className="capture-canvas" aria-hidden="true" />

          <div className={`camera-actions ${imageData ? 'split-actions' : ''}`}>
            {imageData ? (
              <>
                <button
                  className="memory-button secondary-button"
                  type="button"
                  onClick={handleRetake}
                >
                  🔄 Retake
                </button>
                <button
                  className="memory-button upload-button"
                  type="button"
                  onClick={() => handleUpload(imageData)}
                >
                  ⬆ Upload
                </button>
              </>
            ) : (
              <button
                className="memory-button capture-button"
                type="button"
                onClick={capturePhoto}
                disabled={isStarting || Boolean(cameraError)}
              >
                📸 Capture
              </button>
            )}
          </div>
          
        </div>
        
)}
      </section>
    </main>
  );
};

export default Memories;
