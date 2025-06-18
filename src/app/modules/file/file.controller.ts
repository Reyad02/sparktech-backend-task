import { Request, Response } from "express";
import { fileServices } from "./file.service";

const upload = async (req: Request, res: Response) => {
  try {

    const result = await fileServices.upload(req.body, req?.file, req.user);
    res.status(201).json({
      success: true,
      message: "File uploaded in successfully",
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

export const fileControllers = {
  upload,
};
