from flask import Flask, Response, jsonify
from flask_cors import CORS
import numpy as np
from base64 import b64encode
import cv2
import torch
import supervision as sv
from models.common import DetectMultiBackend, AutoShape
from utils.torch_utils import select_device
from utils.general import set_logging
from supervision import Detections as BaseDetections
from supervision.config import CLASS_NAME_DATA_FIELD
from IPython.display import HTML
import time
from collections import Counter


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


# Extending Supervision's `Detections` to Handle YOLOv9 Results
class ExtendedDetections(BaseDetections):
    @classmethod
    def from_yolov9(cls, yolov9_results) -> "ExtendedDetections":
        xyxy, confidences, class_ids = [], [], []

        for det in yolov9_results.pred:
            for *xyxy_coords, conf, cls_id in reversed(det):
                xyxy.append(torch.stack(xyxy_coords).cpu().numpy())
                confidences.append(float(conf))
                class_ids.append(int(cls_id))

        class_names = np.array([yolov9_results.names[i] for i in class_ids])
        # print(class_names)
        # print(class_ids)

        if not xyxy:
            return cls.empty()

        class_counts = Counter(class_names)

        return (
            cls(
                xyxy=np.vstack(xyxy),
                confidence=np.array(confidences),
                class_id=np.array(class_ids),
                data={CLASS_NAME_DATA_FIELD: class_names},
            ),
            class_counts,
        )


# Loading the Model
set_logging(verbose=False)
device = select_device(0)
model = DetectMultiBackend(
    weights="gelan-c.pt", device=device, data="data/coco.yaml", fuse=True
)
model = AutoShape(model)


# Function to Set YOLOv9 Post-processing Parameters
def prepare_yolov9(
    model, conf=0.2, iou=0.7, classes=None, agnostic_nms=False, max_det=1000
):
    model.conf = conf
    model.iou = iou
    model.classes = classes
    model.agnostic = agnostic_nms
    model.max_det = max_det
    return model


# Function to Play Videos
def play(filename, width=500):
    html = ""
    video = open(filename, "rb").read()
    src = "data:video/mp4;base64," + b64encode(video).decode()
    html += (
        rf'<video width=500 controls autoplay loop><source src="%s" type="video/mp4"></video>'
        % src
    )
    return HTML(html)


# Constants
SOURCE_VIDEO_PATH = "traffic.mp4"
TARGET_VIDEO_PATH = "output.mp4"


# Simple Object Detection with YOLOv9 and Supervision
def prepare_model_and_video_info(model, config, source_path):
    model = prepare_yolov9(model, **config)
    video_info = sv.VideoInfo.from_video_path(source_path)
    return model, video_info


def setup_annotator():
    return sv.BoundingBoxAnnotator(thickness=2)


def simple_annotate_frame(frame, model, annotator):
    frame_rgb = frame[..., ::-1]
    results = model(frame_rgb, size=640, augment=False)
    detections = ExtendedDetections.from_yolov9(results)
    print(results.pred[0].shape, detections.xyxy.shape)

    # Display the frame with detections using cv2.imshow
    annotated_frame = annotator.annotate(scene=frame.copy(), detections=detections)
    cv2.imshow("Detections", annotated_frame)
    cv2.waitKey(1)  # Adjust the delay as needed

    return annotated_frame


def simple_process_video(
    model,
    config=dict(
        conf=0.1,
        iou=0.45,
        classes=None,
    ),
    source_path=SOURCE_VIDEO_PATH,
    target_path=TARGET_VIDEO_PATH,
):
    model, _ = prepare_model_and_video_info(model, config, source_path)
    annotator = setup_annotator()

    def callback(frame: np.ndarray, index: int) -> np.ndarray:
        return simple_annotate_frame(frame, model, annotator)

    sv.process_video(
        source_path=source_path, target_path=target_path, callback=callback
    )


# Advanced Detection, Tracking, and Counting with YOLOv9 and Supervision
def setup_model_and_video_info(model, config, source_path):
    model = prepare_yolov9(model, **config)
    video_info = sv.VideoInfo.from_video_path(source_path)
    return model, video_info


