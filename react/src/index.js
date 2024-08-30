import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";
import router from "./router";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css';
        



const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  
  <React.StrictMode>
    <PrimeReactProvider value={{unstyled: false}}>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </React.StrictMode>
);
