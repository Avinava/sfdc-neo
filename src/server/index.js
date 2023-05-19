import * as dotenv from "dotenv";
import session from "express-session";
import path from "path";
import { default as cors, default as express } from "express";
import { errors } from "celebrate";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import routes from "./routes/v1/index.js";
import usage from "./services/usage.js";

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
  // check if user is authenticated
  if (req.session && req.session.passport && req.session.passport.user) {
    const metrics = await usage.getMetrics(req.session.passport.user.id);
    req.session.passport.user.metrics = metrics;
    req.session.save();
    next();
  }
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
