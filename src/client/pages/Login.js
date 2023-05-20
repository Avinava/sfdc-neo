import React, { Component, useContext } from "react";
import {
  CardActions,
  Avatar,
  CardContent,
  CardHeader,
  Card,
  Grid,
  Container,
  Button,
  Box,
  Typography,
} from "@mui/material";
import icon from "../../../public/logo.png";

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
                  <Box sx={{ mb: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography
                      variant='h6'
                      sx={{
                        ml: 3,
                        lineHeight: 1,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        fontSize: '1.5rem !important'
                      }}
                    >
                      sfdc-neo
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 6 }}>
                    <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                      Welcome to sfdc-neo 👋🏻
                    </Typography>
                    <Typography variant='body2'>
                      SFDC neo is a Node.js application designed to assist
                      developers with Salesforce tasks, such as documenting and
                      generating test classes. It leverages the capabilities of
                      OpenAI to complete these tasks.
                    </Typography>
                  </Box>
                  {/* <Avatar
                    src={icon}
                    sx={{
                      ml: 1,
                      width: 80,
                      height: 80,
                      margin: "auto",
                      mt: 0.3,
                      mb: 1,
                      display: "block",
                      background: "red",
                    }}
                    variant="square"
                  /> */}

                </CardContent>
                <CardActions>
                  <Grid container justifyContent="center">
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        href="/api/v1/auth/production"
                      >
                        Login with Salesforce
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
