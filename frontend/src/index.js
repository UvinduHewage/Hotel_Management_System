import React from "react";
import ReactDOM from "react-dom/client"; // React 18+
import { BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import App from "./App";
import "./index.css";

// Get the root element where React will render the app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Wrap the App component with BrowserRouter to provide routing context
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
