import express from "express";
import authRoutes from "./auth.route.js";
import generatorRoutes from "./generator.route.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/generator", generatorRoutes);

export default router;
