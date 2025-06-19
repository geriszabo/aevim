import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

db.run('DELETE FROM workout_exercises');
db.run('VACUUM');

console.log('All workout-exercises deleted from the workout_exercises table.');