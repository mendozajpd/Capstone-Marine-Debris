import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import NewProject from "../_Components/NewProject.dialog";

import { getProjectByProjectId } from "../../services/projectService";

function Charter() {
  const [newProject, setNewProject] = useState(false);
  const [projectData, setProjectData] = useState({});

  const { project } = useParams();

  // LIVE FEED
  const [error, setError] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [objects, setObjects] = useState({});

  const videoSource = "http://192.168.193.206:5000/video_frame";


  useEffect(() => {
    const interval = setInterval(() => {
      fetch("http://192.168.193.206:5000/backend_data")
        .then((response) => response.json())
        .then((data) => {
          // setVehicleCount(data.object_count);
          // setClassCount(data.class_counts);
          setObjects(data.object_count);
          console.log(data.object_count);
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(true);
        });
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
          {error ? (
            <h1>Can't fetch video</h1>
          ) : (
            <>
              <img
                src={videoSource}
                alt="Video Frame"
                style={{
                  width: "100%",
                  height: "auto",
                  border: "1px solid black",
                }}
              />
            </>
          )}
        </div>
        <div className="d-flex w-50 border">
          <div className="w-50 h-100 border">
            <DataTable className="w-100">
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
