import express from "express";
import Salesforce from "../../services/salesforce.js";

const router = express.Router();

router.get("/apexclass", async (req, res) => {
  const salesforce = getSalesforceConnection(req, res);
  if (salesforce) {
    res.send(await salesforce.getApexClasses());
  }
});

router.get("/emailtemplate", async (req, res) => {
  const salesforce = getSalesforceConnection(req, res);
  if (salesforce) {
    res.send(await salesforce.getEmailTemplates());
  }
});

router.get("/validationrule", async (req, res) => {
  const salesforce = getSalesforceConnection(req, res);
  if (salesforce) {
    res.send(await salesforce.getValidationRules());
  }
});

router.get("/validationrule/:id", async (req, res) => {
  const salesforce = getSalesforceConnection(req, res);
  if (salesforce) {
    res.send(await salesforce.getValidationRuleMetadata(req.params.id));
  }
});

router.post("/deployclass", async (req, res) => {
  const salesforce = getSalesforceConnection(req, res);
  if (salesforce) {
    res.send(await salesforce.deployClass(req.body));
  }
});

router.get("/deployclass/:id", async (req, res) => {
  const salesforce = getSalesforceConnection(req, res);
  if (salesforce) {
    res.send(await salesforce.checkDeployStatus(req.params.id, true));
  }
});

function getSalesforceConnection(req, res) {
  let salesforce;
  try {
    salesforce = new Salesforce(req.session);
    if (!salesforce.isVaild()) {
      salesforce = null;
      return res.status(401).send({
        message: "You are not logged in.",
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

export default router;
