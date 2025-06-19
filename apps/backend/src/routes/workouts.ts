import { Hono } from "hono";
import { dbConnect } from "../db/db";
import {
  workoutUpdateValidator,
  workoutValidator,
} from "../db/schemas/workout-schema";
import {
  deleteWorkoutById,
  getWorkoutById,
  getWorkoutExercisesByWorkoutId,
  getWorkoutOverviewByWorkoutId,
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
      const workouts = getWorkoutsByUserId(db, payload.sub);
      return c.json({ workouts }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  })
  .get("/workouts/:id", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      const workout = getWorkoutById(db, payload.sub, workoutId);
      if (!workout) {
        return c.json({ errors: ["Invalid workout id"] }, 404);
      }
      return c.json({ workout }, 200);
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
  })
  .post("workouts/:id/exercises", exerciseValidator, async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    const exerciseData = c.req.valid("json");
    try {
      const { exercise, workoutExercise } = insertExerciseToWorkout(
        db,
        exerciseData,
        payload.sub,
        workoutId
      );
      return c.json(
        {
          message: "Exercise added to workout successfully",
          exercise,
          workoutExercise,
        },
        201
      );
    } catch (error) {
      if (error instanceof Error && error.message === "WORKOUT_NOT_FOUND") {
        return c.json({ errors: ["Workout not found"] }, 404);
      }

      return c.json({ errors: ["Failed to add exercise to workout"] }, 500);
    }
  })
  .delete("workouts/:id/exercises/:exerciseId", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const exerciseId = c.req.param("exerciseId");
    const payload = c.get("jwtPayload");
    try {
      const deletedExercise = deleteExerciseFromWorkout(
        db,
        workoutId,
        exerciseId,
        payload.sub
      );
      if (!deletedExercise) {
        return c.json({ errors: ["No exercises found for this workout"] }, 404);
      }
      return c.json({
        message: `Exercise with id: ${exerciseId} has been deleted successfully from workout with id: ${workoutId}`,
        exercise: deletedExercise,
      });
    } catch (error) {
      console.log(error);
      return c.json(
        { errors: ["Failed to delete exercise from workout"] },
        500
      );
    }
  })
  .get("workouts/:id/exercises", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      const exercisesInWorkout = getWorkoutExercisesByWorkoutId(
        db,
        workoutId,
        payload.sub
      );
      if (!exercisesInWorkout) {
        return c.json({ errors: ["No exercises found for this workout"] }, 404);
      }
      return c.json({ exercises: exercisesInWorkout });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "WORKOUT_EXERCISE_NOT_FOUND"
      ) {
        return c.json({ errors: ["Workout exercise not found"] }, 404);
      }
      return c.json({ errors: ["Failed to fetch exercises for workout"] }, 500);
    }
  })
  .post(
    "/workouts/:workoutId/exercises/:exerciseId/sets",
    setValidator,
    async (c) => {
      const db = dbConnect();
      const workoutId = c.req.param("workoutId");
      const exerciseId = c.req.param("exerciseId");
      const payload = c.get("jwtPayload");
      const setData = c.req.valid("json");

      try {
        const set = insertSet(db, setData, payload.sub, workoutId, exerciseId);
        return c.json(
          {
            message: "Set added to exercise successfully",
            set,
          },
          201
        );
      } catch (error) {
        if (
          error instanceof Error &&
          error.message === "WORKOUT_EXERCISE_NOT_FOUND"
        ) {
          return c.json({ errors: ["Workout exercise not found"] }, 404);
        }
        console.error(error);
        return c.json({ errors: ["Failed to add set to exercise"] }, 500);
      }
    }
  )
  .get("/workouts/:workoutId/exercises/:exerciseId/sets", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("workoutId");
    const exerciseId = c.req.param("exerciseId");
    const payload = c.get("jwtPayload");
    try {
      const sets = getAllSetsByExerciseId(
        db,
        payload.sub,
        workoutId,
        exerciseId
      );

      return c.json({ sets }, 200);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "WORKOUT_EXERCISE_NOT_FOUND"
      ) {
        return c.json({ errors: ["Could not find exercise with set"] }, 404);
      }
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  })
  .delete(
    "/workouts/:workoutId/exercises/:exerciseId/sets/:setId",
    async (c) => {
      const db = dbConnect();
      const setId = c.req.param("setId");
      const payload = c.get("jwtPayload");
      try {
        deleteSetBySetId(db, setId, payload.sub);
        return c.json({ message: "Set successfully deleted" }, 200);
      } catch (error) {
        if (error instanceof Error && error.message === "SET_NOT_FOUND") {
          return c.json({ errors: ["Set not found"] }, 404);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
      }
    }
  )
  .put(
    "/workouts/:workoutId/exercises/:exerciseId/sets/:setId",
    setUpdateValidator,
    async (c) => {
      const db = dbConnect();
      const setId = c.req.param("setId");
      const payload = c.get("jwtPayload");
      const update = c.req.valid("json");
      try {
        const updatedSet = updateSetById(db, setId, update, payload.sub);
        return c.json({ message: "Set updated successfully", set: updatedSet });
      } catch (error) {
        if (error instanceof Error && error.message === "SET_NOT_FOUND") {
          return c.json({ errors: ["Set not found"] }, 404);
        }
        return c.json({ errors: ["Internal server error"] }, 500);
      }
    }
  )
  .get("workouts/:id/overview", async (c) => {
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
      if (error instanceof Error && error.message === "WORKOUT_NOT_FOUND") {
        return c.json({ errors: ["Workout not found"] }, 404);
      }
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  });

export default workouts;
