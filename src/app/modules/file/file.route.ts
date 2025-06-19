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
fileRoutes.get("/pdf", auththentication(), fileControllers.getAllPdf);
fileRoutes.get("/images", auththentication(), fileControllers.getAllImages);
fileRoutes.get("/notes", auththentication(), fileControllers.getAllNotes);
fileRoutes.get("/:id", auththentication(), fileControllers.getFile);
fileRoutes.patch("/fav/:favId", auththentication(), fileControllers.favorite);
fileRoutes.patch("/cody/:fileId", auththentication(), fileControllers.copyFile);
fileRoutes.patch(
  "/duplicate/:fileId",
  auththentication(),
  fileControllers.duplicateFile
);
fileRoutes.patch(
  "/rename/:fileId",
  auththentication(),
  fileControllers.renameFile
);
fileRoutes.delete(
  "/delete/:fileId",
  auththentication(),
  fileControllers.deleteFile
);
fileRoutes.get(
  "/recent-files",
  auththentication(),
  fileControllers.getRecentFiles
);


export default fileRoutes;
