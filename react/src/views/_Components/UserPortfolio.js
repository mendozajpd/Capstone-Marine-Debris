import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Image } from "primereact/image";
import { Column } from "primereact/column";
import { format, formatDistanceToNow } from 'date-fns';
import { useNavigate } from "react-router-dom";

import portfolio_image from "../../assets/images/bg-ocean.jpeg";
import { getProjectsForAuthenticatedUser } from "../../services/projectService";

const UserPortfolio = ({ onRowClick }) => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    const projectColumnTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center">
                <div className="me-3">
                    <Image src={portfolio_image} width="100px" height="auto" />
                </div>
                <div className="d-flex flex-column">
                    <strong>{rowData.name}</strong>
                    <small>{rowData.location}</small>
                </div>
            </div>
        );
    };


    useEffect(() => {
        // Fetch data
        getProjectsForAuthenticatedUser()
            .then((data) => {
                if(data === undefined) return;
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

    const dateTemplate = (rowData) => {
        return format(new Date(rowData.created_at), 'MMM dd, yyyy');
    }

    const statusTemplate = (rowData) => {
        let color;
        switch (rowData.status) {
            case 'draft':
                color = 'gray';
                break;
            case 'published':
                color = 'green';
                break;
            case 'pending':
                color = 'orange';
                break;
            case 'deleted':
                color = 'red';
                break;
            default:
                color = 'black';
        }
    
        return <span style={{ color: color }}>{rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}</span>;
    }

    const handleRowClick = (event) => {
        navigate(`/user/portfolio/${event.data.id}`)
        localStorage.setItem("project", event.data.id);
        onRowClick(event.data);
    }

    return (
        <DataTable
            className="text-truncate overflow-auto"
            value={projects}
            emptyMessage="You don't have any projects yet. Start by creating a new project. "
            rowClassName="hoverable-row"
            onRowClick={handleRowClick}
            stripedRows
            rowsPerPageOptions={[5, 10, 25, 50]}
            paginator
            rows={5}
        >
            <Column
                field="name"
                sortable
                header="Project"
                body={projectColumnTemplate}
                style={{ width: "40%" }}
            />
            <Column field="created_at" sortable header="Date" body={dateTemplate} />
            <Column field="project_duration" sortable header="Time Elapsed" body={durationTemplate}></Column>
            <Column field="updated_at" sortable header="Recent" body={recentTemplate}></Column>
            <Column field="status" header="Status" body={statusTemplate}></Column>
        </DataTable>
    );
}

export default UserPortfolio;