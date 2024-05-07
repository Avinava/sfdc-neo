import express from "express";
import * as dotenv from "dotenv";
import YAML from "../../services/yamlParser.js";
import tokenHelperService from "../../services/tokenHelperService.js";

import {
  codeReviewerPMD,
  codeRefactoring,
  codeDocumenter,
  codeComments,
  unitTestsWriter,
  emailTemplate,
  validationRule,
  flowTestWriter,
  flowDocumenter,
} from "../../prompts/index.js";

dotenv.config();

const router = express.Router();
const MAX_TOKEN_ERROR =
  "Max token length exceeded. Please select a smaller file.";

const endpoints = [
  "/apexclass/test",
  "/apexclass/codecomments",
  "/apexclass/documentation",
  "/apexclass/codereviewpmd",
  "/apexclass/coderefactor",
  "/emailtemplate/beautify",
  "/validationrule/review",
  "/flow/documentation",
  "/flow/test",
];

router.post(endpoints, handleRequest);

async function handleRequest(req, res) {
  try {
    validateTokenLength(req);
    const result = await generate(req);
    res.send({ success: true, ...result });
  } catch (exception) {
    handleException(res, exception);
  }
}

async function generate(req) {
  const generators = {
    "/apexclass/test": {
      generate: async (body) => {
        // inject required fields info for better tests data generation
        body.requiredMetadata = YAML.stringify(
          await req.salesforce.getRequiredSObjectMetadata(body)
        );
        if (body.factoryDef) {
          try {
            body.testFactoryDef = YAML.stringify(body.factoryDef);
          } catch (error) {}
        }
        return await unitTestsWriter.generate(body);
      },
    },
    "/apexclass/codecomments": codeComments,
    "/apexclass/documentation": codeDocumenter,
    "/apexclass/codereviewpmd": codeReviewerPMD,
    "/apexclass/coderefactor": codeRefactoring,
    "/emailtemplate/beautify": emailTemplate,
    "/validationrule/review": validationRule,
    "/flow/documentation": flowDocumenter,
    "/flow/test": flowTestWriter,
  };

  const generator = generators[req.path];
  return generator ? await generator.generate(req.body) : "";
}

function validateTokenLength(req) {
  const codeEndpoints = [
    "/apexclass/test",
    "/apexclass/codecomments",
    "/apexclass/documentation",
    "/apexclass/codereview",
    "/apexclass/coderefactor",
    "/flow/documentation",
    "/flow/test",
  ];

  const tokenCount = tokenHelperService.getTokenCount(
    req.body?.Metadata?.errorConditionFormula ||
      req.body.Metadata ||
      req.body.HtmlValue ||
      req.body.Body
  );

  if (codeEndpoints.includes(req.path) && tokenCount.limitExceeded) {
    throw new Error(MAX_TOKEN_ERROR);
  }
}

function handleException(res, exception) {
  res.status(500).send({
    success: false,
    message: exception.response?.data?.error?.message || exception.message,
  });
}

export default router;