def create_byte_tracker(video_info):
    return sv.ByteTrack(
        track_thresh=0.25,
        track_buffer=250,
        match_thresh=0.95,
        frame_rate=video_info.fps,
    )


def setup_annotators():
    bounding_box_annotator = sv.BoundingBoxAnnotator(
        thickness=2, color_lookup=sv.ColorLookup.TRACK
    )
    round_box_annotator = sv.RoundBoxAnnotator(
        thickness=2, color_lookup=sv.ColorLookup.TRACK
    )
    corner_annotator = sv.BoxCornerAnnotator(
        thickness=2, color_lookup=sv.ColorLookup.TRACK
    )
    trace_annotator = sv.TraceAnnotator(
        thickness=2, trace_length=50, color_lookup=sv.ColorLookup.TRACK
    )
    label_annotator = sv.LabelAnnotator(
        text_scale=0.5, color_lookup=sv.ColorLookup.TRACK
    )
    return (
        [bounding_box_annotator, round_box_annotator, corner_annotator],
        trace_annotator,
        label_annotator,
    )


def setup_counting_zone(counting_zone, video_info):
    if counting_zone == "whole_frame":
        polygon = np.array(
            [
                [0, 0],
                [video_info.width - 1, 0],
                [video_info.width - 1, video_info.height - 1],
                [0, video_info.height - 1],
            ]
        )
    else:
        polygon = np.array(counting_zone)
    polygon_zone = sv.PolygonZone(
        polygon=polygon,
        frame_resolution_wh=(video_info.width, video_info.height),
        triggering_position=sv.Position.CENTER,
    )
    polygon_zone_annotator = sv.PolygonZoneAnnotator(
        polygon_zone,
        sv.Color.ROBOFLOW,
        thickness=2 * (2 if counting_zone == "whole_frame" else 1),
        text_thickness=1,
        text_scale=0.5,
    )
    return polygon_zone, polygon_zone_annotator


def annotate_frame(
    frame,
    index,
    video_info,
    detections,
    byte_tracker,
    counting_zone,
    polygon_zone,
    polygon_zone_annotator,
    trace_annotator,
    annotators_list,
    label_annotator,
    show_labels,
    model,
):
    detections = byte_tracker.update_with_detections(detections)
    annotated_frame = frame.copy()

    if counting_zone is not None:
        is_inside_polygon = polygon_zone.trigger(detections)
        detections = detections[is_inside_polygon]
        annotated_frame = polygon_zone_annotator.annotate(annotated_frame)

    annotated_frame = trace_annotator.annotate(
        scene=annotated_frame, detections=detections
    )

    section_index = int(index / (video_info.total_frames / len(annotators_list)))
    annotated_frame = annotators_list[section_index].annotate(
        scene=annotated_frame, detections=detections
    )

    if show_labels:
        annotated_frame = add_labels_to_frame(
            label_annotator, annotated_frame, detections, model
        )

    return annotated_frame


def add_labels_to_frame(annotator, frame, detections, model):
    labels = [
        f"#{tracker_id} {model.model.names[class_id]} {confidence:0.2f}"
        for confidence, class_id, tracker_id in zip(
            detections.confidence, detections.class_id, detections.tracker_id
        )
    ]
    return annotator.annotate(scene=frame, detections=detections, labels=labels)


