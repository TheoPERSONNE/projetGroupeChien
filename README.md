# Application de Détection de Chiens avec YOLO, React et Flask

Cette application web permet aux utilisateurs de télécharger des images pour détecter les chiens à l'aide d'un modèle YOLO pré-entraîné. Le système utilise un backend Flask pour le traitement des images et un frontend React pour l'interface utilisateur.
![Texte alternatif pour l'image](image.png)
## Fonctionnalités

- Interface utilisateur intuitive pour télécharger des images
- Détection des chiens grâce au modèle YOLO
- Affichage des résultats avec les boîtes de délimitation (bounding boxes)
- Affichage des informations de confiance pour chaque détection
- Possibilité de réinitialiser et de sélectionner de nouvelles images

## Architecture

L'application est divisée en deux parties principales :

### Backend (Flask)

- Reçoit les images téléchargées depuis le frontend
- Utilise le modèle YOLO pour détecter les chiens dans les images
- Génère une image de résultat avec les boîtes de délimitation
- Renvoie les résultats au frontend au format JSON

### Frontend (React)

- Interface utilisateur responsive et conviviale
- Permet le téléchargement d'images
- Affiche l'image originale et l'image avec les détections
- Affiche les détails des détections (classe et niveau de confiance)

## Prérequis

- Python 3.7 ou version ultérieure
- Node.js 14 ou version ultérieure
- pip (gestionnaire de paquets Python)
- npm (gestionnaire de paquets Node.js)

## Installation

### Backend (Flask)

1. Clonez le dépôt et naviguez vers le dossier `backend` :
```bash
git clone <URL_DU_DEPOT>
cd <NOM_DU_PROJET>/backend
```

2. Créez et activez un environnement virtuel (recommandé) :
```bash
# Sur Windows
python -m venv venv
venv\Scripts\activate

# Sur macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Installez les dépendances nécessaires :
```bash
pip install flask flask-cors opencv-python pillow ultralytics numpy
```

4. Assurez-vous que votre modèle YOLO est correctement placé dans le chemin spécifié dans `app.py` (par défaut : "yolov8n-dogs/weights/best.pt").

5. Lancez le serveur Flask :
```bash
python app.py
```

Le serveur Flask démarrera sur http://localhost:5000.

### Frontend (React)

1. Naviguez vers le dossier `frontend` :
```bash
cd <NOM_DU_PROJET>/frontend
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application React :
```bash
npm start
```

L'application React démarrera sur http://localhost:3000.

## Utilisation

1. Ouvrez votre navigateur et accédez à http://localhost:3000
2. Cliquez sur le bouton de sélection de fichier pour télécharger une image
3. Cliquez sur "Lancer la détection" pour analyser l'image
4. Consultez les résultats affichés avec les détections de chiens
5. Utilisez le bouton "Réinitialiser" pour sélectionner une nouvelle image

## Structure des fichiers

```
project-root/
├── backend/
│   └── app.py             # Serveur Flask et logique de détection YOLO
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── DogDetector.jsx  # Composant principal
│       │   └── DogDetector.css  # Styles du composant
│       ├── App.js          # Point d'entrée de l'application React
│       ├── App.css         # Styles généraux
│       ├── index.js        # Point d'entrée React
│       └── index.css       # Styles de base
```

## Personnalisation

### Modèle YOLO

Pour utiliser un modèle YOLO différent ou personnalisé, modifiez la ligne suivante dans `app.py` :

```python
model = YOLO("chemin/vers/votre/modele.pt")
```

### Interface utilisateur

L'interface utilisateur peut être personnalisée en modifiant les fichiers CSS correspondants dans le dossier `frontend/src/`.

## Dépannage

### Problème de connexion au backend

Si le frontend ne parvient pas à se connecter au backend, vérifiez que :
- Le serveur Flask est bien en cours d'exécution sur le port 5000
- CORS est correctement configuré dans le backend
- L'URL de l'API dans le frontend pointe vers la bonne adresse

### Erreurs de détection

Si la détection des chiens ne fonctionne pas correctement :
- Vérifiez que le modèle YOLO est correctement chargé
- Assurez-vous que le chemin vers le modèle est correct
- Vérifiez que l'image est correctement envoyée au backend

## Licence

Ce projet est sous licence [MIT](LICENSE).

## Auteurs

- Boussad AIT DJOUDI
- Theo personne
- Akram CHOUICHI

## Remerciements

- Ultralytics pour la bibliothèque YOLO
- L'équipe React pour le framework frontend
- L'équipe Flask pour le framework backend
