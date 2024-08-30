import React from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Container } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import portfolio_image from "../../assets/images/bg-ocean.jpeg";
import { Image } from "primereact/image";
import { SplitButton } from "primereact/splitbutton";

import UserPortfolio from "../_Components/UserPortfolio";

function Portfolio() {
  const sampleData = [
    {
      image: portfolio_image,
      title: "Project A",
      location: "Lorem ipsum dolor sit amet",
      date: "2023-01-15",
      duration: "2 weeks",
    },
    {
      image: portfolio_image,
      title: "Project B",
      location: "Consectetur adipiscing elit",
      date: "2023-03-10",
      duration: "1 month",
    },
    {
      image: portfolio_image,
      title: "Project C",
      location: "Sed do eiusmod tempor incididunt",
      date: "2023-05-20",
      duration: "3 weeks",
    },
    {
      image: portfolio_image,
      title: "Project D",
      location: "Ut labore et dolore magna aliqua",
      date: "2023-07-05",
      duration: "2 months",
    },
    {
      image: portfolio_image,
      title: "Project E",
      location: "Ut enim ad minim veniam",
      date: "2023-09-18",
      duration: "1 week",
    },
  ];

  const pendingData = [
    {
      image: portfolio_image,
      title: "Pending Project 1",
      location: "Lorem ipsum dolor sit amet",
      date: "2023-01-15",
      duration: "2 weeks",
    },
    {
      image: portfolio_image,
      title: "Pending Project 2",
      location: "Consectetur adipiscing elit",
      date: "2023-03-10",
      duration: "1 month",
    },
    // Add more draft projects as needed
  ];

  const draftData = [
    {
      image: portfolio_image,
      title: "Draft Project 1",
      location: "Lorem ipsum dolor sit amet",
      date: "2023-01-15",
      duration: "2 weeks",
    },
    {
      image: portfolio_image,
      title: "Draft Project 2",
      location: "Consectetur adipiscing elit",
      date: "2023-03-10",
      duration: "1 month",
    },
    {
      image: portfolio_image,
      title: "Draft Project 3",
      location: "Sed do eiusmod tempor incididunt",
      date: "2023-05-20",
      duration: "3 weeks",
    },
    // Add more draft projects as needed
  ];

  const publishedData = [
    {
      image: portfolio_image,
      title: "Published Project 1",
      location: "Ut labore et dolore magna aliqua",
      date: "2023-07-05",
      duration: "2 months",
    },
    {
      image: portfolio_image,
      title: "Published Project 2",
      location: "Ut enim ad minim veniam",
      date: "2023-09-18",
      duration: "1 week",
    },
    // Add more published projects as needed
  ];

  const tableActions = [
    {
      label: "Delete Project",
      icon: "pi pi-trash",
      command: () => {
        handlePortfolioDelete();
      },
    },
  ];

  const projectColumnTemplate = (rowData) => {
    return (
      <div className="d-flex align-items-center">
        <div className="me-3">
          <Image src={rowData.image} width="100px" height="auto" />
        </div>
        <div className="d-flex flex-column">
          <strong>{rowData.title}</strong>
          <small>{rowData.location}</small>
        </div>
      </div>
    );
  };

  const actionsColumnTemplate = (rowData) => {
    return (
      <SplitButton
        label="View"
        icon="pi pi-eye"
        rounded
        onClick={handlePortfolioViw}
        model={tableActions}
        size="small"
      />
    );
  };

  const handlePortfolioViw = () => {
    console.log("Add portfolio View Function here")
  }

  const handlePortfolioDelete = () => {
    console.log("Add delete function here");
  };

  return (
    <Container fluid className="g-0 vh-100 p-5 max-vh-100">
      <TabView>
        <TabPanel header="All">
          <UserPortfolio onRowClick={() => {}}/>
          {/* <DataTable
            value={sampleData}
            paginator
            rows={5}
            stripedRows
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableClassName={{ minWidth: "50rem" }}
          >
            <Column
              field="image"
              header="Project"
              body={projectColumnTemplate}
            />
            <Column field="date" sortable header="Date" />
            <Column field="duration" sortable header="Elapsed Time" />
            <Column
              field="actions"
              header="Actions"
              body={actionsColumnTemplate}
            />
          </DataTable> */}
        </TabPanel>
        <TabPanel header="Draft">
        <DataTable
            value={draftData}
            paginator
            rows={5}
            stripedRows
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableClassName={{ minWidth: "50rem" }}
          >
            <Column
              field="image"
              header="Project"
              body={projectColumnTemplate}
            />
            <Column field="date" sortable header="Date" />
            <Column field="duration" sortable header="Elapsed Time" />
            <Column
              field="actions"
              header="Actions"
              body={actionsColumnTemplate}
            />
          </DataTable>
        </TabPanel>
        <TabPanel header="Pending">
        <DataTable
            value={pendingData}
            paginator
            rows={5}
            stripedRows
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableClassName={{ minWidth: "50rem" }}
          >
            <Column
              field="image"
              header="Project"
              body={projectColumnTemplate}
            />
            <Column field="date" sortable header="Date" />
            <Column field="duration" sortable header="Elapsed Time" />
            <Column
              field="actions"
              header="Actions"
              body={actionsColumnTemplate}
            />
          </DataTable>
        </TabPanel>
        <TabPanel header="Published">
        <DataTable
            value={publishedData}
            paginator
            rows={5}
            stripedRows
            rowsPerPageOptions={[5, 10, 25, 50]}
            tableClassName={{ minWidth: "50rem" }}
          >
            <Column
              field="image"
              header="Project"
              body={projectColumnTemplate}
            />
            <Column field="date" sortable header="Date" />
            <Column field="duration" sortable header="Elapsed Time" />
            <Column
              field="actions"
              header="Actions"
              body={actionsColumnTemplate}
            />
          </DataTable>
        </TabPanel>
      </TabView>
    </Container>
  );
}

export default Portfolio;
