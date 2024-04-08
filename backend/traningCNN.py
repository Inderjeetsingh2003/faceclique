import cv2
import numpy as np
import os
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense

# Function to capture faces of a student
def capture_faces(student_name):
    video = cv2.VideoCapture(0)
    facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    faces_data = []
    i = 0
    while True:
        ret, frame = video.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)
        for (x, y, w, h) in faces:
            crop_img = frame[y:y+h, x:x+w, :]
            resized_img = cv2.resize(crop_img, (100, 100))
            if len(faces_data) < 100 and i % 10 == 0:
                faces_data.append(resized_img)
                cv2.putText(frame, f'Pictures Taken: {len(faces_data)}', (50, 50), cv2.FONT_HERSHEY_COMPLEX, 1, (50, 50, 255), 1)
            i += 1
            cv2.rectangle(frame, (x, y), (x+w, y+h), (50, 50, 255), 1)
        cv2.imshow("frame", frame)
        k = cv2.waitKey(1)
        if k == ord('q') or len(faces_data) == 100:
            break
    video.release()
    cv2.destroyAllWindows()
    
    return faces_data

# Define CNN model
def define_model(num_classes):
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(100, 100, 3)),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dense(128, activation='relu'),
        Dense(num_classes, activation='softmax')  # Number of classes equals unique labels
    ])
    return model

# Main function
def main():
    # Capture faces
    student_name = input("Enter student name: ")
    faces_data = capture_faces(student_name)
    
    if len(faces_data) < 100:
        print("Insufficient data. At least 100 faces are required.")
        return

    faces_data = np.array(faces_data)

    # Prepare labels
    labels = [student_name] * 100

    # Encode labels
    label_encoder = LabelEncoder()
    labels_encoded = label_encoder.fit_transform(labels)

    # Create or load existing directory for storing data
    if not os.path.exists('training_data'):
        os.makedirs('training_data')

    # Check if student's directory exists, if not create one
    student_dir = os.path.join('training_data', student_name)
    if not os.path.exists(student_dir):
        os.makedirs(student_dir)

    # Save faces
    for i, face in enumerate(faces_data):
        cv2.imwrite(os.path.join(student_dir, f'{i}.jpg'), face)

    # Define and compile model
    model = define_model(len(np.unique(labels_encoded)))
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # Train the model
    model.fit(faces_data, labels_encoded, epochs=10, batch_size=32, validation_split=0.2)

    # Save the trained model
    model.save('faceCNNdirectory_recognition_model.keras')

    # Save the label encoder
    np.save(os.path.join('training_data', 'label_encoder_classes.npy'), label_encoder.classes_)

if __name__ == "__main__":
    main()
