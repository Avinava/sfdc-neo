import * as React from "react";
import axios from "axios";
import { toast } from "react-toastify";

class APIService extends React.Component {
  context;
  state = {};
  constructor(props) {
    super(props);
    this.context = props.context;
  }

  getApexClasses() {
    return this.requestHandler("get", "/api/v1/salesforce/apexclass");
  }

  generateTest(cls) {
    return this.requestHandler("post", "/api/v1/generator/apexclass/test", cls);
  }

  generateCodeDocumentation(cls) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/apexclass/documentation",
      cls
    );
  }

  generateDocumentation(cls) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/apexclass/documentation",
      cls
    );
  }

  requestHandler = async (method, url, data) => {
    console.log("requestHandler", method, url);
    return axios({
      method,
      url,
      data,
    })
      .then((response) => {
        console.log(response);
        this.context.setRemainingQuota(response.headers["x-quota-remaining"]);
        return response.data;
      })
      .catch((err) => {
        this.handleError(err);
        throw err;
      });
  };

  handleError(error) {
    console.error(error);
    toast.error(error.response.data.message);
  }
  render() {
    return <React.Fragment></React.Fragment>;
  }
}

export default APIService;
