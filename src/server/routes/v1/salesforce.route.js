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

router.get("/test/factory-def", async (req, res) => {
  try {
    res.send(
      await req.salesforce.getTestFactoryDefinition(
        req.salesforce,
        req.query.force === "true"
      )
    );
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

router.post("/tooling/:entity", async (req, res) => {
  try {
    const result = await req.salesforce.toolingUpdate(
      req.params.entity,
      req.body
    );
    res.send(result);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing your request." });
  }
});

export default router;
