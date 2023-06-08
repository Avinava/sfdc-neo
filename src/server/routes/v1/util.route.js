import express from "express";
import * as dotenv from "dotenv";
import tokenHelperService from "../../services/tokenHelperService.js";

dotenv.config();

const router = express.Router();

router.post("/tokencount", async (req, res) => {
  try {
    const result = tokenHelperService.countTokens(req.body.Body);
    res.send({
      success: true,
      result: result,
      limit: Number(process.env.OPENAI_MAX_TOKENS || 3000),
      limitExceeded: result > Number(process.env.OPENAI_MAX_TOKENS || 3000),
    });
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
