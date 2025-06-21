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
import { handleError } from "../helpers";

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
      return handleError(c, error);
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
      return c.json({ workout }, 200);
    } catch (error) {
      return handleError(c, error);
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

      return c.json(
        { message: "Workout updated successfully", workout: updatedWorkout },
        200
      );
    } catch (error) {
      return handleError(c, error);
    }
  })
  .delete("workouts/:id", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      const deletedWorkout = deleteWorkoutById(db, workoutId, payload.sub);
      return c.json(
        {
          message: `Workout with name: ${deletedWorkout.name} as been deleted successfuly`,
        },
        200
      );
    } catch (error) {
      return handleError(c, error);
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
      return handleError(c, error);
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
      return handleError(c, error);
    }
  })
  .get("workouts/:id/exercises", async (c) => {
    const db = dbConnect();
    const workoutId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      const exercisesInWorkout = getExercisesByWorkoutId(
        db,
        workoutId,
        payload.sub
      );
      return c.json({ exercises: exercisesInWorkout });
    } catch (error) {
      return handleError(c, error);
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
        return handleError(c, error);
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
      return handleError(c, error);
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
        return handleError(c, error);
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
        return handleError(c, error);
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
      return handleError(c, error);
    }
  });

export default workouts;
