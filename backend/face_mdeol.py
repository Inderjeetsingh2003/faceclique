from sklearn.neighbors import KNeighborsClassifier
from flask import Flask, request, jsonify
import numpy as np
import cv2
import pickle
import os
from flask_cors import CORS

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
knn.fit(FACES.reshape(len(FACES), -1), LABELS)  # Reshape to 2D array for training

@app.route('/recognize', methods=['GET'])
def recognize_face():
    video = cv2.VideoCapture(0)
    facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    recognized_face = None  # Variable to store the most recent recognized face

    while True:
        ret, frame = video.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)
        
        for (x, y, w, h) in faces:
            crop_img = frame[y:y+h, x:x+w, :]
            resized_img = cv2.resize(crop_img, (50, 50)).flatten().reshape(1, -1)

            output = knn.predict(resized_img)
            recognized_face = output[0]  # Update recognized face with the most recent one

            cv2.putText(frame, str(output[0]), (x, y-15), cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 1)
            cv2.rectangle(frame, (x, y), (x+w, y+h), (50, 50, 255), 1)

        cv2.imshow("frame", frame)
        k = cv2.waitKey(1)
        if k == ord('q'):
            break

    video.release()
    cv2.destroyAllWindows()

    return jsonify({'message': 'Face recognition completed', 'recognized_face': recognized_face})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
