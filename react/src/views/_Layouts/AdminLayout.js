import React, { useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Avatar } from "primereact/avatar";
import { StyleClass } from "primereact/styleclass";

import logo from "../../assets/images/sior-logo-white.png";
import { Link, Outlet } from "react-router-dom";

function AdminLayout() {
  const dashboardBtnRef = useRef(null);

  return (
    <Container fluid className="d-flex flex-column vh-100">
      <Row className="d-flex shadow-lg admin-header shadow-lg align-items-center text-white">
        <Col xs="auto" className="clickable">
          <img src={logo} alt="Logo" height={40} />
        </Col>
        <Col>Breadcrumbs Here</Col>
        <Col xs="auto" className="clickable">
          <Avatar
            icon="pi pi-user"
            shape="circle"
            size="medium"
            className="p-mr-2"
          />
        </Col>
      </Row>
      <Row className="flex-grow-1">
        <Col xs={2} className="admin-sidebar shadow-lg">
          <div className="min-h-100 d-flex relative lg-static surface-ground  ">
            <div
              id="app-sidebar-2"
              className="surface-section h-100 w-100 lg-block flex-shrink-0 lg-static left-0 top-0 z-1 border-right surface-border select-none"
            >
              <div className="d-flex flex-column h-100">
                <div className="overflow-y-auto">
                  <ul className="list-none p-3 m-0">
                    <li className="mb-5">
                      <StyleClass
                        nodeRef={dashboardBtnRef}
                        selector="@next"
                        enterFromClassName="hidden"
                        enterActiveClassName="slidedown"
                        leaveToClassName="hidden"
                        leaveActiveClassName="slideup"
                      >
                        <div
                          ref={dashboardBtnRef}
                          className="p-ripple d-flex align-items-center justify-content-between text-700 cursor-pointer"
                        >
                          <div>
                            <i className="pi pi-home mr-2" />
                            <span className="font-medium text-dark">
                              Dashboards
                            </span>
                          </div>
                          <i className="pi pi-chevron-down" />
                        </div>
                      </StyleClass>
                      <ul className="list-none p-0 m-0 mx-4 overflow-hidden">
                        <li>
                          <Link
                            to="/admin/analytics"
                            className="p-ripple custom-navitem"
                          >
                            <i className="pi pi-chart-line mr-2" />
                            <span className="font-medium text-dark">
                              Analytics
                            </span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/users"
                            className="p-ripple custom-navitem"
                          >
                            <i className="pi pi-user mr-2" />
                            <span className="font-medium text-dark">Users</span>
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/admin/projects"
                            className="p-ripple custom-navitem"
                          >
                            <i className="pi pi-folder mr-2" />
                            <span className="font-medium text-dark">
                              Projects
                            </span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <ul className="list-none p-0 m-0 overflow-hidden">
                      <li>
                        <Link className="p-ripple custom-navitem">
                          <i className="pi pi-chart-line" />
                          <span className="mx-2 font-medium text-dark">
                            Other Stuff
                          </span>
                        </Link>
                      </li>
                    </ul>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col className="d-flex flex-column py-0 g-0">
          {/* Make the Outlet container scrollable */}
          <div style={{ height: "calc(100vh - 60px)", overflowY: "auto" }}>
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminLayout;
