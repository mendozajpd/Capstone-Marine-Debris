import React, { useRef, useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";

import { getUsers, getUsersInformation } from "../../services/userService";
import UserInformation from "../_Components/UserInformation";
import NewUserForm from "../_Components/NewUserForm";

function AdminUsersList() {
  const op = useRef(null);

  // REFRESH
  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedUsers, setSelectedUsers] = useState(null);
  const [expandedRows, setExpandedRows] = useState(null);

  const [users, setUsers] = useState([]);
  const [userInformation, setUserInformation] = useState([]); 



  const expandAll = () => {
    let _expandedRows = {};

    users.forEach((p) => (_expandedRows[`${p.id}`] = true));

    setExpandedRows(_expandedRows);
  };

  const collapseAll = () => {
    setExpandedRows(null);
  };

  const allowExpansion = (rowData) => {
    // Simplified to always return true, allowing all rows to be expandable
    return true;
  };

  const rowExpansionTemplate = (data) => {
    const { id } = data; 
    const userInfo = userInformation.find(user => user.id === id); // Get the user information based on the expanded row's ID

    return (
      <UserInformation
        userInfo={userInfo}
      />
    );
};

  useEffect(() => {
    getUsers().then((data) => {
      setUsers(data);
    });

    getUsersInformation().then((data) => {
      setUserInformation(data);
    });

  },[])

  const header = (
    <div className="d-flex flex-wrap justify-content-between gap-2">
      <div>
        <Button
          className="rounded-pill"
          severity="success"
          icon="pi pi-plus"
          label="Create User"
          onClick={(e) => op.current.toggle(e)}
        />

        <OverlayPanel
          ref={op}
          showCloseIcon
          closeOnEscape={false}
          dismissable={false}
        >
          <NewUserForm/>
        </OverlayPanel>
      </div>
      <div className="flex flex-wrap justify-content-end gap-2">
        <Button icon="pi pi-plus" label="Expand All" onClick={expandAll} text />
        <Button
          icon="pi pi-minus"
          label="Collapse All"
          onClick={collapseAll}
          text
        />
      </div>
    </div>
  );

  return (
    <Container fluid className="d-flex flex-column flex-grow-1">
      <Row className="flex-grow-1 p-5">
        <Card className="card">
          <DataTable
            paginator
            header={header}
            rows={5}
            rowsPerPageOptions={[5, 10, 25, 50]}
            value={users}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            selectionMode={"checkbox"}
            selection={selectedUsers}
            onSelectionChange={(e) => setSelectedUsers(e.value)}
            dataKey="id"
            stripedRows
            tableStyle={{ minWidth: "60rem" }}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column
              body={(_rowData, { rowIndex }) => rowIndex + 1}
              header="#"
            />
            <Column field="id" header="ID" />
            <Column field="email" header="Email" />
            <Column field="status" header="Status" />

            <Column expander={allowExpansion} style={{ width: "5rem" }} />
          </DataTable>
        </Card>
      </Row>
    </Container>
  );
}

export default AdminUsersList;
