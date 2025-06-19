import { Router } from "express";
import { userControllers } from "./user.controller";

const userRoutes = Router();

userRoutes.post("/register", userControllers.registerUser);
userRoutes.post("/register-with-google", userControllers.registerUserWithGoogle);
userRoutes.post("/forgot-password/request", userControllers.requestReset);
userRoutes.post("/forgot-password/verify", userControllers.verifyOtp);
userRoutes.post("/forgot-password/reset", userControllers.resetPassword);

export default userRoutes;
