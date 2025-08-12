import { Hono } from "hono";
import auth from "./routes/auth";
import workouts from "./routes/workouts";
import env from "./env";
import exercises from "./routes/exercises";
import { cors } from "hono/cors";
import { authMiddleware } from "./middleware/auth";
import completeWorkouts from "./routes/completeWorkouts";
const app = new Hono();

app
  .use(
    "*",
    cors({
      origin: env.FRONTEND_BASE_URL,
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
    })
  )
  .use("api/v1/auth/*", authMiddleware)
  .route("api/v1", auth)
  .route("api/v1/auth", workouts)
  .route("api/v1/auth", exercises)
  .route("api/v1/auth", completeWorkouts);

export default {
  port: env.PORT || 3000,
  fetch: app.fetch,
};
