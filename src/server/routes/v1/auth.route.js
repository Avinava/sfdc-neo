import express from "express";
import passport from "./../../services/passport.strategy.js";
import usage from "../../services/usage.js";

const router = express.Router();

router.get("/production", passport.authenticate("forcedotcom"), console.log);
router.get(
  "/sandbox",
  passport.authenticate("forcedotcom-sandbox"),
  console.log
);

router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/");
  });
});

router.get(
  "/callback",
  passport.authenticate("forcedotcom", { failureRedirect: "/error" }),
  async (req, res) => {
    res.redirect("/home");
  }
);

router.get(
  "/callback-sandbox",
  passport.authenticate("forcedotcom-sandbox", { failureRedirect: "/error" }),
  async (req, res) => {
    res.redirect("/home");
  }
);

router.get("/session", async (req, res) => {
  // deep clone the user object
  const user = JSON.parse(
    JSON.stringify(req.user || req.session?.passport?.user || {})
  );

  delete user.oauth;
  user.org = user._raw;
  delete user._raw;
  if (process.env.ENABLE_QUOTA === "true") {
    user.metrics = await usage.getMetrics(user.id);
  }

  res.send(user);
});

export default router;
