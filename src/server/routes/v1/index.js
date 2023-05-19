import express from "express";
import authRoutes from "./auth.route.js";
import generatorRoutes from "./generator.route.js";
import salesforceRoutes from "./salesforce.route.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/generator", generatorRoutes);
router.use("/salesforce", salesforceRoutes);

export default router;
