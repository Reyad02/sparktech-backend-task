import { NextFunction, Request, Response, Router } from "express";
import { userControllers } from "./user.controller";
import auththentication from "../../middleware/auththentication";
import { upload } from "../../utils/uploadFile";

const userRoutes = Router();

userRoutes.post("/register", userControllers.registerUser);
userRoutes.post(
  "/register-with-google",
  userControllers.registerUserWithGoogle
);
userRoutes.post("/forgot-password/request", userControllers.requestReset);
userRoutes.post("/forgot-password/verify", userControllers.verifyOtp);
userRoutes.post("/forgot-password/reset", userControllers.resetPassword);
userRoutes.patch(
  "/update-info",
  auththentication(),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body?.data);
    next();
  },
  userControllers.update
);
userRoutes.patch(
  "/change-password",
  auththentication(),

  userControllers.changePassword
);
userRoutes.delete(
  "/delete-account",
  auththentication(),

  userControllers.deleteAccount
);
export default userRoutes;
