import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

db.run('DELETE FROM exercises');
db.run('VACUUM');

console.log('All exercises deleted from the exercises table.');