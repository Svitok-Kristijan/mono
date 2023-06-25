import React from "react";
import ReactDOM from "react-dom";
import authStore from "./utils/authStore";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

authStore.isLoggedIn = false;
authStore.currentUser = null;

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
