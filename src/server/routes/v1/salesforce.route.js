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
    res.send(await salesforce.getApexClasses());
  }
});

router.post("/deployclass", async (req, res) => {
  const salesforce = new Salesforce(req.session);
  if (!salesforce.isVaild()) {
    return res.status(401).send({
      message: "You are not logged in.",
    });
  } else {
    res.send(await salesforce.deployClass(req.body));
  }
});

router.get("/deployclass/:id", async (req, res) => {
  const salesforce = new Salesforce(req.session);
  if (!salesforce.isVaild()) {
    return res.status(401).send({
      message: "You are not logged in.",
    });
  } else {
    res.send(await salesforce.checkDeployStatus(req.params.id, true));
  }
});

export default router;
