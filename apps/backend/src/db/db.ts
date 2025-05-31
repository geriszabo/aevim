import { Database } from "bun:sqlite";
import { join } from "path";
import { createTable } from "../helpers";

const dbPath = join(".", "db.sqlite");

let db: Database;

export const dbConnect = () => {
  if (!db) {
    db = new Database(dbPath);
    db.exec("PRAGMA journal_mode = WAL;");

    applySchema(db);
  }
  return db;
};

export const applySchema = (dbInstance: Database) => {
  const tables = [
    {
      name: "users",
      schema: `
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT UNIQUE NOT NULL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        `,
    },
    {
      name: "workouts",
      schema: `
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          name TEXT NOT NULL,
          notes TEXT,
          date TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        `,
    },
    {
      name: "exercises",
      schema: `
          id TEXT PRIMARY KEY,
          user_id TEXT,
          name TEXT NOT NULL,
          category TEXT,
          is_global INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        `,
    },
    {
      name: "sets",
      schema: `
          id TEXT PRIMARY KEY,
          workout_exercise_id TEXT NOT NULL,
          reps INTEGER,
          weight REAL,
          duration INTEGER,
          order_index INTEGER,
          FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id)
        `,
    },
  ];

  tables.forEach(({ name, schema }) => createTable(dbInstance, name, schema));
};
