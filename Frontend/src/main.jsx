import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { LoadingProvider } from "./components/LoadingContext.jsx";
import FullScreenLoader from "./components/FullScreenLoader.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
      <FullScreenLoader />
      <App />
    </LoadingProvider>
  </React.StrictMode>
);
