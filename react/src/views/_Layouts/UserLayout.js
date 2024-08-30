import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";

import logo from "../../assets/images/sior-logo.png";
import { Image, Dropdown } from "react-bootstrap";
import { Divider } from "primereact/divider";



import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

function UserLayout() {
  const navigate = useNavigate();
  const [sidebarShow, setSidebarShow] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div className="d-flex vh-100 overflow-hidden">
      <div className="card d-flex justify-content-center">
        <Sidebar visible={sidebarShow} onHide={() => setSidebarShow(false)}>
          <div className="d-flex relative lg:static surface-ground">
            <div
              className="surface-section h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none"
              style={{ width: "100%" }}
            >
              <div className="d-flex flex-column h-full">
                <div className="overflow-y-auto">
                  <ul className="list-none p-3 m-0">
                    <li>
                      <Link
                        to="/user/dashboard"
                        className="text-decoration-none p-ripple d-flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                      >
                        <i className="pi mr-2 pi-th-large" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to={`/user/charter/${localStorage.getItem("project")}`}
                        className="text-decoration-none p-ripple d-flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                        onClick={() => setSidebarShow(false)}
                      >
                        <i className="pi mr-2 pi-map " />
                        <span className="font-medium">Charter</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user/portfolio"
                        className="text-decoration-none p-ripple d-flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                      >
                        <i className="pi mr-2 pi-book" />
                        <span className="font-medium">Portfolio</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user/analytics"
                        className="text-decoration-none p-ripple d-flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                      >
                        <i className="pi mr-2 pi-chart-line" />
                        <span className="font-medium">Analytics</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user/network-map"
                        className="text-decoration-none p-ripple d-flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                      >
                        <i className="pi mr-2 pi-cloud" />
                        <span className="font-medium">Network Map</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>

      <div className="w-100">
        <header className="d-flex w-100 align-items-center px-2 position-relative justify-content-between">
          <div className="d-flex align-items-center">
            <Button
              className="mr-2"
              icon="pi pi-bars"
              rounded
              onClick={() => setSidebarShow(true)}
            />
            <Divider layout="vertical" />
            <div className="clickable mx-5">
              <Image src={logo} roundedCircle style={{ width: "72px" }} />
            </div>
            <Divider layout="vertical" />
          </div>
          {/*add breadcrumb */}
          <div className="mx-2">
            <Dropdown className="profile-dropdown">
              <Dropdown.Toggle id="dropdown-basic">
                <Image src="https://via.placeholder.com/35" roundedCircle />
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled href="/profile">
                  <i className="fa fa-user mx-2"></i>
                  Profile
                </Dropdown.Item>
                <Dropdown.Item disabled href="/settings">
                  <i className="fa fa-cog mx-2 "></i>
                  Settings
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => {handleLogout();}}>
                  <i className="fa fa-sign-out mx-2"></i>
                  Log out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>


        </header>
        <div className="d-flex position-relative" style={{ background: '#f7f7f7' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default UserLayout;
