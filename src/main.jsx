import React from "react";
import { createRoot } from "react-dom/client";
import OmarAISystemsLandingPage from "./App.jsx";
import { identifyKnownVisitor } from "./lib/identity.js";
import "./styles.css";

// The one file every page of the app passes through, so the one place a
// returning visitor gets re-bound to the record we already hold for them.
// The install snippet queues this until the tracker lands, so running it here
// — before React has rendered anything — loses nothing.
identifyKnownVisitor();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <OmarAISystemsLandingPage />
  </React.StrictMode>,
);
