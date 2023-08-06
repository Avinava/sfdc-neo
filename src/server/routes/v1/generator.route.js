import express from "express";
import codeReviewer from "../../agents/codeReviewer.js";
import codeReviewerPMD from "../../agents/codeReviewerPMD.js";
import codeRefactoring from "../../agents/codeRefactoring.js";
import codeDocumenter from "../../agents/codeDocumenter.js";
import codeComments from "../../agents/codeComments.js";
import unitTestsWriter from "../../agents/unitTestsWriter.js";
import emailTemplate from "../../agents/emailTemplate.js";
import validationRule from "../../agents/validationRule.js";
import tokenHelperService from "../../services/tokenHelperService.js";
import flowTestWriter from "../../agents/flowTestWriter.js";
import flowDocumenter from "../../agents/flowDocumenter.js";

import * as dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const MAX_TOKEN_ERROR =
  "Max token length exceeded. Please select a smaller file.";

router.post(
  [
    "/apexclass/test",
    "/apexclass/codecomments",
    "/apexclass/documentation",
    "/apexclass/codereview",
    "/apexclass/codereviewpmd",
    "/apexclass/coderefactor",
    "/emailtemplate/beautify",
    "/validationrule/description",
    "/flow/documentation",
    "/flow/test",
  ],
  async (req, res) => {
    await handleRequest(req, res);
  }
);

async function generate(req) {
  let textResponse = "";
  if (req.path === "/apexclass/test") {
    // inject required fields info for better tests data generation
    req.body.requiredMetadata = await req.salesforce.getRequiredSObjectMetadata(
      req.body.Body
    );

    textResponse = await unitTestsWriter.generate(req.body);
  } else if (req.path === "/apexclass/codecomments") {
    textResponse = await codeComments.generate(req.body);
  } else if (req.path === "/apexclass/documentation") {
    textResponse = await codeDocumenter.generate(req.body);
  } else if (req.path === "/apexclass/codereview") {
    textResponse = await codeReviewer.generate(req.body);
  } else if (req.path === "/apexclass/codereviewpmd") {
    textResponse = await codeReviewerPMD.generate(req.body);
  } else if (req.path === "/apexclass/coderefactor") {
    textResponse = await codeRefactoring.generate(req.body);
  } else if (req.path === "/emailtemplate/beautify") {
    textResponse = await emailTemplate.generate(req.body);
  } else if (req.path === "/validationrule/description") {
    textResponse = await validationRule.generate(req.body);
  } else if (req.path === "/flow/documentation") {
    textResponse = await flowDocumenter.generate(req.body);
  } else if (req.path === "/flow/test") {
    textResponse = await flowTestWriter.generate(req.body);
  }

  return textResponse;
}

function validateTokenLength(req, res) {
  const codeEndpoints = [
    "/apexclass/test",
    "/apexclass/codecomments",
    "/apexclass/documentation",
    "/apexclass/codereview",
    "/apexclass/coderefactor",
    "/flow/documentation",
    "/flow/test",
  ];

  if (
    codeEndpoints.includes(req.path) &&
    tokenHelperService.getTokenCount(req.body.Body || req.body.Metadata)
      .limitExceeded
  ) {
    const err = new Error(MAX_TOKEN_ERROR);
    throw err;
  } else if (
    req.path === "/emailtemplate/beautify" &&
    tokenHelperService.getTokenCount(req.body.HtmlValue).limitExceeded
  ) {
    const err = new Error(MAX_TOKEN_ERROR);
    throw err;
  } else if (
    req.path === "/validationrule/description" &&
    tokenHelperService.getTokenCount(req.body?.Metadata?.errorConditionFormula)
      .limitExceeded
  ) {
    const err = new Error(MAX_TOKEN_ERROR);
    throw err;
  }
}

async function handleRequest(req, res) {
  try {
    validateTokenLength(req, res);
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
    message: exception.response?.data?.error?.message || exception.message,
  });
}

export default router;
