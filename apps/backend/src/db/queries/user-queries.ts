import { Database } from "bun:sqlite";
import type { UserBiometrics, UserBiometricsUpdate } from "@aevim/shared-types/schemas/user-schema";

export const getUserBiometrics = (db: Database, userId: string): UserBiometrics | null => {
  const query = db.query(`
    SELECT weight, sex, height, build
    FROM user_biometrics 
    WHERE user_id = ?
  `);
  
  const biometrics = query.get(userId) as UserBiometrics | null;
  return biometrics;
};

export const createUserBiometrics = (
  db: Database, 
  userId: string, 
  biometricsData: UserBiometrics
): UserBiometrics => {
  const { weight, sex, height, build } = biometricsData;
  
  const insertQuery = db.query(`
    INSERT INTO user_biometrics (user_id, weight, sex, height, build)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  insertQuery.run(userId, weight, sex, height, build);
  
  return getUserBiometrics(db, userId)!;
};

export const updateUserBiometrics = (
  db: Database, 
  userId: string, 
  biometricsData: UserBiometricsUpdate
): UserBiometrics => {
  // Check if user has biometrics to update
  const existingBiometrics = getUserBiometrics(db, userId);
  if (!existingBiometrics) {
    throw new Error("USER_BIOMETRICS_NOT_FOUND");
  }

  const filteredUpdates = Object.fromEntries(
    Object.entries(biometricsData).filter(([_key, value]) => value !== undefined)
  );

  // If no fields to update, return existing biometrics
  if (Object.keys(filteredUpdates).length === 0) {
    return existingBiometrics;
  }

  const fields = Object.keys(filteredUpdates);
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = Object.values(filteredUpdates);

  const updateQuery = db.query(`
    UPDATE user_biometrics 
    SET ${setClause}
    WHERE user_id = ?
  `);

  updateQuery.run(...values, userId);
  
  return getUserBiometrics(db, userId)!;
};
