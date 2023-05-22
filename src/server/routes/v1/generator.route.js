import express from "express";
import openai from "../../services/openai.js";

const router = express.Router();

//refactor

router.post("/apexclass/test", async (req, res) => {
  const cls = req.body;
  const aires = await openai.getTestClassCompletion(cls);
  const textResponse = aires.data.choices[0].message;

  res.send({
    success: true,
    result: textResponse.content,
  });
});

router.post("/apexclass/codecomments", async (req, res) => {
  const cls = req.body;
  const aires = await openai.generateCodeComments(cls);
  const textResponse = aires.data.choices[0].message;
  res.send({
    success: true,
    result: textResponse.content,
  });
});

router.post("/apexclass/documentation", async (req, res) => {
  const cls = req.body;
  const aires = await openai.getDocumentationCompletion(cls);
  const textResponse = aires.data.choices[0].message;
  res.send({
    success: true,
    result: textResponse.content,
  });
});

router.post("/apexclass/codereview", async (req, res) => {
  const cls = req.body;
  const aires = await openai.getCodeReviewCompletion(cls);
  const textResponse = aires.data.choices[0].message;
  res.send({
    success: true,
    result: textResponse.content,
  });
});

export default router;
