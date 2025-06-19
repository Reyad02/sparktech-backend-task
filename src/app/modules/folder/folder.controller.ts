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

const getAllFolders = async (req: Request, res: Response) => {
  try {
    const result = await folderServices.getAllFolders(req.user);
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

const getFoldersByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query;

    const result = await folderServices.getFoldersByDate(
      req.user,
      date as string
    );
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
  getAllFolders,
  getFoldersByDate,
};
