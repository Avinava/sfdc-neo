import express from "express";
import passport from "./../../services/passport.strategy.js";

const router = express.Router();

router.get("/production", passport.authenticate("forcedotcom"), console.log);
router.get(
  "/sandbox",
  passport.authenticate("forcedotcom-sandbox", {
    state: "sandbox",
  }),
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

export default router;
