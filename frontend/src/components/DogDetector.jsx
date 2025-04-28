import React, { useState, useRef } from 'react';
import './DogDetector.css';

export default function DogDetector() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setProcessedImage(null);
        setPrediction(null);
        setErrorMessage("");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClassification = async () => {
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
      
      // Envoyer l'image au backend Flask - Notez le nouvel endpoint
      const response = await fetch('http://localhost:5000/api/classify-dog', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la classification');
      }
      
      const data = await response.json();
      
      // Mettre à jour avec les nouvelles données
      setPrediction(data.prediction);
      
      // L'image annotée est déjà préparée par le backend
      if (data.image_annotated) {
        setProcessedImage(`data:image/jpeg;base64,${data.image_annotated}`);
      }
    } catch (error) {
      setErrorMessage("Erreur lors de la classification: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSelection = () => {
    setSelectedImage(null);
    setProcessedImage(null);
    setPrediction(null);
    setErrorMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="dog-detector">
      <h1>Classificateur de Races de Chiens</h1>
      
      <div className="control-panel">
        <div className="file-input">
          <label>
            Sélectionnez une image d'un chien
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
            onClick={handleClassification}
            disabled={!selectedImage || isLoading}
            className={isLoading ? "loading" : "primary"}
          >
            {isLoading ? 'Classification en cours...' : 'Classifier la race'}
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
        
        <div className="image-box">
          <h2>Résultat de la classification</h2>
          <div className="image-frame result">
            {processedImage ? (
              <img
                src={processedImage}
                alt="Résultat de classification"
              />
            ) : (
              <div className="no-detection-badge">
                Pas encore classifié
              </div>
            )}
            
            {prediction && (
              <div className="detection-badge">
                Race identifiée
              </div>
            )}
          </div>
          
          {prediction && (
            <div className="detections-list">
              <h3>Détails de la classification:</h3>
              <ul>
                <li>
                  <strong>Race:</strong> {prediction.race}
                </li>
                <li>
                  <strong>Confiance:</strong> {(prediction.confidence * 100).toFixed(2)}%
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}