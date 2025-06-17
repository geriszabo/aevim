import { Hono } from "hono";
import { dbConnect } from "../db/db";
import {
  exerciseUpdateValidator,
  exerciseValidator,
} from "../db/schemas/exercise-schema";
import {
  deleteExerciseById,
  getAllExercises,
  insertExercise,
  updateExerciseById,
} from "../db/queries/exercise-queries";

const exercises = new Hono();

exercises
  .post("/exercises", exerciseValidator, async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    const { name, category } = c.req.valid("json");
    try {
      const exercise = insertExercise(db, { name, category }, payload.sub);
      return c.json(
        { message: "exercise created successfully", exercise },
        201
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("SQLITE_CONSTRAINT_NOTNULL")
      ) {
      }
      console.error(error);
      return c.json(
        { errors: ["Something went wrong creating the exercise"] },
        500
      );
    }
  })
  .get("/exercises", async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    try {
      const exercises = getAllExercises(db, payload.sub);
      return c.json({ exercises }, 200);
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Error fetching exercises"] }, 500);
    }
  })
  .delete("/exercises/:id", async (c) => {
    const db = dbConnect();
    const exerciseId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      const deletedExercise = deleteExerciseById(db, exerciseId, payload.sub);
      if (!deletedExercise) {
        return c.json({ errors: ["Exercise not found"] }, 404);
      }
      return c.json(
        {
          message: `Exercise with name: ${deletedExercise.name} as been deleted successfuly`,
        },
        200
      );
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  })
  .put("/exercises/:id", exerciseUpdateValidator, async (c) => {
    const db = dbConnect();
    const exerciseId = c.req.param("id");
    const payload = c.get("jwtPayload");
    const updates = c.req.valid("json");
    try {
      const updatedExercise = updateExerciseById(
        db,
        exerciseId,
        payload.sub,
        updates
      );
      if (!updatedExercise) {
        return c.json({ errors: ["Failed to find exercise"] }, 404);
      }
      return c.json({
        message: "Exercise updated successfully",
        exercise: updatedExercise,
      });
    } catch (error) {
      console.error(error);
      return c.json({ errors: ["Internal server error"] }, 500);
    }
  });

export default exercises;
