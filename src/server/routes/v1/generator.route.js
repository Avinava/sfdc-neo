import express from "express";

const router = express.Router();

router.get("/generate", async (req, res) => {
  res.send({ success: true });
});

export default router;
