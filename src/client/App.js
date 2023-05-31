import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./app.css";
import AuthContext from "./components/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ApexGenerator from "./pages/ApexGenerator";
import RequireAuth from "./components/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CssBaseline from "@mui/material/CssBaseline";

export default class App extends React.Component {
  state = {
    theme: createTheme({
      typography: {
        button: {
          textTransform: "none",
        },
      },
      palette: {
        type: "dark",
        primary: {
          main: "#002855",
        },
        secondary: {
          main: "#3f9c35",
        },
        background: {
          default: "#262a3a ",
          paper: "#eaeaea",
        },
        tertiary: {
          main: "#f4f5f7",
        },
      },
    }),
  };
  static contextType = AuthContext;

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <ToastContainer position="top-center" theme="dark" />
        <ThemeProvider theme={this.state.theme}>
          <CssBaseline>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route
                  path="/"
                  element={this.context.session ? <Home></Home> : <Login />}
                />
                <Route
                  path="/home"
                  element={
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/apex-generator"
                  element={
                    <RequireAuth>
                      <ApexGenerator />
                    </RequireAuth>
                  }
                />
                <Route path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </CssBaseline>
        </ThemeProvider>
      </React.Fragment>
    );
  }
}
