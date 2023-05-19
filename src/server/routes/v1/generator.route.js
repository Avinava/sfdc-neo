import express from "express";
import openai from "../../services/openai.js";

const router = express.Router();

router.get("/generate", async (req, res) => {
  res.send({ success: true, user: req.session.passport.user.oauth });
});

router.post("/apexclass/test", async (req, res) => {
  const cls = req.body;
  const aires = await openai.getTestClassCompletion(cls);
  const textResponse = aires.data.choices[0].message;

  res.send({
    success: true,
    result: textResponse.content,
  });
});

export default router;
