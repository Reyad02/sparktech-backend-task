import { Router } from "express";
import { authControllers } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/signin", authControllers.signin);

export default authRoutes;