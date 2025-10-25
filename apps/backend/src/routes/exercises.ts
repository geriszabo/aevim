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
import { handleError } from "../helpers";

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
      return handleError(c, error);
    }
  })
  .get("/exercises", async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    try {
      const exercises = getAllExercises(db, payload.sub);
      return c.json({ exercises }, 200);
    } catch (error) {
      return handleError(c, error);
    }
  })
  .delete("/exercises/:id", async (c) => {
    const db = dbConnect();
    const exerciseId = c.req.param("id");
    const payload = c.get("jwtPayload");
    try {
      deleteExerciseById(db, exerciseId, payload.sub);
      return c.json(
        {
          message: `Exercise has been deleted successfuly`,
        },
        200
      );
    } catch (error) {
      return handleError(c, error);
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
      return c.json({
        message: "Exercise updated successfully",
        exercise: updatedExercise,
      });
    } catch (error) {
      return handleError(c, error);
    }
  });

export default exercises;
