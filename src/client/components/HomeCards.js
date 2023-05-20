import * as React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  Button,
  Container,
  Box,
  Grid,
  Typography,
  Icon,
  Chip
} from "@mui/material";
import { AiFillApi } from "react-icons/ai";
import { SiSalesforce } from "react-icons/si";
import { HiOutlineCode } from "react-icons/hi";
import AuthContext from "./AuthContext";

import { Link } from "react-router-dom";

class HomeCards extends React.Component {
  static contextType = AuthContext;
  state = {
    cards: [
      {
        title: "SFDC Neo",
        description:
          "A collection of tools to help you develop on the Salesforce platform.",
        link: "/generator",
      },
    ],
  };

  render() {
    return (
      <React.Fragment>
        <Container maxWidth="xl">
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Card sx={{ backgroundColor: "#f5f5f5", mt: 4 }}>
                <CardContent>
                  <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                    Welcome to sfdc-neo 👋🏻
                  </Typography>
                  <Typography variant='body1'>
                    SFDC Neo is a powerful tool that connects with your Salesforce org using OAuth. It provides a set of openai based tools to help you with generating test classes, documenting your code and more.
                  </Typography>
                  <React.Fragment>
                    <br />
                    <br />
                    <Typography variant='h6' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
                      You are currently logged in to:
                    </Typography>
                    <Card sx={{ mt: 1 }}>
                      <CardContent>

                        <Grid container spacing={2} justifyContent="space-between" alignItems="flex-end">
                          <Grid item xs={12} sm={6} lg={5} md={5}>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                              {this.context.session.org.Name}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Chip label="Connected" color="success" variant="small" />
                          </Grid>
                        </Grid>

                        <Typography variant="h5" component="div">

                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {this.context.session.org.OrganizationType}
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
                            You have currently{' '}
                            <Typography component="span" variant="body1" color="primary">
                              {this.context.metrics.remainingQuota}
                            </Typography>{' '}
                            remaining calls out of{' '}
                            <Typography component="span" variant="body1" color="primary">
                              {this.context.metrics.dailyQuota}
                            </Typography>
                            .
                          </Typography>

                        </Box>
                      </CardContent>
                    </Card>
                  </React.Fragment>
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Button
                      variant="contained"
                      sx={{ marginTop: "20px", marginLeft: "auto" }}
                      component={Link}
                      to={"/generator"}
                    >
                      Get Started
                    </Button>
                  </Box>
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
