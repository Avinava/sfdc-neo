import React, { Component } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";

export default class AuthProvider extends Component {
  constructor(props) {
    super(props);
    console.log("constructing", this.props.children);
    this.state = {
      session: null,
      avatar: null,
      identity: null,
      ready: false,
    };
  }

  componentDidMount() {
    axios.get("/api/v1/auth/session").then((res) => {
      console.log(res.data);
      this.setState({ session: res.data });
      this.setState({ ready: true });
    });
  }

  render() {
    return (
      <React.Fragment>
        {this.state.ready && (
          <AuthContext.Provider value={{ ...this.state }}>
            {this.props.children}
          </AuthContext.Provider>
        )}
      </React.Fragment>
    );
  }
}
