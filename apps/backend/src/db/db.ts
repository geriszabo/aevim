import { Database } from "bun:sqlite";
import { join } from "path";
import { createTable } from "../helpers";
import env from "../env";

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
          password_hash TEXT NOT NULL,
          username TEXT UNIQUE NOT NULL,
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
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `,
    },
    {
      name: "exercises",
      schema: `
          id TEXT PRIMARY KEY,
          user_id TEXT,
          name TEXT NOT NULL,
          category TEXT,
          metric TEXT,
          code TEXT NOT NULL,
          is_global INTEGER DEFAULT 0,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `,
    },
    {
      name: "workout_exercises",
      schema: `
          id TEXT PRIMARY KEY,
          workout_id TEXT NOT NULL,
          exercise_id TEXT NOT NULL,
          order_index INTEGER,
          notes TEXT,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
          FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
        `,
    },
    {
      name: "sets",
      schema: `
          id TEXT PRIMARY KEY,
          workout_exercise_id TEXT NOT NULL,
          reps INTEGER,
          metric_value REAL,
          order_index INTEGER,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
        `,
    },
    {
      name: "user_biometrics",
      schema: `
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id TEXT NOT NULL UNIQUE,
          weight REAL NOT NULL,
          sex TEXT NOT NULL,
          height INTEGER NOT NULL,
          build TEXT NOT NULL,
          created_at TEXT DEFAULT CURRENT_TIMESTAMP,
          updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        `,
    },
  ];

  dbInstance.exec(`PRAGMA foreign_keys = ${env.FOREIGN_KEY_CHECKS};`);

  tables.forEach(({ name, schema }) => createTable(dbInstance, name, schema));
};
