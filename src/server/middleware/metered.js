import * as dotenv from "dotenv";
import usage from "../services/usage.js";
const METERED_ENDPOINTS = ["/api/v1/generator/"];

dotenv.config();

class Metered {
  constructor() {
    this.handle = this.handle.bind(this); // Bind the context of 'handle' method to the 'Metered' class
  }

  async handle(req, res, next) {
    console.info("ℹ️ ", new Date().toISOString(), ":", req.path);
    if (this.isMeteredEndpoint(req.path)) {
      // if it's a metered endpoint, check if the user is authenticated
      if (req.session && req.session.passport && req.session.passport.user) {
        if (process.env.ENABLE_QUOTA === "true") {
          console.log("Quota is enabled");
          let metrics = await usage.getMetrics(req.session.passport.user.id);
          req.session.passport.user.metrics = metrics;
          req.session.save();

          // check if the user has remaining quota
          if (req.session.passport.user.metrics.remainingQuota <= 0) {
            return res.status(429).send({
              message:
                "You have exceeded your daily quota. Please try again tomorrow.",
            });
          }

          // increment usage
          await usage.incrementUsage(req.session.passport.user.id);
          // update metrics
          metrics = req.session.passport.user.metrics;
          metrics.remainingQuota = metrics.remainingQuota - 1;
          req.session.passport.user.metrics = metrics;
          req.session.save();

          res.set("x-quota-remaining", metrics.remainingQuota);
          res.set("x-quota-limit", metrics.dailyQuota);
        }
      } else {
        return res.status(401).send({
          message: "You are not logged in.",
        });
      }
    }

    next();
  }

  isMeteredEndpoint(path) {
    let isMetered = false;
    METERED_ENDPOINTS.forEach((endpoint) => {
      if (path.startsWith(endpoint)) {
        isMetered = true;
      }
    });
    return isMetered;
  }
}

export default new Metered();
