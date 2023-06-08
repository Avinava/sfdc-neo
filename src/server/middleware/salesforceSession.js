import Salesforce from "../services/salesforce.js";
const SALESFORCE_ENDPOINTS = ["/api/v1/salesforce/"];

class SalesforceSession {
  constructor() {
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
    if (this.isSalesforceEndpoint(req.path)) {
      const salesforce = this.getSalesforceSession(req, res);
      if (salesforce) {
        // set variable so that it can be used later on
        req.salesforce = salesforce;
        next();
      }
    } else {
      next();
    }
  }

  getSalesforceSession(req, res) {
    let salesforce;
    try {
      salesforce = new Salesforce(req.session);
      if (!salesforce.isVaild() || !salesforce.isSessionValid()) {
        salesforce = null;
        return res.status(401).send({
          message: "Your Salesforce session has expired. Please login again.",
        });
      }
    } catch (exception) {
      res.status(500).send({
        success: false,
        message: exception.message,
      });
    }
    return salesforce;
  }

  isSalesforceEndpoint(path) {
    let isSalesforce = false;
    SALESFORCE_ENDPOINTS.forEach((endpoint) => {
      if (path.startsWith(endpoint)) {
        isSalesforce = true;
      }
    });
    return isSalesforce;
  }
}

export default new SalesforceSession();
