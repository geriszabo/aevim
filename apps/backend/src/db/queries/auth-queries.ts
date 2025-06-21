import { type UUID, randomUUID } from "crypto";
import { Database } from "bun:sqlite";

export const insertUser = async (
  db: Database,
  email: string,
  password: string
) => {
  const userId = randomUUID();
  const passwordHash = await Bun.password.hash(password);
  const normalizedEmail = email.toLowerCase().trim();

  const insertQuery = db.query(`
        INSERT INTO users (id, email, password_hash)
        VALUES (?, ?, ?)
        RETURNING id
        `);

  try {
    const user = insertQuery.get(userId, normalizedEmail, passwordHash) as { id: UUID };
    return user.id;
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE constraint failed")) {
      throw new Error("EMAIL_ALREADY_EXISTS");
    }
    throw error;
  }
};

export const getUserByEmail = (db: Database, email: string) => {
  const normalizedEmail = email.toLowerCase().trim();
  
  const userQuery = db.query(`
    SELECT id, password_hash FROM users WHERE email = ?
    `);
  const user = userQuery.get(normalizedEmail) as {
    id: string;
    password_hash: string;
  } | null;
  
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }
  
  return user;
};

export const getUserById = (db: Database, id: string) => {
  const userQuery = db.query(`
     SELECT id, email FROM users WHERE id = ?
    `);
  const user = userQuery.get(id) as { id: string; email: string } | null;
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  return user;
};
