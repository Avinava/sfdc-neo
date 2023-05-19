import express from "express";
import passport from "./../../services/passport.strategy.js";

const router = express.Router();

router.get("/production", passport.authenticate("forcedotcom"), console.log);
router.get(
  "/sandbox",
  passport.authenticate("forcedotcom-sandbox"),
  console.log
);

router.post("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send({ success: true });
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

router.get("/session", (req, res) => {
  // deep clone the user object
  const user = JSON.parse(
    JSON.stringify(req.user || req.session.passport.user || {})
  );
  delete user.oauth;
  delete user._raw;
  res.send(user);
});

export default router;
