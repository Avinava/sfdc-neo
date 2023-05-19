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
} from "@mui/material";
import { AiFillApi } from "react-icons/ai";
import { SiSalesforce } from "react-icons/si";
import { HiOutlineCode } from "react-icons/hi";

import { Link } from "react-router-dom";

class HomeCards extends React.Component {
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
                  <Typography variant="h5" component="div">
                    SFDC Neo
                  </Typography>
                  <Typography variant="body1">
                    SFDC Neo is a powerful tool that connects with your
                    Salesforce org using OAuth. It provides a set of openai
                    based tools to help you with generating test classes,
                    documenting your code and more.
                    <br />
                    <br />
                    <Typography variant="h5" component="div">
                      How it works
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Icon
                        component={SiSalesforce}
                        sx={{ fontSize: 16, marginRight: "5px" }}
                      />
                      Once logged in, It fetches a list of available Apex
                      classes from your org and displays them, making it easy to
                      navigate and explore your codebase.
                    </Typography>
                    <br />
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Icon
                        component={HiOutlineCode}
                        sx={{ fontSize: 16, marginRight: "5px" }}
                      />
                      SFDC Neo doesn't store any of your code on its server.
                    </Typography>
                    <br />
                    <Typography
                      variant="body1"
                      sx={{ display: "flex", alignItems: "center" }}
                    >
                      <Icon
                        component={AiFillApi}
                        sx={{ fontSize: 16, marginRight: "5px" }}
                      />
                      Once you select a class and trigger an action, SFDC Neo
                      leverages OpenAI APIs to complete the action
                    </Typography>
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ marginTop: "20px" }}
                    component={Link}
                    to={"/generator"}
                  >
                    Get Started
                  </Button>
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
