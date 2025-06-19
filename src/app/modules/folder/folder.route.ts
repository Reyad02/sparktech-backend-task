import { Router } from "express";
import { folderControllers } from "./folder.controller";
import auththentication from "../../middleware/auththentication";

const folderRoutes = Router();

folderRoutes.post("/create", auththentication(),folderControllers.createFolder);
folderRoutes.patch("/secure/:id", auththentication(), folderControllers.setSecureFolder);
folderRoutes.post("/access/:id", auththentication(), folderControllers.getPrivateFolderItems);
folderRoutes.get("/", auththentication(), folderControllers.getAllFolders);

export default folderRoutes;
