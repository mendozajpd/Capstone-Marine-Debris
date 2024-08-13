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

region_points = [(600, 700), (1700, 700), (1700, 650), (600, 650)]
color = (0, 0, 255)
line_pts = [(500, 500), (1500, 500)]