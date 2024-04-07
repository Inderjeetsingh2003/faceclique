import cv2
import os
import numpy as np

# Load pre-trained face detector
face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Function to extract face embeddings using OpenCV
def extract_face_embeddings(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    
    if len(faces) == 0:
        return None
    
    (x, y, w, h) = faces[0]
    face_roi = gray[y:y+h, x:x+w]
    return cv2.resize(face_roi, (100, 100))

# Function to load training data and labels
def load_training_data(data_dir):
    faces = []
    labels = []
    label_id = 0
    
    for root, dirs, files in os.walk(data_dir):
        for file in files:
            if file.endswith('.jpg') or file.endswith('.jpeg') or file.endswith('.png'):
                label = os.path.basename(root).replace(" ", "-").lower()
                image_path = os.path.join(root, file)
                face_embedding = extract_face_embeddings(image_path)
                if face_embedding is not None:
                    faces.append(face_embedding)
                    labels.append(label_id)
        label_id += 1
    
    return faces, labels

# Load training data
data_dir = 'traning_data'
faces, labels = load_training_data(data_dir)

# Convert faces and labels to NumPy arrays
faces = np.array(faces)
labels = np.array(labels)

# Train a face recognition model (e.g., using Eigenfaces, Fisherfaces, or LBPH algorithm)
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.train(faces, labels)

# Save trained model
recognizer.save('trained_model.yml')