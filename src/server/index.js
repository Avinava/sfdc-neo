import * as dotenv from "dotenv";
import session from "express-session";
import path from "path";
import { default as cors, default as express } from "express";
import { errors } from "celebrate";
import { createClient } from "redis";
import errorHandler from "strong-error-handler";
import RedisStore from "connect-redis";
import routes from "./routes/v1/index.js";
import meteredMiddleware from "./middleware/metered.js";
import authMiddleware from "./middleware/authentication.js";
import sfMiddleware from "./middleware/salesforceSession.js";

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

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: redisStore,
  })
);
app.use(meteredMiddleware.handle);
app.use(authMiddleware.handle);
app.use(sfMiddleware.handle);

app.use(
  errorHandler({
    debug: process.env.PRODUCTION === "false" ? true : false,
    log: true,
  })
);

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.redirect("http://localhost:3000");
});
// need this for react router to work
app.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
