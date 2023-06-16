import express from "express";

const router = express.Router();

router.get("/apexclass", async (req, res) => {
  res.send(await req.salesforce.getApexClasses());
});

router.get("/emailtemplate", async (req, res) => {
  res.send(await req.salesforce.getEmailTemplates());
});

router.get("/validationrule", async (req, res) => {
  res.send(await req.salesforce.getValidationRules());
});

router.get("/validationrule/:id", async (req, res) => {
  res.send(await req.salesforce.getValidationRuleMetadata(req.params.id));
});

router.get("/flowdefinitions", async (req, res) => {
  res.send(await req.salesforce.getFlowDefinitions(req.body));
});

router.get("/flowdefinition/:id", async (req, res) => {
  res.send(await req.salesforce.getFlowDefinitionMetadata(req.params.id));
});

router.post("/deployclass", async (req, res) => {
  res.send(await req.salesforce.deployClass(req.body));
});

router.get("/deployclass/:id", async (req, res) => {
  res.send(await req.salesforce.checkDeployStatus(req.params.id, true));
});

export default router;
