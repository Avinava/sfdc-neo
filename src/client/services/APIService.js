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

  getValidationRules() {
    return this.requestHandler("get", "/api/v1/salesforce/validationrule");
  }

  getValidationRule(id) {
    return this.requestHandler(
      "get",
      `/api/v1/salesforce/validationrule/${id}`
    );
  }

  getEmailTemplates() {
    return this.requestHandler("get", "/api/v1/salesforce/emailtemplate");
  }

  getApexClasses() {
    return this.requestHandler("get", "/api/v1/salesforce/apexclass");
  }

  generateTest(cls) {
    return this.requestHandler("post", "/api/v1/generator/apexclass/test", cls);
  }

  deployClass(cls) {
    return this.requestHandler("post", "/api/v1/salesforce/deployclass", cls);
  }

  getDeployStatus(id) {
    return this.requestHandler("get", `/api/v1/salesforce/deployclass/${id}`);
  }

  generateCodeComments(cls) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/apexclass/codecomments",
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

  generateCodeReview(cls) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/apexclass/codereview",
      cls
    );
  }

  generateCodeRefactor(cls) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/apexclass/coderefactor",
      cls
    );
  }

  generateEmailTemplate(template) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/emailtemplate/beautify",
      template
    );
  }

  generateValidationRuleDesc(rule) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/validationrule/description",
      rule
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
