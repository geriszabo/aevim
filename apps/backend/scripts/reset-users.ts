import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

db.run('DELETE FROM users');
db.run('VACUUM');

console.log('All users deleted from the users table.');