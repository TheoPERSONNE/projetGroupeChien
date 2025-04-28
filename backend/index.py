# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# import cv2
# import numpy as np
# import uuid
# import tempfile
# import json  # Importer json pour charger les classes
# import base64
# from ultralytics import YOLO
# from tensorflow.keras.models import load_model

# app = Flask(__name__)
# CORS(app)

# UPLOAD_FOLDER = tempfile.gettempdir()
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# # Charger YOLO pré-entraîné (garder modèle léger genre yolov8n)
# yolo_model = YOLO('yolov8n.pt')  # ou un modèle custom si tu veux

# # Charger ton modèle CNN de classification
# cnn_model = load_model('C:\\Users\\pc\\Desktop\\projetGroupeChienv2\\best_model.keras')  # Ton modèle final entraîné

# # Fonction pour charger le dictionnaire des classes depuis un fichier JSON
# def load_classes():
#     try:
#         with open('C:\\Users\\pc\\Desktop\\projetGroupeChienv2\\classes.json', 'r') as f:
#             classes = json.load(f)
#         return classes
#     except Exception as e:
#         print(f"Erreur lors du chargement des classes: {e}")
#         return {}

# # Charger les classes depuis le fichier JSON
# classes = load_classes()

# IMG_SIZE = (160, 160)  # La taille d'entrée de ton modèle CNN

# @app.route('/api/detect-dogs', methods=['POST'])
# def detect_dogs():
#     if 'image' not in request.files:
#         return jsonify({'error': 'Aucune image fournie'}), 400
    
#     file = request.files['image']
    
#     # Sauvegarder l'image temporairement
#     temp_filename = str(uuid.uuid4()) + '.jpg'
#     temp_path = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
#     file.save(temp_path)
    
#     try:
#         image = cv2.imread(temp_path)
#         if image is None:
#             return jsonify({'error': 'Impossible de lire l\'image'}), 400
        
#         # Détecter les chiens avec YOLO
#         results = yolo_model.predict(source=image, conf=0.25, classes=[16])  # Classe chien COCO = 16, seuil abaissé
        
#         # Créer une copie de l'image pour dessiner dessus
#         image_with_boxes = image.copy()
#         detections = []
        
#         # Vérifier si des boîtes ont été détectées
#         boxes = results[0].boxes.xyxy
#         print(f"Nombre de détections: {len(boxes)}")  # Log pour débogage

#         if len(boxes) == 0:
#             return jsonify({'message': '❌ Aucun chien détecté'}), 200
        
#         # Pour chaque chien détecté
#         for i, box in enumerate(boxes):
#             x1, y1, x2, y2 = map(int, box.tolist())
#             print(f"Boîte {i}: x1={x1}, y1={y1}, x2={x2}, y2={y2}")  # Log des coordonnées
            
#             # Si la boîte couvre presque toute l'image, ajuster légèrement
#             if (x2-x1) > 0.95*image.shape[1] and (y2-y1) > 0.95*image.shape[0]:
#                 x1 += 10
#                 y1 += 10
#                 x2 -= 10
#                 y2 -= 10
            
#             # Cropper le chien
#             cropped = image[y1:y2, x1:x2]
            
#             # Resize pour ton modèle CNN
#             cropped_resized = cv2.resize(cropped, IMG_SIZE)
#             cropped_resized = cropped_resized / 255.0
#             cropped_resized = np.expand_dims(cropped_resized, axis=0)  # (1,160,160,3)

#             # Prédire la race
#             prediction = cnn_model.predict(cropped_resized)
#             predicted_idx = np.argmax(prediction)
#             confidence = float(prediction[0][predicted_idx])
#             predicted_race = classes.get(str(predicted_idx), "Unknown")  # Assurez-vous que l'index est en string

#             # Dessiner le rectangle avec une épaisseur plus importante et couleur vive
#             cv2.rectangle(image_with_boxes, (x1, y1), (x2, y2), (0, 255, 0), 4)  # Épaisseur augmentée à 4
            
