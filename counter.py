from ultralytics import YOLO
from ultralytics.solutions import object_counter
import cv2
import torch
torch.cuda.set_device(0)

model = YOLO("model/yolov8m.pt")
model = model.cuda()
video_path = 'video/robtest.mp4'
cap = cv2.VideoCapture(video_path)
assert cap.isOpened(), "Error reading video file"
w, h, fps = (int(cap.get(x)) for x in (cv2.CAP_PROP_FRAME_WIDTH, cv2.CAP_PROP_FRAME_HEIGHT, cv2.CAP_PROP_FPS))

# Define region points

region_points = [(600, 700), (1700, 700), (1700, 650), (600, 650)]
color = (0, 0, 255)
line_pts = [(500, 500), (1500, 500)]

# Video writer
video_writer = cv2.VideoWriter("object_counting_output.avi",
                       cv2.VideoWriter_fourcc(*'mp4v'),
                       fps,
                       (w, h))

# Init Object Counter
counter = object_counter.ObjectCounter()
counter.set_args(view_img=True,
                 reg_pts=region_points,
                 classes_names=model.names,
                 track_color=color,
                 draw_tracks=True)


while cap.isOpened():
    success, im0 = cap.read()

    if not success:
        print("Video frame is empty or video processing has been successfully completed.")
        break
    tracks = model.track(im0, persist=True, show=False, imgsz=(640,640))

    im0 = counter.start_counting(im0, tracks)
    video_writer.write(im0)

cap.release()
video_writer.release()
cv2.destroyAllWindows()