import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";

import AuthProvider from "./components/AuthProvider";
import AuthContext from "./components/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.Fragment>
    <CssBaseline />
    <AuthProvider>
      <AuthContext.Consumer>
        {(authContext) => {
          console.log("rendering");
          return <App />;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  </React.Fragment>
);
