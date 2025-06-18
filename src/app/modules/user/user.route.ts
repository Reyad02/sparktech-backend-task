import { Router } from "express";
import { userControllers } from "./user.controller";

const userRoutes = Router();

userRoutes.post("/register", userControllers.registerUser);

export default userRoutes;
