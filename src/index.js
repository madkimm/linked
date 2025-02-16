import React from "react";
import ReactDOM from "react-dom/client";  // <-- React 18 방식으로 변경
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
