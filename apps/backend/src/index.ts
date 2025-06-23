import { Hono } from "hono";
import auth from "./routes/auth";
import { jwt } from "hono/jwt";
import workouts from "./routes/workouts";
import env from "./env";
import exercises from "./routes/exercises";
import { cors } from "hono/cors";
const app = new Hono();

app
  .use(
    "*",
    cors({
      origin: env.FRONTEND_BASE_UR,
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use("api/v1/auth/*", jwt({ secret: env.JWT_SECRET, cookie: "authToken" }))
  .route("api/v1", auth)
  .route("api/v1/auth", workouts)
  .route("api/v1/auth", exercises);

export default {
  port: env.PORT || 3000,
  fetch: app.fetch,
};
