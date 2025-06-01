import { Hono } from "hono";
import auth from "./routes/auth";
import { jwt } from "hono/jwt";
import workouts from "./routes/workouts";

const app = new Hono();

app
  .use(
    "api/v1/auth/*",
    jwt({ secret: process.env.JWT_SECRET!, cookie: "authToken" })
  )
  .route("api/v1", auth)
  .route("api/v1/auth", workouts);

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};
