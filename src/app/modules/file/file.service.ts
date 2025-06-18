import fileModel from "./file.model";
import { IFile } from "./file.interface";
import { JwtPayload } from "jsonwebtoken";
import path from "path";

const upload = async (fileInfo: IFile, file: any, cur_user: JwtPayload) => {
  let detectedType: string | null = null;

  if (file.mimetype.startsWith("image/")) {
    detectedType = "image";
  } else if (file.mimetype === "application/pdf") {
    detectedType = "pdf";
  } else if (file.mimetype === "text/plain") {
    detectedType = "note";
  }

  if (!detectedType) {
    throw Error("File type invalid");
  }

  const result = await fileModel.create({
    name: file.originalname,
    folder: fileInfo.folder,
    user: cur_user._id,
    size: file.size,
    type: detectedType,
  });
  return result;
};

export const fileServices = {
  upload,
};
