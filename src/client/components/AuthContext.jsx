import React from "react";

const AuthContext = React.createContext({
  session: null,
  avatar: null,
  identity: null,
  ready: false,
  metrics: null,
  gaMeasurementId: null,
  setMetrics: () => {},
  setRemainingQuota: () => {},
});

export default AuthContext;
