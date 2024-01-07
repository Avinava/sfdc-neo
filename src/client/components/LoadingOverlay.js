import React from "react";
import { Typography } from "@mui/material";
import { CircleSpinnerOverlay } from "react-spinner-overlay";

const LoadingOverlay = ({ loading, message, subtitle }) => (
  <CircleSpinnerOverlay
    overlayColor="rgba(0,153,255,0.2)"
    message={
      <React.Fragment>
        <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
          {message}
        </Typography>
        <Typography variant="body1" sx={{ color: "white" }}>
          {subtitle || "This may take few seconds..."}
        </Typography>
      </React.Fragment>
    }
    loading={loading}
  />
);

export default LoadingOverlay;
