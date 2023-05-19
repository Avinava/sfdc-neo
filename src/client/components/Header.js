import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  IconButton,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import { Link } from "react-router-dom";
import icon from "../../../public/logo.png";

class Header extends React.Component {
  render() {
    return (
      <React.Fragment>
        <AppBar position="sticky">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Avatar
                src={icon}
                sx={{ mr: 1, width: 20, height: 20, mt: 0.3 }}
                variant="square"
              />
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                <Typography
                  variant="subtitle1"
                  noWrap
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "Roboto",
                    fontWeight: 700,
                    letterSpacing: ".12rem",
                    color: "inherit",
                    textDecoration: "none",
                    minWidth: 80,
                  }}
                >
                  SFDC Neo
                </Typography>
              </Link>
            </Toolbar>
          </Container>
        </AppBar>
      </React.Fragment>
    );
  }
}

export default Header;
