import express, {Router, Request, Response, NextFunction} from "express";
import authController from "../controllers/authController.ts";
import tokenValidation from "../middlewares/verifyTokenMiddleware.ts"
import schema from "../validation_schemas/schemas.ts"
import validate from "../middlewares/validationMiddleware.ts"


const authRoutes = express.Router();
authRoutes.post("/signup", validate(schema.userSchema), authController.signup)
authRoutes.post("/login", authController.login)
authRoutes.post("/logout",  authController.logout)
export default authRoutes