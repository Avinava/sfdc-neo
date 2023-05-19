import express from "express";
import openai from "../../services/openai.js";

const router = express.Router();

router.get("/generate", async (req, res) => {
  res.send({ success: true, user: req.session.passport.user.oauth });
});

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

router.post("/apexclass/codedocumentation", async (req, res) => {
  const cls = req.body;
  const aires = await openai.getCodeDocumentationCompletion(cls);
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

export default router;
