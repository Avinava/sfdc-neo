import express from "express";
import oauthRoutes from "./oauth.route.js";
import generatorRoutes from "./generator.route.js";
import salesforceRoutes from "./salesforce.route.js";
import prettierRoutes from "./prettier.route.js";
import utilRoutes from "./util.route.js";
import rsmAuthRoutes from "./rsm-auth.route.js";

const router = express.Router();
router.use("/oauth", oauthRoutes);
router.use("/generator", generatorRoutes);
router.use("/salesforce", salesforceRoutes);
router.use("/prettier", prettierRoutes);
router.use("/util", utilRoutes);
router.use("/rsm-auth", rsmAuthRoutes);

export default router;
