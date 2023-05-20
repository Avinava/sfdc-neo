import * as dotenv from "dotenv";
import session from "express-session";
import path from "path";
import { default as cors, default as express } from "express";
import { errors } from "celebrate";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import routes from "./routes/v1/index.js";
import usage from "./services/usage.js";
const METERED_ENDPOINTS = ["generator"];

dotenv.config();

const redisClient = createClient();
redisClient.connect().catch(console.error);

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: "myapp:",
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(errors());

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: redisStore,
});

app.use(sessionMiddleware);

app.use(async function (req, res, next) {
  console.info("ℹ️ ", new Date().toISOString(), ":", req.path);

  if (METERED_ENDPOINTS.includes(req.path.split("/")[3].toLowerCase())) {
    // if its a metered endpoint, check if user is authenticated
    if (req.session && req.session.passport && req.session.passport.user) {
      if (process.env.ENABLE_QUOTA === "true") {
        console.log("Quota is enabled");
        let metrics = await usage.getMetrics(req.session.passport.user.id);
        req.session.passport.user.metrics = metrics;
        req.session.save();

        // check if user has remaining quota
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
        req.headers["x-quota-remaining"] = metrics.remainingQuota;
        req.headers["x-quota-limit"] = metrics.dailyQuota;
      }
    } else {
      return res.status(401).send({
        message: "You are not logged in.",
      });
    }
  }

  next();
});

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000");
});
// need this for react router to work
app.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
