import express from "express";
import Salesforce from "../../services/salesforce.js";

const router = express.Router();

router.get("/apexclass", async (req, res) => {
  const salesforce = new Salesforce(req.session);
  const apexClasses = await salesforce.getApexClasses();
  res.send(apexClasses.records);
});

export default router;
