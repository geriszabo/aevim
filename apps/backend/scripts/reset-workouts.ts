import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

db.run('DELETE FROM workouts');
db.run('VACUUM');

console.log('All workouts deleted from the workouts table.');