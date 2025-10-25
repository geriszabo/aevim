import { Hono } from "hono";
import { dbConnect } from "../db/db";
import { getWorkoutsByUserId } from "../db/queries/workout-queries";

const workouts = new Hono();

workouts.get("/workouts", async (c) => {
  const db = dbConnect();
  const payload = c.get("jwtPayload");
  try {
    const workouts = getWorkoutsByUserId(db, payload.sub);
    return c.json({ workouts }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ errors: ["Internal server error"] }, 500);
  }
});

export default workouts;
