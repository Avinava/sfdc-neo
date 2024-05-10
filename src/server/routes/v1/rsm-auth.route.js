import express from "express";
import passport from "../../services/passport/rsm.passport.js";

const router = express.Router();

router.get("/production", passport.authenticate("forcedotcom"));

router.get("/community", passport.authenticate("forcedotcom-community"));

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.send({ success: true });
  });
});

router.get(
  "/callback",
  passport.authenticate("forcedotcom", { failureRedirect: "/error" }),
  async (req, res) => {
    res.redirect("/");
  }
);

router.get("/session", async (req, res) => {
  // deep clone the user object
  const user = JSON.parse(
    JSON.stringify(req.user || req.session?.passport?.user || {})
  );

  delete user.oauth;
  user.raw = user._raw;
  delete user._raw;
  if (process.env.ENABLE_QUOTA === "true" && req.session?.passport?.user) {
    //  user.metrics = await usage.getMetrics(user.id);
  }

  user.org = req.session?.org;

  user.gaMeasurementId = process.env.GA_MEASUREMENT_ID;

  res.send(user);
});

export default router;
