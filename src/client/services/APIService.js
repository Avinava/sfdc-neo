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

  getRecordDetail(objectName, recordId, fields, tooling = false) {
    const fieldsStr = fields ? fields.join(",") : "";
    return this.requestHandler(
      "get",
      `/api/v1/salesforce/record/${objectName}/${recordId}?fields=${fieldsStr}&tooling=${tooling}`
    );
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

  getFlowDefinitions() {
    return this.requestHandler("get", "/api/v1/salesforce/flowdefinitions");
  }

  getFlowDefinition(id) {
    return this.requestHandler(
      "get",
      `/api/v1/salesforce/flowdefinition/${id}`
    );
  }

  getEmailTemplates() {
    return this.requestHandler("get", "/api/v1/salesforce/emailtemplate");
  }

  getApexClasses() {
    return this.requestHandler("get", "/api/v1/salesforce/apexclass");
  }

  getTestFactoryDefinition(force = false) {
    return this.requestHandler(
      "get",
      `/api/v1/salesforce/test/factory-def?force=${force}`
    );
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

  generateCodeReviewPMD(cls) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/apexclass/codereviewpmd",
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

  generateValidationRuleReview(rule) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/validationrule/review",
      rule
    );
  }

  generateFlowDocumentation(flow) {
    return this.requestHandler(
      "post",
      "/api/v1/generator/flow/documentation",
      flow
    );
  }

  generateFlowTest(flow) {
    return this.requestHandler("post", "/api/v1/generator/flow/test", flow);
  }

  formatApex(cls) {
    return this.requestHandler("post", "/api/v1/prettier/apex", cls);
  }

  toolingUpdate(entity, body) {
    return this.requestHandler(
      "post",
      `/api/v1/salesforce/tooling/${entity}`,
      body
    );
  }

  /**
   *
   * @param {*} object {Body: string}
   * @returns
   */
  getTokenCount(input) {
    return this.requestHandler("post", "/api/v1/util/tokencount", input);
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
