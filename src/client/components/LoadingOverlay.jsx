import React from "react";
import { Typography, Box } from "@mui/material";
import { CircleSpinnerOverlay } from "react-spinner-overlay";

const LoadingOverlay = ({ loading, message, subtitle }) => (
  <CircleSpinnerOverlay
    overlayColor="#0028558f"
    color="#179fff"
    message={
      <React.Fragment>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: 1,
            padding: 2,
            backgroundColor: "#00000047",
            borderRadius: 1,
            border: "1px solid #002855",
          }}
        >
          <Typography variant="body1" sx={{ color: "white", fontWeight: 600 }}>
            {message}
          </Typography>
          <Typography variant="body1" sx={{ color: "white" }}>
            {subtitle || "This may take few seconds..."}
          </Typography>
        </Box>
      </React.Fragment>
    }
    loading={loading}
  />
);

export default LoadingOverlay;
