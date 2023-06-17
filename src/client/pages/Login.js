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
    return (
      <React.Fragment>
        <Container maxWidth="xl" component="main" sx={{ pt: 14, pb: 6 }}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Grid item xs={8} sm={6} lg={5} md={5}>
              <Card>
                <div style={{ background: "gray", minHeight: "4px" }}></div>
                <CardContent sx={{ pt: 2 }}>
                  <Box
                    sx={{
                      mb: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        ml: 3,
                        lineHeight: 1,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "1.5rem !important",
                        textAlign: "center",
                      }}
                    >
                      sfdc-neo
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
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
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      SFDC Neo is a Node.js application that uses OpenAI to help
                      Salesforce developers with a variety of tasks, including:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ textAlign: "center", mt: 1 }}
                      component="div"
                    >
                      <ul className="feature-list">
                        <li>
                          <b>Apex:</b> Document code
                        </li>
                        <li>
                          <b>Apex:</b> Generating test classes
                        </li>
                        <li>
                          <b>Apex:</b> Adding comments to code
                        </li>
                        <li>
                          <b>Apex:</b> Reviewing and refactoring code
                        </li>
                        <li>
                          <b>Email Templates:</b> Better formatting email
                          templates
                        </li>
                        <li>
                          <b>Validation Rules:</b> Documenting validation rules
                        </li>
                        <li>
                          <b>Flow:</b> Document Flows
                        </li>
                        <li>
                          <b>Flow:</b> Generate test classes for Flows
                        </li>
                      </ul>
                    </Typography>
                    <Alert severity="info" color="info" sx={{ mt: 2 }}>
                      it's important to acknowledge that sfdc-neo's performance
                      is dependent on the capabilities of OpenAI. Occasionally,
                      there may be instances where the generated output may be
                      inaccurate or inconsistent.
                    </Alert>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 3 }}>
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
              </Card>
            </Grid>
          </Grid>
        </Container>
      </React.Fragment>
    );
  }
}

export default Login;
