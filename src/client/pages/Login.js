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
  Alert
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
                <CardContent sx={{ pt: 2, textAlign: "center" }}>
                  <Box
                    sx={{
                      mb: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
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
                      }}
                    >
                      sfdc-neo
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 600, marginBottom: 1.5 }}
                    >
                      Welcome to sfdc-neo 👋🏻
                    </Typography>
                    <Typography variant="body2">
                      SFDC neo is a Node.js application designed to assist
                      developers with Salesforce tasks, such as documenting and
                      generating test classes. It leverages the capabilities of
                      OpenAI to complete these tasks.
                    </Typography>
                    <Alert severity="info" color="info" sx={{ mt: 2 }}>
                      it's important to acknowledge that sfdc-neo's performance is dependent on the capabilities of OpenAI.
                      Occasionally, there may be instances where the generated output may be inaccurate or inconsistent.
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
