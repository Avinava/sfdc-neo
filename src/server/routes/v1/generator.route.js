import express from "express";
import codeReviewer from "../../agents/codeReviewer.js";
import codeRefactoring from "../../agents/codeRefactoring.js";
import codeDocumenter from "../../agents/codeDocumenter.js";
import codeComments from "../../agents/codeComments.js";
import unitTestsWriter from "../../agents/unitTestsWriter.js";
import emailTemplate from "../../agents/emailTemplate.js";
import validationRule from "../../agents/validationRule.js";

const router = express.Router();

router.post(
  [
    "/apexclass/test",
    "/apexclass/codecomments",
    "/apexclass/documentation",
    "/apexclass/codereview",
    "/apexclass/coderefactor",
    "/emailtemplate/beautify",
    "/validationrule/description",
  ],
  async (req, res) => {
    await handleRequest(req, res);
  }
);

async function generate(req) {
  let textResponse = "";
  if (req.path === "/apexclass/test") {
    textResponse = await unitTestsWriter.generate(req.body.Body);
  } else if (req.path === "/apexclass/codecomments") {
    textResponse = await codeComments.generate(req.body.Body);
  } else if (req.path === "/apexclass/documentation") {
    textResponse = await codeDocumenter.generate(req.body.Body);
  } else if (req.path === "/apexclass/codereview") {
    textResponse = await codeReviewer.generate(req.body.Body);
  } else if (req.path === "/apexclass/coderefactor") {
    textResponse = await codeRefactoring.generate(req.body.Body);
  } else if (req.path === "/emailtemplate/beautify") {
    textResponse = await emailTemplate.generate(req.body);
  } else if (req.path === "/validationrule/description") {
    textResponse = await validationRule.generate(req.body);
  }

  return textResponse;
}

async function handleRequest(req, res) {
  try {
    const result = await generate(req);
    res.send({
      success: true,
      result: result,
    });
  } catch (exception) {
    handleException(res, exception);
  }
}

function handleException(res, exception) {
  res.status(500).send({
    success: false,
    message: exception.message,
  });
}

export default router;
