import { Hono } from "hono";
import { dbConnect } from "../db/db";
import {
  getWorkoutOverviewByWorkoutId,
  insertWorkout,
  updateWorkoutById,
} from "../db/queries/workout-queries";
import { insertExerciseToWorkout } from "../db/queries/workout-exercises-queries";
import { insertSet, updateSetById } from "../db/queries/set-queries";
import { handleError } from "../helpers";
import {
  createCompleteWorkoutValidator,
  updateCompleteWorkoutValidator,
} from "../db/schemas/complete-workout-schema";
import { updateExerciseById } from "../db/queries/exercise-queries";

const completeWorkouts = new Hono();

completeWorkouts
  .post("/completeWorkouts", createCompleteWorkoutValidator, async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    const {
      workout: { date, name, notes },
      exercises,
    } = c.req.valid("json");

    try {
      const workout = insertWorkout(db, { date, name, notes }, payload.sub);
      const { id: workoutId } = workout;
      for (const exerciseData of exercises) {
        const { name, category, sets, notes, metric } = exerciseData;
        const { workoutExercise } = insertExerciseToWorkout(
          db,
          { name, category, notes, metric },
          payload.sub,
          workoutId
        );

        const { exercise_id: exerciseId } = workoutExercise;
        for (const setData of sets) {
          const set = insertSet(
            db,
            {
              reps: setData.reps,
              metric_value: setData.metric_value,
            },
            payload.sub,
            workoutId,
            exerciseId
          );
        }
      }
      const completeWorkout = getWorkoutOverviewByWorkoutId(
        db,
        workoutId,
        payload.sub
      );
      return c.json({
        message: "Complete workout created successfully",
        workout: completeWorkout,
      });
    } catch (error) {
      console.error(error)
      return handleError(c, error);
    }
  })
  .put("/completeWorkouts/:id", updateCompleteWorkoutValidator, async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    const workoutId = c.req.param("id");
    const {
      workout: { date, name, notes },
      exercises,
    } = c.req.valid("json");

    try {
      const updatedWorkout = updateWorkoutById(db, workoutId, payload.sub, {
        date,
        name,
        notes,
      });
      console.log(updatedWorkout);
      for (const exerciseData of exercises) {
        const { name, category, sets, notes, metric, exercise_id } =
          exerciseData;
        const updatedExercise = updateExerciseById(
          db,
          exercise_id!,
          payload.sub,
          { category, metric, name, notes }
        );
        for (const setData of sets) {
          const { reps, metric_value } = setData;
          const updatedSet = updateSetById(
            db,
            setData.id!,
            { reps, metric_value },
            payload.sub
          );
        }
      }
      //TODO: delete this later, no need to return the whole workout
      const newWorkout = getWorkoutOverviewByWorkoutId(
        db,
        workoutId,
        payload.sub
      );
      return c.json({
        message: "Workout updated successfully",
        updatedWorkout: newWorkout,
      });
    } catch (error) {
      return handleError(c, error);
    }
  })
  .get("/completeWorkouts/:id", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      const workoutOverview = getWorkoutOverviewByWorkoutId(
        db,
        workoutId,
        payload.sub
      );
      return c.json({ overview: workoutOverview }, 200);
    } catch (error) {
      return handleError(c, error);
    }
  });

export default completeWorkouts;
