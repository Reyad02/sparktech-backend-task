import { NextFunction, Request, Response } from "express";
import { fileServices } from "./file.service";

const upload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.upload(req.body, req?.file, req.user);
    res.status(201).json({
      success: true,
      message: "File uploaded in successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const favorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.favorite(req.params.favId, req.user);
    res.status(200).json({
      success: true,
      message: "Favorite is successful",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const copyFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.copyFile(req.params.fileId, req.user);
    res.status(200).json({
      success: true,
      message: "File copied successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const duplicateFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await fileServices.duplicateFile(
      req.params.fileId,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "File duplicated successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const renameFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.renameFile(
      req.params.fileId,
      req.user,
      req.body.fileName
    );
    res.status(200).json({
      success: true,
      message: "File renamed successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.deleteFile(req.params.fileId, req.user);
    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllImages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await fileServices.getAllImages(req.user);
    res.status(200).json({
      success: true,
      message: "Images retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.getAllNotes(req.user);
    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getAllPdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.getAllPdf(req.user);
    res.status(200).json({
      success: true,
      message: "pdf retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.getFile(req.user, req.params.id);
    res.status(200).json({
      success: true,
      message: "pdf retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getRecentFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await fileServices.getRecentFiles(req.user);
    res.status(200).json({
      success: true,
      message: "Recent files retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getNotesInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await fileServices.getNotesInfo(req.user);
    res.status(200).json({
      success: true,
      message: "Notes info retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getPdfsInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.getPdfsInfo(req.user);
    res.status(200).json({
      success: true,
      message: "pdfs info retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getImagesInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await fileServices.getImagesInfo(req.user);
    res.status(200).json({
      success: true,
      message: "images info retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await fileServices.getSummary(req.user);
    res.status(200).json({
      success: true,
      message: "Summary retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const getFilesByDate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { date } = req.query;
    const result = await fileServices.getFilesByDate(req.user, date as string);
    res.status(200).json({
      success: true,
      message: "Summary retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const fileControllers = {
  upload,
  favorite,
  copyFile,
  duplicateFile,
  renameFile,
  deleteFile,
  getAllImages,
  getAllNotes,
  getAllPdf,
  getFile,
  getRecentFiles,
  getNotesInfo,
  getPdfsInfo,
  getImagesInfo,
  getSummary,
  getFilesByDate,
};
