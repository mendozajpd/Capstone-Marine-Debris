import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import Webcam from "react-webcam";

import NewProject from "../_Components/NewProject.dialog";

import { getProjectByProjectId } from "../../services/projectService";

function Charter() {
  const [newProject, setNewProject] = useState(false);
  const [projectData, setProjectData] = useState({});

  const { project } = useParams();


  //CAMERA
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [useWebcam, setUseWebcam] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const frameIntervalRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));


  // LIVE FEED
  const [error, setError] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [objects, setObjects] = useState({});
  const [objDictionary, setObjDictionary] = useState({});


  const handleStartCaptureClick = React.useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = React.useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = React.useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = React.useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  const videoSource = "http://192.168.193.206:5000/video_frame";


    // Dummy data
  useEffect(() => {
    const interval = setInterval(() => {
      // fetch("http://192.168.193.206:5000/backend_data")
      //   .then((response) => response.json())
      //   .then((data) => {
      //     // setVehicleCount(data.object_count);
      //     // setClassCount(data.class_counts);
      //     setObjects(data.object_count);
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //     setError(true);
      //   });

      // fetch("http://192.168.193.206:5000/object_dictionary")
      //   .then((response) => response.json())
      //   .then((data) => {
      //     setObjDictionary(data);
      //     console.log(data);
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //     setError(true);
      //   });
    }, 1000);
    

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchProject();
  }, [project]);

  const fetchProject = async () => {
    if (!project) {
      setNewProject(true);
    } else {
      localStorage.setItem("project", project);
      const data = await getProjectByProjectId(project);
      setProjectData(data);
    }
  }

  const secondsToHms = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return [h, m, s]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  }

  const handleNewProjectSave = (newProjectData) => {
    // Handle saving the new project data
    console.log("New project data:", newProjectData);
  };

    // Transform objDictionary to the format expected by the DataTable
const dataForTable = Object.keys(objDictionary).map((key) => ({
  id: key,
  scan: objDictionary[key][0],  // The object type ("person" or "car")
  cf: objDictionary[key][2],    // The confidence value
}));

// WEBCAM RECORDING
const startRecording = () => {
  if (webcamRef.current && webcamRef.current.video) {
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.video.srcObject, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
      if (event.data.size > 0) {
        setRecordedChunks((prev) => [...prev, event.data]);
      }
    });

    mediaRecorderRef.current.start();
    setCapturing(true);

    // Start capturing frames
    startFrameCapture();
  }
};

const stopRecording = () => {
  if (mediaRecorderRef.current) {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }

  // Clear the frame capture interval
  if (frameIntervalRef.current) {
    clearInterval(frameIntervalRef.current);
    frameIntervalRef.current = null;
  }
};

const startFrameCapture = () => {
  const video = webcamRef.current.video;
  const canvas = canvasRef.current;
  const context = canvas.getContext("2d");

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Capture a frame every second
  frameIntervalRef.current = setInterval(() => {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");
    sendFrameToServer(imageData);
  }, 1000);
};

const sendFrameToServer = async (imageData) => {
  try {
    const response = await fetch('http://192.168.193.206:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: imageData })
    });
    const textResponse = await response.text(); // Get the raw text response
    console.log("Server response:", textResponse);
    try {
      const data = JSON.parse(textResponse); // Try to parse it as JSON
      console.log("Parsed data:", data);
    } catch (jsonError) {
      console.error("Failed to parse JSON:", jsonError);
    }
  } catch (error) {
    console.error('Error sending frame to server:', error);
  }
};



  const footer = (
    <>
      <div className="card d-flex justify-content-between flex-row border-none">
        <div>
          <Button
            icon="pi pi-save"
            severity="success"
            className="mr-2 rounded-3"
            onClick={handleNewProjectSave}
          />
          <Button
            icon="pi pi-trash"
            severity="secondary"
            outlined
            className="mr-2 rounded-3"
            onClick={() => { console.log(projectData) }}
          />
        </div>
        <div>
          <Button icon="pi pi-folder" className="mr-2 rounded-3" />
          <Button
            label="New"
            severity="success"
            icon="pi pi-plus"
            iconPos="right"
            className="rounded-3"
            onClick={() => setNewProject(true)}
          />
        </div>
      </div>
    </>
  );
  return (
    <div className="d-flex flex-column w-100 vh-100 p-3">
      <NewProject
        visible={newProject}
        onHide={() => setNewProject(false)}
        onSave={handleNewProjectSave}
      />
      <div className="d-flex vh-75">
      <div className="d-flex justify-content-center align-items-center w-50 border">
          <Button
            label={useWebcam ? "Switch to Video" : "Switch to Webcam"}
            onClick={() => setUseWebcam(!useWebcam)}
            className="mb-2"
          />
          {error ? (
            <h1>Can't fetch video/webcam</h1>
          ) : (
            <>
              {useWebcam ? (
                <>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: "user" }}
                  
                  style={{ display: "none" }}  // Hide the webcam feed
                />
                <div className="mt-2">
                  {!capturing ? (
                    <Button label="Start Recording" onClick={startRecording} />
                  ) : (
                    <Button label="Stop Recording" onClick={stopRecording} />
                  )}
                </div>
              </>
              ) : (
                // <img
                //   src={videoSource}
                //   alt="Video Frame"
                //   style={{
                //     width: "100%",
                //     height: "auto",
                //     border: "1px solid black",
                //   }}
                // />
                <></>
              )}
            </>
          )}
        </div>
        <div className="d-flex w-50 border">
          <div className="w-50 h-100 border">
            <DataTable className="w-100" value={dataForTable} scrollable scrollHeight="75vh">
              <Column field="id" header="ID"></Column>
              <Column field="scan" header="Scanned"></Column>
              <Column field="cf" sortable header="Confidence"></Column>
            </DataTable>
          </div>
          <div className="d-flex flex-column w-50 h-100 border rounded">
            <Card title="Project Description" footer={footer}>
              <Divider className="mb-2" />
              <div>
                Title:
                <h5>
                  {projectData.name}
                </h5>
              </div>
              <div>
                Date & Time:
                <h5>
                  {projectData ? new Date(projectData.created_at).toLocaleString() : ""}
                </h5>
              </div>
              <div>
                Time Elapsed:
                <h5>
                  {secondsToHms(projectData.project_duration)}
                </h5>
              </div>
              <div>
                Location:
                <h5>
                  {projectData.location}
                </h5>
              </div>
            </Card>
            <div className="d-flex flex-row card">
              <Card title="Total" className="w-50">
                <h3>{Object.values(objects).reduce((a, b) => a + b, 0)}</h3>
              </Card>
              <Card title="Unidentified" className="w-50">
                <h3>0</h3>
              </Card>
            </div>
            <div className="d-flex flex-row card">
              <Card title="Marine" className="w-50">
                {(() => {
                  const entries = Object.entries(objects);
                  if (entries.length > 0) {
                    const [key, value] = entries[0];
                    return <h3 key={key}>{value}</h3>;
                  }
                  return null;
                })()}
              </Card>
              <Card title="Non-Marine" className="w-50">
                {(() => {
                  const entries = Object.entries(objects);
                  if (entries.length > 0) {
                    const [key, value] = entries[1];
                    return <h3 key={key}>{value}</h3>;
                  }
                  return null;
                })()}
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Charter;
