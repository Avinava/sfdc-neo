import express from "express";
import codeReviewer from "../../agents/codeReviewer.js";
import codeDocumenter from "../../agents/codeDocumenter.js";
import codeComments from "../../agents/codeComments.js";
import unitTestsWriter from "../../agents/unitTestsWriter.js";
import emailTemplate from "../../agents/emailTemplate.js";
import validationRule from "../../agents/validationRule.js";

const router = express.Router();

router.post("/apexclass/test", async (req, res) => {
  const textResponse = await unitTestsWriter.generate(req.body.Body);
  res.send({
    success: true,
    result: textResponse,
  });
});

router.post("/apexclass/codecomments", async (req, res) => {
  const textResponse = await codeComments.generate(req.body.Body);
  res.send({
    success: true,
    result: textResponse,
  });
});

router.post("/apexclass/documentation", async (req, res) => {
  const textResponse = await codeDocumenter.generate(req.body.Body);
  res.send({
    success: true,
    result: textResponse,
  });
});

router.post("/apexclass/codereview", async (req, res) => {
  const textResponse = await codeReviewer.generate(req.body.Body);
  res.send({
    success: true,
    result: textResponse,
  });
});

router.post("/emailtemplate/beautify", async (req, res) => {
  const textResponse = await emailTemplate.generate(req.body);
  res.send({
    success: true,
    result: textResponse,
  });
});

router.post("/validationrule/description", async (req, res) => {
  res.send({
    success: true,
    result: validationRule.generate(req.body),
  });
});

export default router;
