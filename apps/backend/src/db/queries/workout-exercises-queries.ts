import { Database } from "bun:sqlite";

export const getWorkoutExercisesByWorkoutId = (
  db: Database,
  workoutId: string
) => {
  const workoutExercisesQuery = db.query(
    `
    SELECT 
      exercises.id,
      exercises.name,
      exercises.category,
      workout_exercises.order_index,
        exercises.created_at
    FROM workout_exercises
    JOIN exercises ON workout_exercises.exercise_id = exercises.id
    WHERE workout_exercises.workout_id = ?
    ORDER BY workout_exercises.order_index
  `
  );
  const workoutExercisesArray = workoutExercisesQuery.all(workoutId);
  return workoutExercisesArray;
};
