import { Hono } from "hono";
import auth from "./routes/auth";
import { jwt } from "hono/jwt";
import workouts from "./routes/workouts";
import env from "./env";
import exercises from "./routes/exercises";
import sets from "./routes/sets";

const app = new Hono();

app
  .use("api/v1/auth/*", jwt({ secret: env.JWT_SECRET, cookie: "authToken" }))
  .route("api/v1", auth)
  .route("api/v1/auth", workouts)
  .route("api/v1/auth", exercises)
  .route("api/v1/auth", sets);

export default {
  port: env.PORT || 3000,
  fetch: app.fetch,
};
