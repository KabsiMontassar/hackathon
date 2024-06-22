import React from "react";
import ReactDOM from "react-dom/client"; // Import from 'react-dom/client' for React 18
import App from "./App";
import "./style.css"; // Assuming you have a CSS file named 'style.css'

// Create the root element for the app
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);

// Render the App component
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
