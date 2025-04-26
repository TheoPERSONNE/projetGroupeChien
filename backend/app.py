from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import cv2
import numpy as np
from PIL import Image
import io
import base64
from ultralytics import YOLO
import uuid
import tempfile

app = Flask(__name__)
CORS(app)  # Permettre les requêtes cross-origin

# Dossier pour sauvegarder temporairement les images
UPLOAD_FOLDER = tempfile.gettempdir()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Charger le modèle YOLO une seule fois au démarrage
model = YOLO("creation_model/yolov8n-dogs/weights/best.pt")

@app.route('/api/detect-dogs', methods=['POST'])
def detect_dogs():
    if 'image' not in request.files:
        return jsonify({'error': 'Aucune image fournie'}), 400
    
    file = request.files['image']
    
    # Sauvegarder l'image temporairement
    temp_filename = str(uuid.uuid4()) + '.jpg'
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
    file.save(temp_path)
    
    try:
        # Charger l'image avec OpenCV
        image = cv2.imread(temp_path)
        if image is None:
            return jsonify({'error': 'Impossible de lire l\'image'}), 400
        
        # Effectuer la détection avec YOLO
        results = model(image)
        
        # Sauvegarder l'image avec les résultats
        result_path = os.path.join(app.config['UPLOAD_FOLDER'], f"result_{temp_filename}")
        
        # Dessiner les résultats sur l'image
        result_plot = results[0].plot()
        cv2.imwrite(result_path, result_plot)
        
        # Convertir l'image en base64 pour l'envoi
        with open(result_path, "rb") as img_file:
            img_data = base64.b64encode(img_file.read()).decode('utf-8')
        
        # Récupérer les informations sur les détections
        detections = []
        for box in results[0].boxes:
            # Coordonnées du rectangle
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            confidence = float(box.conf[0])
            class_id = int(box.cls[0])
            class_name = results[0].names[class_id]
            
            detections.append({
                'class': class_name,
                'confidence': confidence,
                'bbox': [x1, y1, x2, y2]
            })
        
        # Nettoyer les fichiers temporaires
        try:
            os.remove(temp_path)
            os.remove(result_path)
        except:
            pass
        
        return jsonify({
            'resultImage': f"data:image/jpeg;base64,{img_data}",
            'detections': detections
        })
        
    except Exception as e:
        # Nettoyer en cas d'erreur
        try:
            os.remove(temp_path)
        except:
            pass
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    