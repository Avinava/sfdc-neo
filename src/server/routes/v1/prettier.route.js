import express from "express";
import prettier from "../../services/prettier.js";
const router = express.Router();

router.post("/apex", async (req, res) => {
  try {
    const result = prettier.formatApex(req.body.Body);
    res.send({
      success: true,
      result: result,
    });
  } catch (exception) {
    handleException(res, exception);
  }
});

function handleException(res, exception) {
  console.error(exception);
  res.status(500).send({
    success: false,
    message: exception.message,
  });
}

export default router;
