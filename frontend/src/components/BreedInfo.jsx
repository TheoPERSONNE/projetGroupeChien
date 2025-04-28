// src/components/BreedInfo.jsx
import React, { useState, useEffect } from 'react';
import './BreedInfo.css';

export default function BreedInfo({ breedName, classId, onClose }) {
  const [breedInfo, setBreedInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Dans une vraie application, vous feriez un appel API pour récupérer les infos
    // sur la race en fonction de son ID de classe
    const fetchBreedInfo = async () => {
      try {
        setLoading(true);
        
        // Simulez un délai pour l'appel API
        await new Promise(r => setTimeout(r, 800));
        
        // Données fictives pour l'exemple
        // Dans une vraie implémentation, vous pourriez chercher ces informations
        // dans une base de données ou une API externe basée sur le classId
        const breedData = {
          name: breedName,
          classId: classId,
          origin: generateRandomCountry(),
          size: generateRandomSize(),
          lifeSpan: `${10 + Math.floor(Math.random() * 5)} - ${12 + Math.floor(Math.random() * 5)} ans`,
          temperament: generateRandomTemperament(),
          description: generateRandomDescription(breedName)
        };
        
        setBreedInfo(breedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des informations:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBreedInfo();
  }, [breedName, classId]);
  
  // Fonctions pour générer des données aléatoires
  function generateRandomCountry() {
    const countries = ["France", "Allemagne", "Royaume-Uni", "États-Unis", "Canada", "Japon", "Chine", "Australie"];
    return countries[Math.floor(Math.random() * countries.length)];
  }
  
  function generateRandomSize() {
    const sizes = ["Petit", "Moyen", "Grand", "Très grand"];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }
  
  function generateRandomTemperament() {
    const traits = ["Amical", "Loyal", "Intelligent", "Énergique", "Calme", "Protecteur", "Joueur", "Indépendant"];
    // Sélectionner 3-5 traits aléatoires
    const numTraits = 3 + Math.floor(Math.random() * 3);
    const selectedTraits = [];
    
    while (selectedTraits.length < numTraits) {
      const trait = traits[Math.floor(Math.random() * traits.length)];
      if (!selectedTraits.includes(trait)) {
        selectedTraits.push(trait);
      }
    }
    
    return selectedTraits.join(", ");
  }
  
  function generateRandomDescription(breedName) {
    const descriptions = [
      `Le ${breedName} est un chien très populaire auprès des familles en raison de sa nature douce et de sa patience avec les enfants.`,
      `Originellement élevé pour être un chien de travail, le ${breedName} est maintenant principalement un compagnon fidèle.`,
      `Le ${breedName} est reconnu pour son intelligence et sa facilité d'apprentissage, ce qui en fait un excellent choix pour les dresseurs novices.`,
      `Avec son énergie débordante, le ${breedName} a besoin de beaucoup d'exercice et d'activités pour rester en bonne santé mentale et physique.`,
      `Le ${breedName} est une race ancienne qui a servi l'humanité pendant des siècles dans divers rôles, de la chasse à la garde.`
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  return (
    <div className="breed-info-modal">
      <div className="breed-info-content">
        <button className="close-button" onClick={onClose}>×</button>
        
        <h2>Informations sur la race: {breedName}</h2>
        
        {loading ? (
          <div className="loading-spinner">Chargement des informations...</div>
        ) : breedInfo ? (
          <div className="breed-details">
            <div className="breed-detail-item">
              <strong>ID de classe:</strong> {breedInfo.classId}
            </div>
            <div className="breed-detail-item">
              <strong>Origine:</strong> {breedInfo.origin}
            </div>
            <div className="breed-detail-item">
              <strong>Taille:</strong> {breedInfo.size}
            </div>
            <div className="breed-detail-item">
              <strong>Espérance de vie:</strong> {breedInfo.lifeSpan}
            </div>
            <div className="breed-detail-item">
              <strong>Tempérament:</strong> {breedInfo.temperament}
            </div>
            <div className="breed-description">
              <p>{breedInfo.description}</p>
            </div>
          </div>
        ) : (
          <div className="error-message">
            Impossible de charger les informations pour cette race.
          </div>
        )}
      </div>
    </div>
  );
}