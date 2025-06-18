import { Request, Response } from "express";
import { folderServices } from "./folder.service";

const createFolder = async (req: Request, res: Response) => {
  try {
    const result = await folderServices.createFolder(req.body, req.user);
    res.status(201).json({
      success: true,
      message: "Folder created in successfully",
      data: result,
    });
  } catch (err: any) {
    res.json({
      success: false,
      message: err?.message,
      stack: err?.stack,
    });
  }
};

export const folderControllers = {
  createFolder,
};
