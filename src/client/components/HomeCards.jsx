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
import { BsFillLightningFill } from "react-icons/bs";
import { BiCodeCurly } from "react-icons/bi";
import { AiOutlineMail } from "react-icons/ai";
import { MdRule } from "react-icons/md";
import { Link } from "react-router-dom";
import parse from "html-react-parser";

class HomeCards extends React.Component {
  static contextType = AuthContext;
  state = {
    cards: [
      {
        title: "Apex Code",
        description:
          "Generate test classes assisted by the metadata api, add code comments, documentation & code review for your apex classes using OpenAI.",
        icon: <BiCodeCurly size={25} style={{ color: "#ff9800" }} />,
        link: "/apex-generator",
        linkText: "Go to Apex Generator",
      },
      {
        title: "Flow Generator <sup>experimental</sup>",
        description:
          "Generate Flow test classes & documentations using OpenAI.",
        icon: <BsFillLightningFill size={25} style={{ color: "#ff9800" }} />,
        link: "/flow-generator",
        linkText: "Go to Flow Generator",
      },
      {
        title: "Email Template Generator <sup>experimental</sup>",
        description: "Better format email templates using OpenAI.",
        icon: <AiOutlineMail size={25} style={{ color: "#ff9800" }} />,
        link: "/email-generator",
        linkText: "Go to Email Template Generator",
      },
      {
        title: "Validation Rule <sup>experimental</sup>",
        description:
          "Generate description & documentation for your validation rules using OpenAI.",
        icon: <MdRule size={25} style={{ color: "#ff9800" }} />,
        link: "/validation-rule-generator",
        linkText: "Go to Validation Rule Generator",
      },
    ],
  };

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
                  <Typography
                    variant="body1"
                    sx={{
                      backgroundColor: "#c9e4f0",
                      mt: 4,
                      p: 2,
                      borderRadius: 1,
                    }}
                  >
                    If you enjoyed using sfdc-neo, would greatly appreciate it
                    if you could take a moment to show your support by giving a
                    star to the{" "}
                    <a
                      href="https://github.com/Avinava/sfdc-neo"
                      target="_blank"
                    >
                      GitHub repository.
                    </a>
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
                        {this.state.cards.map((card) => (
                          <Grid
                            item
                            xs={4}
                            sm={12}
                            lg={4}
                            md={4}
                            key={card.title}
                          >
                            <Card sx={{ mt: 1 }}>
                              <CardContent>
                                <Grid
                                  container
                                  spacing={1}
                                  justifyContent="space-between"
                                  alignItems="flex-end"
                                >
                                  <Grid item xs={12} sm={8} lg={8} md={8}>
                                    <Typography
                                      sx={{ fontSize: 18 }}
                                      variant="h6"
                                    >
                                      {parse(card.title)}
                                    </Typography>
                                  </Grid>
                                  <Grid item>{card.icon}</Grid>
                                  <Grid item xs={12}>
                                    <Typography
                                      sx={{ fontSize: 14, minHeight: 60 }}
                                      color="text.secondary"
                                      component="div"
                                    >
                                      {card.description}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                              <CardActionArea component={Link} to={card.link}>
                                <Box
                                  sx={{
                                    bgcolor: "#ff9800",
                                    color: "white",
                                    p: 2,
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="body1">
                                    {card.linkText}
                                  </Typography>
                                </Box>
                              </CardActionArea>
                            </Card>
                          </Grid>
                        ))}
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
