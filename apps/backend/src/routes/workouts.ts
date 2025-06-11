import { Hono } from "hono";
import { dbConnect } from "../db/db";
import {
  workoutUpdateValidator,
  workoutValidator,
} from "../db/schemas/workout-schema";
import {
  deleteWorkoutById,
  getWorkoutById,
  getWorkoutsByUserId,
  insertWorkout,
  updateWorkoutById,
} from "../db/queries/workout-queries";
import { exerciseValidator } from "../db/schemas/exercise-schema";
import {
  insertExerciseToWorkout,
} from "../db/queries/exercise-queries";

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
        return c.json({ errors: ["Invalid workout id"] }, 404);
      }
      return c.json({ workout }, 200);
      //Return success
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Failed to fetch workout"] }, 500);
    }
  })
  .post("workouts/:id/exercises", exerciseValidator, async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    const exercise = c.req.valid("json");
    try {
      const workoutExercise = insertExerciseToWorkout(
        db,
        exercise,
        payload.sub,
        workoutId
      );
      return c.json(
        {
          message: "Exercise added to workout successfully",
          exercise: workoutExercise,
        },
        201
      );
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Failed to add exercise to workout"] }, 500);
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
        return c.json({ errors: ["Workout not found"] }, 404);
      }
      return c.json(
        { message: "Workout updated successfully", workout: updatedWorkout },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  })
  .delete("workouts/:id", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      const deletedWorkout = deleteWorkoutById(db, workoutId, payload.sub);
      if (!deletedWorkout) {
        return c.json({ errors: ["Workout not found"] }, 404);
      }
      return c.json(
        {
          message: `Workout with name: ${deletedWorkout.name} as been deleted successfuly`,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  });

export default workouts;
