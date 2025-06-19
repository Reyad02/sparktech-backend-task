import { Router } from "express";
import { folderControllers } from "./folder.controller";
import auththentication from "../../middleware/auththentication";

const folderRoutes = Router();

folderRoutes.post("/create", auththentication(),folderControllers.createFolder);
folderRoutes.get("/", auththentication(), folderControllers.getAllFolders);
folderRoutes.get("/folders-by-date", auththentication(), folderControllers.getFoldersByDate);

export default folderRoutes;
