from ultralytics import YOLO
import cv2
import torch
import time  # Import time module

torch.cuda.set_device(0)

# Load yolov8 model
model = YOLO('model/yolov8n.pt')

# Load video
video_path = 'video/4k highway.mp4'
cap = cv2.VideoCapture(video_path)

ret = True

# Set the desired resolution
target_resolution = (1920, 1080)

# Initialize FPS calculation variables
prev_frame_time = 0
new_frame_time = 0
font = cv2.FONT_HERSHEY_SIMPLEX

# Read frames
while ret:
    ret, frame = cap.read()

    if ret:
        # Resize frame to 1080p
        frame = cv2.resize(frame, target_resolution)

        # Detect objects, track objects
        tracks = model.track(frame, conf=0.50, persist=False, imgsz=(640, 640))

        # Count the number of detected objects
        num_objects = len(tracks)
        print(f"Number of detected objects in this frame: {num_objects}")

        # Plot results
        frame_ = tracks[0].plot()

        # Convert the count to string so that we can display it on frame
        num_objects_str = str(num_objects)

        # Putting the object count on the frame, below the FPS
        cv2.putText(frame_, num_objects_str, (7, 140), font, 3, (100, 255, 0), 3, cv2.LINE_AA)

        # Time when we finish processing for this frame
        new_frame_time = time.time()

        # Calculating the FPS
        fps = 1 / (new_frame_time - prev_frame_time)
        prev_frame_time = new_frame_time

        # Converting the fps to string so that we can display it on frame
        fps = str(int(fps))

        # Putting the FPS count on the frame
        cv2.putText(frame_, fps, (7, 70), font, 3, (100, 255, 0), 3, cv2.LINE_AA)

        # Visualize
        cv2.imshow("frame", frame_)
        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

# Release video capture object
cap.release()

# Close all OpenCV windows
cv2.destroyAllWindows()