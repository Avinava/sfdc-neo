import express from "express";
import * as dotenv from "dotenv";
import tokenHelperService from "../../services/tokenHelperService.js";

dotenv.config();

const router = express.Router();

router.post("/tokencount", async (req, res) => {
  try {
    res.send(tokenHelperService.getTokenCount(req.body.Body));
  } catch (exception) {
    handleException(res, exception);
  }
});

function handleException(res, exception) {
  res.status(500).send({
    success: false,
    message: exception.message,
  });
}

export default router;
