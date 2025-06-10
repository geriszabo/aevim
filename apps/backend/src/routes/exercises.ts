import { Hono } from "hono";
import { dbConnect } from "../db/db";
import { exerciseValidator } from "../db/schemas/exercise-shema";
import { insertExerciseToWorkout } from "../db/queries/exercise-queries";

const exercises = new Hono();

exercises.post("/exercises", exerciseValidator, async (c) => {
  const db = dbConnect();
  const payload = c.get("jwtPayload");
  const { name, category } = c.req.valid("json");
  try {
    const exercise = insertExerciseToWorkout(db, { name, category }, payload.sub);
    return c.json({ message: "exercise created successfully", exercise }, 201);
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

});

export default exercises;
