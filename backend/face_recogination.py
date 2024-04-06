import cv2
import os

# Load pre-trained face detector
face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Load the trained model
recognizer = cv2.face.LBPHFaceRecognizer_create()
recognizer.read('trained_model.yml')

# Get the list of student names (directory names)
student_names = os.listdir('traning_data')

# Function to recognize faces in real-time
def recognize_faces():
    cap = cv2.VideoCapture(0)
    
    while True:
        ret, frame = cap.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_detector.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
        
        for (x, y, w, h) in faces:
            face_roi = gray[y:y+h, x:x+w]
            label_id, confidence = recognizer.predict(face_roi)
            label_text = "Unknown"
            if confidence < 100:
                label_text = student_names[label_id]
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, label_text, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        
        cv2.imshow('Facial Recognition', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

# Run facial recognition
recognize_faces()
