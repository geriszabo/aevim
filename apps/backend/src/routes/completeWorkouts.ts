import { Hono } from "hono";
import { dbConnect } from "../db/db";
import {
  getWorkoutExerciseAndSetIds,
  getCompleteWorkoutByWorkoutId,
  insertWorkout,
  updateWorkoutById,
  deleteWorkoutById,
} from "../db/queries/workout-queries";
import { insertExerciseToWorkout } from "../db/queries/workout-exercises-queries";
import {
  deleteSetBySetId,
  insertSet,
  updateSetById,
} from "../db/queries/set-queries";
import {
  calculateItemsToDeleteWithDependencies,
  deleteIds,
  extractIncomingIds,
  handleError,
} from "../helpers";
import {
  createCompleteWorkoutValidator,
  updateCompleteWorkoutValidator,
} from "../db/schemas/complete-workout-schema";
import {
  deleteExerciseById,
  updateExerciseById,
} from "../db/queries/exercise-queries";

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
          insertSet(
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
      const completeWorkout = getCompleteWorkoutByWorkoutId(
        db,
        workoutId,
        payload.sub
      );
      return c.json({
        message: "Complete workout created successfully",
        workout: completeWorkout,
      });
    } catch (error) {
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
      const currentExerciseSets = getWorkoutExerciseAndSetIds(
        db,
        workoutId,
        payload.sub
      );
      const incomingIds = extractIncomingIds(exercises);
      const { exercisesToDelete, setsToDelete } =
        calculateItemsToDeleteWithDependencies(
          currentExerciseSets,
          incomingIds
        );

      deleteIds(exercisesToDelete, db, payload.sub, deleteExerciseById);
      deleteIds(setsToDelete, db, payload.sub, deleteSetBySetId);
      updateWorkoutById(db, workoutId, payload.sub, {
        date,
        name,
        notes,
      });

      for (const exerciseData of exercises) {
        let exerciseId = exerciseData.exercise_id;
        const sets = exerciseData.sets;
        if (!exerciseData.exercise_id) {
          const { workoutExercise } = insertExerciseToWorkout(
            db,
            exerciseData,
            payload.sub,
            workoutId
          );

          exerciseId = workoutExercise.exercise_id;
        } else {
          const { name, category, notes, metric, exercise_id } = exerciseData;
          exerciseId = exercise_id;
          updateExerciseById(db, exercise_id, payload.sub, {
            category,
            metric,
            name,
            notes,
          });
        }
        for (const setData of sets) {
          if (!setData.id) {
            insertSet(db, setData, payload.sub, workoutId, exerciseId);
          } else {
            const { reps, metric_value } = setData;
            updateSetById(db, setData.id!, { reps, metric_value }, payload.sub);
          }
        }
      }
      return c.json({
        message: "Workout updated successfully",
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
      const workoutOverview = getCompleteWorkoutByWorkoutId(
        db,
        workoutId,
        payload.sub
      );
      return c.json({ overview: workoutOverview }, 200);
    } catch (error) {
      return handleError(c, error);
    }
  })
  .delete("/completeWorkouts/:id", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      deleteWorkoutById(db, workoutId, payload.sub);
      return c.json(
        {
          message: `Workout has been deleted successfuly`,
        },
        200
      );
    } catch (error) {
      return handleError(c, error);
    }
  });

export default completeWorkouts;
