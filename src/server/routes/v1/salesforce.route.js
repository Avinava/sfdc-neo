import express from "express";
import Salesforce from "../../services/salesforce.js";

const router = express.Router();

router.get("/apexclass", async (req, res) => {
  const salesforce = new Salesforce(req.session);
  if (!salesforce.isVaild()) {
    return res.status(401).send({
      message: "You are not logged in.",
    });
  } else {
    const apexClasses = await salesforce.getApexClasses();
    res.send(apexClasses.records);
  }
});

export default router;
