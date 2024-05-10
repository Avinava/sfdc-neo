import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./app.css";
import AuthContext from "./components/AuthContext";
import Header from "./components/Header";
import Login from "./pages/Login";
import Home from "./pages/Home";
import RequireAuth from "./components/RequireAuth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppPage from "./pages/App";
import ApexGenerator from "./pages/ApexGenerator";
import EmailTemplateGenerator from "./pages/EmailTemplateGenerator";
import ValidationRuleGenerator from "./pages/ValidationRuleGenerator";
import FlowGenerator from "./pages/FlowGenerator";

export default class App extends React.Component {
  state = {};
  static contextType = AuthContext;

  componentDidMount() {}

  render() {
    return (
      <React.Fragment>
        <ToastContainer position="top-center" theme="dark" />
        <BrowserRouter>
          <Header />
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
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
                path="/app"
                element={
                  <RequireAuth>
                    <AppPage />
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
              <Route
                path="/email-generator"
                element={
                  <RequireAuth>
                    <EmailTemplateGenerator />
                  </RequireAuth>
                }
              />
              <Route
                path="/validation-rule-generator"
                element={
                  <RequireAuth>
                    <ValidationRuleGenerator />
                  </RequireAuth>
                }
              />
              <Route
                path="/flow-generator"
                element={
                  <RequireAuth>
                    <FlowGenerator />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}
