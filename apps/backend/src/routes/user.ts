import { Hono } from "hono";
import { dbConnect } from "../db/db";
import { handleError } from "../helpers";
import { 
  getUserBiometrics, 
  createUserBiometrics, 
  updateUserBiometrics 
} from "../db/queries/user-queries";
import { 
  userBiometricsValidator, 
  userBiometricsUpdateValidator 
} from "../db/schemas/user-schema";

const user = new Hono();

user
  .get("/user/biometrics", async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    
    try {
      const biometrics = getUserBiometrics(db, payload.sub);
      
      if (!biometrics) {
        return c.json({ 
          message: "No biometrics data found for user",
          biometrics: null 
        });
      }
      
      return c.json({ biometrics });
    } catch (error) {
      return handleError(c, error);
    }
  })
  .post("/user/biometrics", userBiometricsValidator, async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    const biometricsData = c.req.valid("json");
    
    try {
      // Check if user already has biometrics
      const existingBiometrics = getUserBiometrics(db, payload.sub);
      if (existingBiometrics) {
        return c.json({ 
          errors: ["User already has biometrics data"] 
        }, 409);
      }
      
      const biometrics = createUserBiometrics(db, payload.sub, biometricsData);
      return c.json({ 
        message: "User biometrics created successfully",
        biometrics 
      }, 201);
    } catch (error) {
      return handleError(c, error);
    }
  })
  .put("/user/biometrics", userBiometricsUpdateValidator, async (c) => {
    const db = dbConnect();
    const payload = c.get("jwtPayload");
    const biometricsData = c.req.valid("json");
    
    try {
      const biometrics = updateUserBiometrics(db, payload.sub, biometricsData);
      return c.json({ 
        message: "User biometrics updated successfully",
        biometrics 
      });
    } catch (error) {
      return handleError(c, error);
    }
  });

export default user;
