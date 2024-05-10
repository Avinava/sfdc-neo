import React, { Component } from "react";
import AuthContext from "./AuthContext";
import axios from "axios";
import ReactGA from "react-ga4";

export default class AuthProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session: null,
      avatar: null,
      identity: null,
      ready: false,
      metrics: null,
      gaMeasurementId: null,
      setMetrics: () => {},
      setRemainingQuota: () => {},
    };
  }

  setMetrics = (metrics) => {
    this.setState({ metrics });
  };

  setRemainingQuota = (remaining) => {
    if (remaining) {
      this.state.metrics.remainingQuota = remaining;
      this.setState({ metrics: this.state.metrics });
    }
  };

  componentDidMount() {
    this.state.setMetrics = this.setMetrics.bind(this);
    this.state.setRemainingQuota = this.setRemainingQuota.bind(this);
    axios.get("/api/v1/rsm-auth/session").then((res) => {
      let state = {
        ready: true,
        session: null,
        metrics: null,
        gaMeasurementId: null,
      };
      console.log(res.data);
      if (res.data) {
        const gaMeasurementId = res.data.gaMeasurementId;
        delete res.data.gaMeasurementId;
        state = {
          session:
            !res.data || Object.keys(res.data).length === 0 ? null : res.data,
          ready: true,
          metrics: res.data.metrics,
          gaMeasurementId,
        };
        if (gaMeasurementId) {
          ReactGA.initialize(gaMeasurementId);
        }
      }
      this.setState(state);
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
