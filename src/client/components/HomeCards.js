import * as React from "react";
import {
  Card,
  CardContent,
  Button,
  Container,
  Box,
  Grid,
  Typography,
  Chip,
  Paper,
  CardActionArea,
} from "@mui/material";
import AuthContext from "./AuthContext";
import { TbPlugConnected, TbPlugConnectedX } from "react-icons/tb";
import { BiCodeCurly } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";

import { Link } from "react-router-dom";

class HomeCards extends React.Component {
  static contextType = AuthContext;
  state = {};

  render() {
    return (
      <React.Fragment>
        <Container maxWidth="xl">
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Card sx={{ backgroundColor: "#f5f5f5", mt: 4, p: 2 }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 600, marginBottom: 1.5 }}
                  >
                    Welcome to sfdc-neo 👋🏻
                  </Typography>
                  <Typography variant="body1">
                    SFDC Neo is a powerful tool that connects with your
                    Salesforce org using OAuth. It provides a set of openai
                    based tools to help you with generating test classes,
                    documenting your code and more.
                  </Typography>
                  {this.context.session?.org && (
                    <React.Fragment>
                      <br />
                      <br />
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 600, marginBottom: 1.5 }}
                      >
                        You are currently logged in to:
                      </Typography>
                      <Card sx={{ mt: 1 }}>
                        <CardContent>
                          <Grid
                            container
                            spacing={2}
                            justifyContent="space-between"
                            alignItems="flex-end"
                          >
                            <Grid item xs={12} sm={6} lg={5} md={5}>
                              <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                              >
                                {this.context.session?.org?.Name}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Chip
                                icon={<TbPlugConnected />}
                                label="Connected"
                                color="success"
                                variant="small"
                              />
                            </Grid>
                          </Grid>

                          <Typography variant="h5" component="div"></Typography>
                          <Typography sx={{ mb: 1.5 }} color="text.secondary">
                            {this.context.session?.org?.OrganizationType}
                          </Typography>
                          <Box display="flex" alignItems="center">
                            <Chip
                              label="Quota"
                              color="primary"
                              variant="outlined"
                              size="small"
                              sx={{ mr: 2 }}
                            />
                            <Typography variant="body1">
                              You have currently{" "}
                              <Typography
                                component="span"
                                variant="body1"
                                color="primary"
                              >
                                {this.context.metrics?.remainingQuota}
                              </Typography>{" "}
                              remaining calls out of{" "}
                              <Typography
                                component="span"
                                variant="body1"
                                color="primary"
                              >
                                {this.context.metrics?.dailyQuota}
                              </Typography>
                              .
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                      <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={4} sm={12} lg={4} md={4}>
                          <Card sx={{ mt: 1 }}>
                            <CardContent>
                              <Grid
                                container
                                spacing={2}
                                justifyContent="space-between"
                                alignItems="flex-end"
                              >
                                <Grid item xs={12} sm={8} lg={8} md={8}>
                                  <Typography
                                    sx={{ fontSize: 18 }}
                                    variant="h6"
                                    gutterBottom
                                  >
                                    Apex Code
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 14, minHeight: 45 }}
                                    color="text.secondary"
                                    component="div"
                                  >
                                    Generate Test Class, Documentation and Code
                                    Comments
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <BiCodeCurly
                                    size="1.5em"
                                    style={{ color: "#ff9800" }}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                            <CardActionArea component={Link} to={"/generator"}>
                              <Box
                                sx={{
                                  bgcolor: "#ff9800",
                                  color: "white",
                                  p: 2,
                                  textAlign: "center",
                                }}
                              >
                                <Typography variant="body1">
                                  Go to Apex Code Generator
                                </Typography>
                              </Box>
                            </CardActionArea>
                          </Card>
                        </Grid>
                        <Grid item xs={4} sm={12} lg={4} md={4}>
                          <Card sx={{ mt: 1 }}>
                            <CardContent>
                              <Grid
                                container
                                spacing={2}
                                justifyContent="space-between"
                                alignItems="flex-end"
                              >
                                <Grid item xs={12} sm={8} lg={8} md={8}>
                                  <Typography
                                    sx={{ fontSize: 18 }}
                                    variant="h6"
                                    gutterBottom
                                  >
                                    Email Templates
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: 14, minHeight: 45 }}
                                    color="text.secondary"
                                    component="div"
                                  >
                                    Better format your email templates
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <AiOutlineMail
                                    size="1.5em"
                                    style={{ color: "#ff9800" }}
                                  />
                                </Grid>
                              </Grid>
                            </CardContent>
                            <CardActionArea component={Link} to={"/generator"}>
                              <Box
                                sx={{
                                  bgcolor: "#ff9800",
                                  color: "white",
                                  p: 2,
                                  textAlign: "center",
                                }}
                              >
                                <Typography variant="body1">
                                  Go to Email Templates Generator
                                </Typography>
                              </Box>
                            </CardActionArea>
                          </Card>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  )}
                  {!this.context.session?.org && (
                    <Paper sx={{ mt: 4, p: 2 }}>
                      <Grid
                        container
                        spacing={2}
                        justifyContent="space-between"
                        alignItems="flex-end"
                      >
                        <Grid item xs={12} sm={6} lg={5} md={5}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, marginBottom: 1.5 }}
                          >
                            You are not currently logged in to any org.
                          </Typography>
                          <Typography
                            sx={{ fontSize: 14 }}
                            color="text.secondary"
                            gutterBottom
                          >
                            You are not currently logged in to any org.
                          </Typography>
                          <Typography variant="body1">
                            Click on the button below to get started.
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Chip
                            icon={<TbPlugConnectedX />}
                            label="Disconnected"
                            color="error"
                            variant="small"
                          />
                        </Grid>
                      </Grid>
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <Button
                          variant="contained"
                          sx={{ marginTop: "20px", marginLeft: "auto" }}
                          component={Link}
                          to={"/login"}
                        >
                          Go to Login
                        </Button>
                      </Box>
                    </Paper>
                  )}
                  {this.context.session?.org && (
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Button
                        variant="contained"
                        sx={{ mt: 3, marginLeft: "auto", mr: 2 }}
                        component={Link}
                        to={"/login"}
                        color="secondary"
                      >
                        Back To Login
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

export default HomeCards;
