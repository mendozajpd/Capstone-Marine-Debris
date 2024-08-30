import React, { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";

import { Col, Row, CloseButton } from "react-bootstrap";

import purposeData from "../../assets/json.files/project.purpose.json";

import { createProject } from "../../services/projectService";
import Projects from "./Projects";
import { set } from "date-fns";

export default function NewProject({ visible, onHide, onSave }) {
  const [name, setname] = useState("");
  const [location, setLocation] = useState("");
  const [purpose, setPurpose] = useState("");
  const status = 'draft';
  const navigate = useNavigate();

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const newProjectData = { name, location, purpose };
    onSave(newProjectData);
    onHide(); // Close the dialog after saving
  };

  const handleCancel = (e) => {
    e.preventDefault(); // Prevent default button behavior
    onHide(); // Close the dialog without saving
  };

  const handleSelect = (e) => {
    onHide(); // Close the dialog without saving
  };

  const handleCreate = async () => {
    const newProjectData = { name, location, purpose, status };
    const projID = await createProject(newProjectData); // Wait for the Promise to resolve
    setname("");
    setLocation("");
    setPurpose("");
    if (projID) {
      navigate(`/user/charter/${projID}`)
    }
    onHide();
  }

  return (
    <Dialog
      visible={visible}
      modal
      onHide={onHide}
      className="d-flex justify-content-start"
      closable={true}
      content={({ hide }) => (
        <div className="d-flex" style={{ background: '#fff', height: '600px' }}>
          <div className="border-0 d-flex flex-column gap-4 px-5 py-5 bg-light border rounded-3 bg-light">
            <h4 className="align-self-center">New Project</h4>
            <div className="d-inline-flex flex-column gap-2">
              <label htmlFor="name" className="text-dark-50 font-semibold">
                Project Name
              </label>
              <InputText
                id="name"
                value={name}
                onChange={(e) => setname(e.target.value)}
                className="bg-white-alpha-20 border p-3 text-dark-50"
              />
            </div>
            <div className="d-inline-flex flex-column gap-2">
              <label htmlFor="location" className="text-dark-50 font-semibold">
                Location
              </label>
              <InputText
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-white-alpha-20 border p-3 text-dark-50"
              />
            </div>
            <div className="d-inline-flex flex-column gap-2">
              <label htmlFor="purpose" className="text-dark-50 font-semibold">
                Purpose
              </label>
              <Dropdown
                id="purpose"
                optionLabel="label"
                optionValue="value"
                value={purpose}
                options={purposeData.purposes}
                onChange={(e) => setPurpose(e.value)}
                placeholder="Select a purpose"
                style={{ width: "300px" }}
              />
            </div>
            <div className="d-flex align-items-center gap-2">
              <Button
                label="Create"
                onClick={(e) => handleCreate()} // Pass the event object to handleSave
                text
                className="p-3 w-full text-white rounded-4 border-success bg-success border-light-alpha-30 hover:bg-light-alpha-10"
              ></Button>
            </div>
          </div>
          <div className="border-0 d-flex flex-column gap-4 px-5 py-5 bg-light border rounded-3 bg-light" style={{ width: '50vw', minWidth: '600px' }}>
            <div className="d-flex justify-content-between">
              <h4 className="d-inline align-self-center text-truncate">Welcome back to SIOR Charter</h4>
              <CloseButton onClick={hide} />
            </div>
            <div className="d-inline-flex flex-column gap-2 overflow-hidden">
              <label htmlFor="name" className="text-dark-50 font-semibold">
                Recent
              </label>
              <div className="overflow-auto">
                <Projects onRowClick={() => handleSelect()} />
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
}
