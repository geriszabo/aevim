import { Hono } from "hono";
import { dbConnect } from "../db/db";
import { workoutValidator } from "../db/schemas/workout-schema";
import { insertWorkout } from "../db/queries";

const workouts = new Hono();

workouts.post("/workouts", workoutValidator, async (c) => {
  const db = dbConnect();
  const payload = c.get("jwtPayload");
  const { date, name, notes } = c.req.valid("json");
  console.log(date, name, notes);
  try {
    const workout = await insertWorkout(db, { date, name, notes }, payload.sub);
    return c.json({ message: "Workout created successfully", workout });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("SQLITE_CONSTRAINT_NOTNULL")
    ) {
      return c.json({ errors: ["Date and Name fields can not be empty"] }, 400);
    }
    return c.json(
      { errors: ["Something went wrong creating the workout"] },
      500
    );
  }
});

export default workouts;
