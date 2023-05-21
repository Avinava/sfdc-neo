import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import AuthProvider from "./components/AuthProvider";
import AuthContext from "./components/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.Fragment>
    <AuthProvider>
      <AuthContext.Consumer>
        {() => {
          return <App />;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  </React.Fragment>
);
