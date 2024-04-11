import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import App from "./App.jsx";
import "./layout.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("game-root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
