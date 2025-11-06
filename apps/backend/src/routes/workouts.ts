import { Hono } from "hono";
import { dbConnect } from "../db/db";
import { getWorkoutsByUserId } from "../db/queries/workout-queries";

const workouts = new Hono();

workouts.get("/workouts", async (c) => {
  const db = dbConnect();
  const payload = c.get("jwtPayload");
  const limitParam = c.req.query("limit");
  const offsetParam = c.req.query("offset");

  const limit = limitParam ? parseInt(limitParam) : undefined;
  const offset = offsetParam ? parseInt(offsetParam) : 0;

  try {
    const workouts = getWorkoutsByUserId(db, payload.sub, { limit, offset });
    return c.json({ workouts }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ errors: ["Internal server error"] }, 500);
  }
});

export default workouts;
