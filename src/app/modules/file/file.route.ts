import { NextFunction, Request, Response, Router } from "express";
import auththentication from "../../middleware/auththentication";
import { upload } from "../../utils/uploadFile";
import { fileControllers } from "./file.controller";

const fileRoutes = Router();

fileRoutes.post(
  "/upload",
  auththentication(),
  upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    console.log("ok");
    next();
  },
  fileControllers.upload
);

export default fileRoutes;
