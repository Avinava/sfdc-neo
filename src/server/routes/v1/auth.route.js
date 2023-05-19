import express from "express";
import passport from "./../../services/passport.strategy";

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

export default router;
