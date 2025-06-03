import { Hono } from "hono";
import { dbConnect } from "../db/db";
import {
  workoutUpdateValidator,
  workoutValidator,
} from "../db/schemas/workout-schema";
import {
  getWorkoutById,
  getWorkoutsByUserId,
  insertWorkout,
  updateWorkoutById,
} from "../db/queries";

const workouts = new Hono();

workouts
  .post("/workouts", workoutValidator, async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    const { date, name, notes } = c.req.valid("json");
    try {
      const workout = insertWorkout(db, { date, name, notes }, payload.sub);
      return c.json({ message: "Workout created successfully", workout }, 201);
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
      const workouts = getWorkoutsByUserId(db, payload.sub);
      return c.json({ workouts }, 200);
      //Return success
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Failed to fetch workouts"] }, 500);
    }
  })
  .get("/workouts/:id", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      //Fetch all workouts from user
      const workout = getWorkoutById(db, payload.sub, workoutId);
      if (!workout) {
        return c.json({ errors: ["Invalid workout id"] }, 400);
      }
      return c.json({ workout }, 200);
      //Return success
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Failed to fetch workout"] }, 500);
    }
  })
  .put("workouts/:id", workoutUpdateValidator, async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    const update = c.req.valid("json");
    try {
      const updatedWorkout = updateWorkoutById(
        db,
        workoutId,
        payload.sub,
        update
      );
      if (!updatedWorkout) {
        return c.json({ errors: ["Failed to update workout"] }, 500);
      }
      return c.json(
        { message: "Workout updated successfully", workout: updatedWorkout },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  });

export default workouts;
