// src/components/DogDetector.jsx
import React, { useState, useRef } from 'react';
import './DogDetector.css';

export default function DogDetector() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setResultImage(null);
        setDetections([]);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetection = async () => {
    if (!selectedImage) {
      setErrorMessage("Veuillez sélectionner une image d'abord");
      return;
    }

    setIsLoading(true);
    try {
      // Convertir la base64 URL en Blob pour l'envoi
      const imageBlob = await fetch(selectedImage).then(r => r.blob());
      
      // Créer un objet FormData pour envoyer l'image
      const formData = new FormData();
      formData.append('image', imageBlob, 'image.jpg');
      
      // Envoyer l'image au backend Flask
      const response = await fetch('http://localhost:5000/api/detect-dogs', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la détection');
      }
      
      const data = await response.json();
      setResultImage(data.resultImage);
      setDetections(data.detections);
    } catch (error) {
      setErrorMessage("Erreur lors de la détection: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    setResultImage(null);
    setDetections([]);
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="dog-detector">
      <h1>Détecteur de Chiens</h1>
      
      <div className="control-panel">
        <div className="file-input">
          <label>
            Sélectionnez une image contenant un chien
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>
        
        <div className="button-group">
          <button
            onClick={handleDetection}
            disabled={!selectedImage || isLoading}
            className={isLoading ? "loading" : "primary"}
          >
            {isLoading ? 'Détection en cours...' : 'Lancer la détection'}
          </button>
          
          <button
            onClick={resetSelection}
            className="secondary"
          >
            Réinitialiser
          </button>
        </div>
        
        {errorMessage && (
          <div className="error-message">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="images-container">
        {selectedImage && (
          <div className="image-box">
            <h2>Image d'origine</h2>
            <div className="image-frame original">
              <img
                src={selectedImage}
                alt="Image sélectionnée"
              />
            </div>
          </div>
        )}
        
        {resultImage && (
          <div className="image-box">
            <h2>Résultat de la détection</h2>
            <div className="image-frame result">
              <img
                src={resultImage}
                alt="Résultat de détection"
              />
              
              {detections.length > 0 ? (
                <div className="detection-badge">
                  {detections.length} {detections.length === 1 ? 'chien détecté' : 'chiens détectés'}
                </div>
              ) : (
                <div className="no-detection-badge">
                  Aucun chien détecté
                </div>
              )}
            </div>
            
            {detections.length > 0 && (
              <div className="detections-list">
                <h3>Détails des détections:</h3>
                <ul>
                  {detections.map((detection, index) => (
                    <li key={index}>
                      {detection.class}: {(detection.confidence * 100).toFixed(2)}% de confiance
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}