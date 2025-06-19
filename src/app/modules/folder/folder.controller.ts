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
    res.status(200).json({
      success: true,
      message: "Folder retrived in successfully",
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

const setSecureFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { privateFolderPass } = req.body;
    const result = await folderServices.setSecureFolder(
      req.user,
      id,
      privateFolderPass
    );
    res.status(200).json({
      success: true,
      message: "Folder secured  successfully",
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

const getPrivateFolderItems = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { privateFolderPass } = req.body;
    const result = await folderServices.getPrivateFolderItems(
      req.user,
      id,
      privateFolderPass
    );
    res.status(200).json({
      success: true,
      message: "Private folder items retrived in successfully",
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
  setSecureFolder,
  getPrivateFolderItems,
};
