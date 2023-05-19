import * as dotenv from "dotenv";
import session from "express-session";
import path from "path";
import { default as cors, default as express } from "express";
import { errors } from "celebrate";
import { createClient } from "redis";
import RedisStore from "connect-redis";
import routes from "./routes/v1";

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
app.use("/api/v1", routes);
app.use(errors());

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: redisStore,
});

app.use(sessionMiddleware);

// need this for react router to work
app.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
