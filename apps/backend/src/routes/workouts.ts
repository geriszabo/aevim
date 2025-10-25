import { Hono } from "hono";
import { dbConnect } from "../db/db";
import {
  workoutUpdateValidator,
  workoutValidator,
} from "../db/schemas/workout-schema";
import {
  deleteWorkoutById,
  getWorkoutById,
  getExercisesByWorkoutId,
  getWorkoutsByUserId,
  insertWorkout,
  updateWorkoutById,
} from "../db/queries/workout-queries";
import { exerciseValidator } from "../db/schemas/exercise-schema";
import {
  deleteExerciseFromWorkout,
  insertExerciseToWorkout,
} from "../db/queries/workout-exercises-queries";
import { setUpdateValidator, setValidator } from "../db/schemas/set-schema";
import {
  deleteSetBySetId,
  getAllSetsByExerciseId,
  insertSet,
  updateSetById,
} from "../db/queries/set-queries";
import { handleError } from "../helpers";

const workouts = new Hono();

workouts
  .get("/workouts", async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    try {
      const workouts = getWorkoutsByUserId(db, payload.sub);
      return c.json({ workouts }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  })

export default workouts;
