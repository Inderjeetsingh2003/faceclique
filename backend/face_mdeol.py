import base64
import numpy as np
import cv2
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.neighbors import KNeighborsClassifier

app = Flask(__name__)
CORS(app)

# Load your face recognition model and data
with open('traning_data/names.pkl', 'rb') as f:
    LABELS = pickle.load(f)
with open('traning_data/faces_data.pkl', 'rb') as f:
    FACES = pickle.load(f)
FACES = np.array(FACES)

# Load the KNeighborsClassifier model
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(FACES.reshape(len(FACES), -1), LABELS)

@app.route('/recognize', methods=['POST'])
def recognize_face():
    data_url = request.json.get('imageData')
    header, encoded = data_url.split(",", 1)
    image_data = base64.b64decode(encoded)
    image_array = np.frombuffer(image_data, dtype=np.uint8)
    image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    
    facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)
    
    recognized_face = None
    for (x, y, w, h) in faces:
        crop_img = image[y:y+h, x:x+w, :]
        resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)
        
        output = knn.predict(resized_img)
        recognized_face = output[0]
        
    return jsonify({'message': 'Face recognition completed', 'recognized_face': recognized_face})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
