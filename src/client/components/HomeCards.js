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
} from "@mui/material";

import { Link } from "react-router-dom";

class HomeCards extends React.Component {
  state = {
    cards: [
      {
        title: "Apex Test Class Generator",
        description:
          "Generate Apex test classes for your Apex classes and triggers.",
        link: "/test-generator",
      },
    ],
  };

  render() {
    return (
      <React.Fragment>
        <Container maxWidth="xl">
          <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={2}>
              {this.state.cards.map((card, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button
                        size="small"
                        color="primary"
                        component={Link}
                        to={card.link}
                      >
                        Generate
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </React.Fragment>
    );
  }
}

export default HomeCards;
