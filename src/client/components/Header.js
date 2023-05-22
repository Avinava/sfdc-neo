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
  Grid,
  Chip,
} from "@mui/material";
import AuthContext from "./AuthContext";
import { Link } from "react-router-dom";
import icon from "../../../public/logo.png";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  static contextType = AuthContext;

  handleMenu = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  handleSignOut = () => {
    window.location.href = "/api/v1/auth/logout";
  };

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
              {this.context.session?.id && (
                <Box
                  sx={{
                    flexGrow: 1,
                    justifyContent: "flex-end",
                    display: "flex",
                    ml: 2,
                  }}
                >
                  {this.context.metrics && (
                    <Tooltip
                      title={`You have ${this.context.metrics.remainingQuota} requests remaining today out of ${this.context.metrics.dailyQuota} `}
                    >
                      <Chip
                        label={
                          this.context.metrics.remainingQuota +
                          " / " +
                          this.context.metrics.dailyQuota
                        }
                        size="small"
                        color={
                          this.context.metrics.remainingQuota > 0
                            ? "success"
                            : "error"
                        }
                        variant="standard"
                      ></Chip>
                    </Tooltip>
                  )}
                  <IconButton sx={{ p: 0 }} onClick={this.handleMenu}>
                    <Avatar
                      alt={this.context.session.displayName}
                      sx={{ height: 35, width: 35, ml: 1 }}
                    >
                      {this.context.session.displayName.charAt(0)}
                    </Avatar>
                  </IconButton>

                  <Menu
                    id="menu-appbar"
                    sx={{ mt: "45px" }}
                    anchorEl={this.state.menuAnchorEl}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                    open={Boolean(this.state.menuAnchorEl)}
                    onClick={this.handleMenuClose}
                  >
                    <MenuItem component={Link} to="/home">
                      <Grid container alignItems="center">
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" noWrap>
                            {this.context.session.displayName}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" noWrap>
                            {this.context.session.raw.username}
                          </Typography>
                        </Grid>
                      </Grid>
                    </MenuItem>
                    <MenuItem onClick={this.handleSignOut}>Sign Out</MenuItem>
                  </Menu>
                </Box>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </React.Fragment>
    );
  }
}

export default Header;
