import React from "react";

const AuthContext = React.createContext({
  session: null,
  avatar: null,
  identity: null,
  ready: false,
});

export default AuthContext;