#             # Ajouter le texte avec la race et le pourcentage de confiance
#             label = f"{predicted_race}: {confidence*100:.2f}%"
#             # Position du texte juste au-dessus de la boîte
#             cv2.putText(image_with_boxes, label, (x1, y1-10), 
#                         cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

#             detections.append({
#                 'race_predite': predicted_race,
#                 'confidence': confidence,
#                 'bbox': [x1, y1, x2, y2]
#             })
        
#         # Sauvegarder l'image avec les boîtes
#         output_image_path = os.path.join(app.config['UPLOAD_FOLDER'], f"result_{temp_filename}")
#         cv2.imwrite(output_image_path, image_with_boxes)
        
#         # Convertir l'image en base64 pour l'inclure dans la réponse JSON
#         with open(output_image_path, "rb") as img_file:
#             img_base64 = base64.b64encode(img_file.read()).decode('utf-8')

#         # Nettoyer les fichiers temporaires
#         try:
#             os.remove(temp_path)
#             os.remove(output_image_path)
#         except:
#             pass

#         return jsonify({
#             'detections': detections,
#             'image_with_boxes': img_base64
#         })
        
#     except Exception as e:
#         print(f"Erreur lors de la détection: {str(e)}")  # Log l'erreur pour débogage
#         try:
#             os.remove(temp_path)
#         except:
#             pass
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, host='0.0.0.0', port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import cv2
import numpy as np
import uuid
import tempfile
import json
import base64
from tensorflow.keras.models import load_model

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = tempfile.gettempdir()
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Charger ton modèle CNN de classification
cnn_model = load_model('C:\\Users\\pc\\Desktop\\projetGroupeChienv2\\best_model.keras')

# Fonction pour charger le dictionnaire des classes
def load_classes():
    try:
        with open('C:\\Users\\pc\\Desktop\\projetGroupeChienv2\\classes.json', 'r') as f:
            classes = json.load(f)
        return classes
    except Exception as e:
        print(f"Erreur lors du chargement des classes: {e}")
        return {}

classes = load_classes()

IMG_SIZE = (160, 160)

@app.route('/api/classify-dog', methods=['POST'])
def classify_dog():
    if 'image' not in request.files:
        return jsonify({'error': 'Aucune image fournie'}), 400
    
    file = request.files['image']
    
    # Sauvegarder l'image temporairement
    temp_filename = str(uuid.uuid4()) + '.jpg'
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], temp_filename)
    file.save(temp_path)
    
    try:
        # Lire l'image
        image = cv2.imread(temp_path)
        if image is None:
            return jsonify({'error': 'Impossible de lire l\'image'}), 400
        
        # Créer une copie de l'image pour l'annotation
        image_annotated = image.copy()
        
        # Redimensionner directement l'image pour la classification
        resized_img = cv2.resize(image, IMG_SIZE)
        resized_img = resized_img / 255.0
        resized_img = np.expand_dims(resized_img, axis=0)
        
        # Prédire la race
        prediction = cnn_model.predict(resized_img)
        predicted_idx = np.argmax(prediction)
        confidence = float(prediction[0][predicted_idx])
        predicted_race = classes.get(str(predicted_idx), "Unknown")
        
        # Annoter l'image avec la race prédite
        label = f"{predicted_race}: {confidence*100:.2f}%"
        cv2.putText(image_annotated, label, (10, 30), 
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        
        # Sauvegarder l'image annotée
        output_image_path = os.path.join(app.config['UPLOAD_FOLDER'], f"result_{temp_filename}")
        cv2.imwrite(output_image_path, image_annotated)
        
        # Convertir l'image en base64
        with open(output_image_path, "rb") as img_file:
            img_base64 = base64.b64encode(img_file.read()).decode('utf-8')
        
        # Nettoyer les fichiers temporaires
        try:
            os.remove(temp_path)
            os.remove(output_image_path)
        except:
            pass
        
        return jsonify({
            'prediction': {
                'race': predicted_race,
                'confidence': confidence
            },
            'image_annotated': img_base64
        })
        
    except Exception as e:
        print(f"Erreur lors de la classification: {str(e)}")
        try:
            os.remove(temp_path)
        except:
            pass
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)