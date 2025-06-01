import { Hono } from "hono";
import { dbConnect } from "../db/db";
import { workoutValidator } from "../db/schemas/workout-schema";
import { getUserWorkouts, insertWorkout } from "../db/queries";

const workouts = new Hono();

workouts
  .post("/workouts", workoutValidator, async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    const { date, name, notes } = c.req.valid("json");
    try {
      const workout = await insertWorkout(
        db,
        { date, name, notes },
        payload.sub
      );
      return c.json({ message: "Workout created successfully", workout });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("SQLITE_CONSTRAINT_NOTNULL")
      ) {
        console.error(error);
        return c.json(
          { errors: ["Date and Name fields can not be empty"] },
          400
        );
      }
      console.error(error);
      return c.json(
        { errors: ["Something went wrong creating the workout"] },
        500
      );
    }
  })
  .get("/workouts", async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    try {
      //Fetch all workouts from user
      const workouts = getUserWorkouts(db, payload.sub);
      return c.json({ workouts }, 200);
      //Return success
    } catch (error) {
      console.error(error);
      return c.json(
        { errors: ["Failed to fetch workouts"] },
        500
      );
    }
  });

export default workouts;