def process_video(
    model,
    config=dict(
        conf=0.1,
        iou=0.45,
        classes=True,
    ),
    counting_zone=True,
    show_labels=True,
    source_path=SOURCE_VIDEO_PATH,
    target_path=TARGET_VIDEO_PATH,
    skip_frames=1,
):
    model, video_info = setup_model_and_video_info(model, config, source_path)
    byte_tracker = create_byte_tracker(video_info)
    annotators_list, trace_annotator, label_annotator = setup_annotators()
    polygon_zone, polygon_zone_annotator = (
        setup_counting_zone(counting_zone, video_info)
        if counting_zone
        else (None, None)
    )

    last_class_counts = None
    last_time = time.time()

    detected_objects = {}

    def callback(frame: np.ndarray, index: int) -> np.ndarray:
        nonlocal last_class_counts, last_time
        if index % skip_frames != 0:
            return frame

        frame_rgb = frame[..., ::-1]
        results = model(frame_rgb, size=608, augment=False)
        detections, class_counts = ExtendedDetections.from_yolov9(results)

        # Update detections with byte_tracker
        detections = byte_tracker.update_with_detections(detections)
    
        # Update the detected_objects dictionary
        for tracker_id, class_id, confidence in zip(detections.tracker_id, detections.class_id, detections.confidence):
            if tracker_id in detected_objects:
                # Update the count and confidence if the object has been detected before
                # detected_objects[tracker_id][1] += 1
                detected_objects[tracker_id][2] = float(confidence)
            else:
                # Add the object to the dictionary if it hasn't been detected before
                detected_objects[tracker_id] = [model.model.names[class_id], 1, float(confidence)]
           
        # Calculate and display FPS
        current_time = time.time()
        fps = 1 / (current_time - last_time)
        last_time = current_time
        print(f"FPS: {fps}")

        # Display the frame with detections using cv2.imshow
        annotated_frame = annotate_frame(frame, index, video_info, detections, byte_tracker, counting_zone, polygon_zone, polygon_zone_annotator, trace_annotator, annotators_list, label_annotator, show_labels, model)
        # cv2.imshow("Detections", annotated_frame)  # Comment out this line
        # cv2.waitKey(1)  # Adjust the delay as needed

        return annotated_frame, detected_objects

    for index, frame in enumerate(sv.get_video_frames_generator(source_path=source_path, stride=skip_frames)):
        annotated_frame, detected_objects = callback(frame, index)
        yield annotated_frame, detected_objects


# Detection, Tracking, and Counting in Full Frame
# yolov9_config=dict(conf=0.3, iou=0.45, classes=[0, 2, 3])
yolov9_config=dict(conf=0.3, iou=0.45)


object_count = 0
class_counts = {}
object_dictionary = {}

@app.route("/video_frame")
def video_feed():
    def generate():
        global object_count
        global class_counts
        global object_dictionary

        for frame, detected_objects in process_video(
            model,
            config=yolov9_config,
            counting_zone="whole_frame",
            show_labels=True,
            target_path="demo_file.mp4",
        ):
            # Check that frame is not None and is a numpy array
            if frame is not None and isinstance(frame, np.ndarray):
                # Convert the annotated frame to JPEG
                ret, jpeg = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), 90])
                if not ret:
                    continue

                # Yield the JPEG image as bytes
                yield (
                    b"--frame\r\n"
                    b"Content-Type: image/jpeg\r\n\r\n" + jpeg.tobytes() + b"\r\n"
                )

            # Initialize an empty dictionary for the object counts
            object_count = {}

            # Iterate over the detected_objects dictionary
            for tracker_id, object_info in detected_objects.items():
                # Get the class name from the object_info list
                class_name = object_info[0]

                # If the class name is already in the object_count dictionary, increment its count
                if class_name in object_count:
                    object_count[class_name] += 1
                # If the class name is not in the object_count dictionary, add it with a count of 1
                else:
                    object_count[class_name] = 1

            # Print the object_count dictionary
            print("Object Count:", object_count)
            
            object_dictionary = detected_objects
            print("Object Dictionary:", object_dictionary)

    return Response(generate(), mimetype="multipart/x-mixed-replace; boundary=frame")


@app.route("/backend_data")
def get_backend_data():
    global object_count
    global class_counts
    return jsonify({"object_count": object_count, "class_counts": class_counts})

@app.route("/object_dictionary")
def get_object_dictionary():
    global object_dictionary
    # Convert numpy.int64 keys to native Python int
    object_dictionary = {int(key): value for key, value in object_dictionary.items()}
    return jsonify(object_dictionary)

if __name__ == "__main__":
    # Set threaded=True for better performance
    app.run(debug=True, use_reloader=False, use_debugger=False, threaded=True)

# cv2.destroyAllWindows()  # Close all OpenCV windows after processing
