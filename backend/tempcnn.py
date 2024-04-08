import cv2
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.preprocessing import LabelEncoder

# Load the trained model
model = load_model('faceCNNdirectory_recognition_model.keras')

# Load label encoder
label_encoder = LabelEncoder()
label_encoder.classes_ = np.load('training_data/label_encoder_classes.npy')

# Initialize video capture
video = cv2.VideoCapture(0)
facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Face recognition loop
while True:
    ret, frame = video.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces
    faces = facedetect.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5)

    for (x, y, w, h) in faces:
        face_img = frame[y:y+h, x:x+w]  # Load color image instead of grayscale
        face_img = cv2.resize(face_img, (100, 100)) / 255.0  # Preprocess the face image
        face_img = face_img.reshape(1, 100, 100, 3)  # Reshape for model input

        # Predict the label of the face
        prediction = model.predict(face_img)
        predicted_label = np.argmax(prediction)  # Get the index of the predicted class

        # Convert predicted index to name
        predicted_name = label_encoder.inverse_transform([predicted_label])[0]

        # Debug: Print predicted label index and name
        print("Predicted Label Index:", predicted_label)
        print("Predicted Name:", predicted_name)

        # Display the recognized face
        cv2.putText(frame, predicted_name, (x, y-15), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    cv2.imshow('Face Recognition', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cleanup
video.release()
cv2.destroyAllWindows()
