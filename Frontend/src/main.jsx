import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { LoadingProvider } from "./components/LoadingContext.jsx";
import FullScreenLoader from "./components/FullScreenLoader.jsx";
import "./index.css";

// Import Echo and Pusher
import Echo from "laravel-echo";
import Pusher from "pusher-js";


// Set Pusher on window for Echo to use
window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: "pusher",
  key: "local",
  cluster: "mt1",
  wsHost: "127.0.0.1",
  wsPort: 6001, 
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
});

const pusher = window.Echo.connector.pusher;

pusher.connection.bind('pusher:connection_established', () => {
  console.log('WebSocket connected!');
});

pusher.connection.bind('pusher:connection_error', (err) => {
  console.error('WebSocket connection error:', err);
});

pusher.connection.bind('pusher:disconnected', () => {
  console.log('WebSocket disconnected.');
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LoadingProvider>
      <FullScreenLoader />
      <App />
    </LoadingProvider>
  </React.StrictMode>
);
