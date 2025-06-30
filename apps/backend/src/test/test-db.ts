import { Database } from "bun:sqlite";
import { randomUUID } from "crypto";
import { applySchema } from "../db/db";

export const createTestDb = (): Database => {
  const db = new Database(":memory:");
  db.exec("PRAGMA journal_mode = WAL;");
  applySchema(db);
  return db;
};

export const createTestUser = (
  db: Database, 
  userId?: string,
  username?: string 
): string => {
  const id = userId || randomUUID();
  const passwordHash = `dummy-hash-${id}`;
  const testUser = username || `testuser_${id.slice(0, 8)}`
  db.query(`
    INSERT INTO users (id, email, password_hash, username)
    VALUES (?, ?, ?, ?)
  `).run(id, `test-${id}@test.com`, passwordHash, testUser);
  
  return id;
};

export const createMultipleTestUsers = (
  db: Database,
  count: number
): string[] => {
  const userIds: string[] = [];
  for (let i = 0; i < count; i++) {
    userIds.push(createTestUser(db));
  }
  return userIds;
};