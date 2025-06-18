import { Router } from "express";
import { folderControllers } from "./folder.controller";
import auththentication from "../../middleware/auththentication";

const folderRoutes = Router();

folderRoutes.post("/create", auththentication(),folderControllers.createFolder);

export default folderRoutes;
