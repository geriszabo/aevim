import { Database } from 'bun:sqlite';

const db = new Database('db.sqlite');

db.run('DELETE FROM sets');
db.run('VACUUM');

console.log('All sets deleted from the sets table.');