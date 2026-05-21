import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { StorageProvider } from "./context/StorageProvider";
import { ThemeProvider } from "./context/ThemeProvider";
import { UserProvider } from "./context/UserProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <StorageProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </StorageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
