import { Hono } from "hono";
import { dbConnect } from "../db/db";


import { setValidator } from "../db/schemas/set-schema";
import { insertSet } from "../db/queries/set-queries";

const sets = new Hono();

sets
  .post("/workouts/:workoutId/exercises/:exerciseId/sets", setValidator, async (c) => {
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
      if (error instanceof Error && error.message === "WORKOUT_EXERCISE_NOT_FOUND") {
        return c.json({ errors: ["Workout exercise not found"] }, 404);
      }
      console.error(error);
      return c.json({ errors: ["Failed to add set to exercise"] }, 500);
    }
  })

export default sets;