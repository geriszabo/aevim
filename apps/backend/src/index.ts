import { Hono } from "hono";
import auth from "./routes/auth";
import { jwt } from "hono/jwt";
import workouts from "./routes/workouts";
import { logger } from "hono/logger";
import env from "./env";

const app = new Hono();

app
  .use(
    "api/v1/auth/*",
    jwt({ secret: env.JWT_SECRET , cookie: "authToken" })
  )
  .route("api/v1", auth)
  .route("api/v1/auth", workouts);

export default {
  port: env.PORT || 3000,
  fetch: app.fetch,
};
