import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";

import { getProjectsForAuthenticatedUser } from "../../services/projectService";

const Projects = ({onRowClick}) => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch data
        getProjectsForAuthenticatedUser()
            .then((data) => {
                if (data === undefined) return;
                data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Sort the data
                setProjects(data);
            });
    }, []);

    const recentTemplate = (rowData) => {
        return formatDistanceToNow(new Date(rowData.updated_at)) + ' ago';
    }

    const durationTemplate = (rowData) => {
        const duration = rowData.project_duration;
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    }

    const handleRowClick = (event) => {
        // console.log('Clicked row', event.data);
        navigate(`/user/charter/${event.data.id}`)
        localStorage.setItem("project", event.data.id);
        onRowClick(event.data);
    }

    return (
        <DataTable className="text-truncate overflow-auto" scrollable value={projects} emptyMessage="You don't have any projects yet. Start by creating a new project. "
            rowClassName="hoverable-row" onRowClick={handleRowClick}>
            <Column field="name" header="Name"></Column>
            <Column field="project_duration" header="Time Elapsed" body={durationTemplate}></Column>
            <Column field="location" header="Location"></Column>
            <Column field="updated_at" header="Recent" body={recentTemplate}></Column>
        </DataTable>
    );
}

export default Projects;