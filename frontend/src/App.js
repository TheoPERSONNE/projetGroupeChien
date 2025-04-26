// src/App.js
import React from 'react';
import './App.css';
import DogDetector from './components/DogDetector';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="container">
          <h1>Application de Détection de Chiens</h1>
          <p>Utilisant YOLO pour détecter les chiens dans vos images</p>
        </div>
      </header>
      
      <main className="app-main">
        <div className="container">
          <DogDetector />
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>Application de détection de chiens avec YOLO et React</p>
          <p className="copyright">© {new Date().getFullYear()} - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  );
}

export default App;