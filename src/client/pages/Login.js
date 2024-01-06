import React from "react";
import {
  CardActions,
  CardContent,
  Card,
  Grid,
  Container,
  Button,
  Box,
  Typography,
  Alert,
} from "@mui/material";

class Login extends React.Component {
  render() {
    const features = [
      {
        label: "Apex",
        details: [
          "Document code",
          "Generating test classes",
          "Adding comments to code",
          "Reviewing and refactoring code",
        ],
      },
      {
        label: "Email Templates",
        details: ["Better formatting email templates"],
      },
      { label: "Validation Rules", details: ["Documenting validation rules"] },
      {
        label: "Flow",
        details: ["Document Flows", "Generate test classes for Flows"],
      },
    ];

    return (
      <React.Fragment>
        <Container maxWidth="xl" component="main" sx={{ pt: 5 }}>
          <Grid container justifyContent="center" alignItems="stretch">
            <Grid item xs={12} sm={6} lg={6} md={6}>
              <Card
                sx={{
                  backgroundColor: "#f5f5f5",
                  margin: "1rem",
                  padding: "1rem",
                  height: "95%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    marginBottom: 1.5,
                    textAlign: "center",
                  }}
                >
                  Welcome to sfdc-neo 👋🏻
                </Typography>
                <Typography
                  variant="body2"
                  component="div"
                  sx={{ textAlign: "center" }}
                >
                  SFDC Neo is a Node.js application that uses OpenAI to help
                  Salesforce developers with a variety of tasks, including:
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={12} md={12} key={index}>
                      <Card>
                        <CardContent>
                          <Typography variant="body1" component="div">
                            <strong>{feature.label}</strong>
                          </Typography>
                          {feature.details.map((detail, index) => (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body2">{detail}</Typography>
                            </Box>
                          ))}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} lg={5} md={5}>
              <Card
                sx={{
                  backgroundColor: "#e0e0e0",
                  margin: "1rem",
                  padding: "1rem",
                  height: "95%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ background: "gray", minHeight: "4px" }}></div>
                <CardContent sx={{ pt: 1 }}>
                  <Box
                    sx={{
                      mb: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body2"
                      component="div"
                      sx={{ textAlign: "center" }}
                    >
                      Get started by logging in using your Salesforce Account
                    </Typography>
                  </Box>
                  <CardActions sx={{ p: 4 }}>
                    <Grid container justifyContent="center">
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          href="/api/v1/auth/production"
                        >
                          Login with Salesforce Production
                        </Button>
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          href="/api/v1/auth/production"
                        >
                          Login with Salesforce Developer
                        </Button>
                      </Grid>
                      <Grid item xs={12} sx={{ mt: 1 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          href="/api/v1/auth/sandbox"
                        >
                          Login with Salesforce Sandbox
                        </Button>
                      </Grid>
                    </Grid>
                  </CardActions>
                  <Alert severity="info" color="info" sx={{ mt: 2 }}>
                    it's important to acknowledge that sfdc-neo's performance is
                    dependent on the capabilities of OpenAI. Occasionally, there
                    may be instances where the generated output may be
                    inaccurate or inconsistent.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

export default Login;
