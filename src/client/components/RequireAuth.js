import React from "react";
import AuthContext from "./AuthContext";
import { Login } from "@mui/icons-material";

export default class RequireAuth extends React.Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        {this.context.session ? this.props.children : <Login></Login>}
      </React.Fragment>
    );
  }
}
