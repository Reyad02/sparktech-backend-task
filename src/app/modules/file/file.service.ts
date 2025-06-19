import fileModel from "./file.model";
import { IFile } from "./file.interface";
import { JwtPayload } from "jsonwebtoken";
import path from "path";

const upload = async (fileInfo: IFile, file: any, cur_user: JwtPayload) => {
  let detectedType: string | null = null;

  console.log(file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    detectedType = "image";
  } else if (file.mimetype === "application/pdf") {
    detectedType = "pdf";
  } else if (
    file.mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    detectedType = "note";
  }

  if (!detectedType) {
    throw new Error("File type invalid");
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

const favorite = async (favId: string, cur_user: JwtPayload) => {
  const result = await fileModel.findOneAndUpdate(
    { _id: favId, user: cur_user._id },
    [{ $set: { isFavorite: { $not: "$isFavorite" } } }],
    { new: true }
  );

  if (!result) {
    throw new Error("File not found");
  }

  return result;
};

const copyFile = async (fileId: string, cur_user: JwtPayload) => {
  const isFileExist = await fileModel.findById(fileId);
  if (!isFileExist) throw new Error("File not found");

  const ext = path.extname(isFileExist.name);
  const baseName = path.basename(isFileExist.name, ext);

  let copyName = `${baseName} - copy${ext}`;
  let counter = 1;

  while (await fileModel.findOne({ name: copyName, user: cur_user._id })) {
    copyName = `${baseName} - copy (${counter})${ext}`;
    counter++;
  }

  const copied = await fileModel.create({
    name: copyName,
    folder: isFileExist.folder,
    user: cur_user._id,
    type: isFileExist.type,
    size: isFileExist.size,
  });

  return copied;
};

const duplicateFile = async (fileId: string, cur_user: JwtPayload) => {
  const isFileExist = await fileModel.findById(fileId);
  if (!isFileExist) throw new Error("File not found");

  const duplicate = await fileModel.create({
    name: isFileExist.name,
    folder: isFileExist.folder,
    user: cur_user._id,
    type: isFileExist.type,
    size: isFileExist.size,
  });

  return duplicate;
};

const renameFile = async (
  fileId: string,
  cur_user: JwtPayload,
  fileName: string
) => {
  const isFileExist = await fileModel.findById(fileId);
  if (!isFileExist) throw new Error("File not found");
  const newName = fileName + path.extname(isFileExist.name);

  const result = await fileModel.findOneAndUpdate(
    { _id: fileId, user: cur_user._id },
    [{ $set: { name: newName } }],
    { new: true }
  );

  return result;
};

const deleteFile = async (fileId: string, cur_user: JwtPayload) => {
  const result = await fileModel.findOneAndDelete(
    { _id: fileId, user: cur_user._id },
    { new: true }
  );

  if (!result) {
    throw new Error("File not found");
  }

  return result;
};

const getAllImages = async (cur_user: JwtPayload) => {
  const result = await fileModel.find({ type: "image", user: cur_user._id });

  if (!result) {
    throw new Error("Images not found");
  }

  return result;
};

const getAllNotes = async (cur_user: JwtPayload) => {
  const result = await fileModel.find({ type: "note", user: cur_user._id });

  if (!result) {
    throw new Error("Notes not found");
  }

  return result;
};

const getAllPdf = async (cur_user: JwtPayload) => {
  const result = await fileModel.find({ type: "pdf", user: cur_user._id });

  if (!result || result.length === 0) {
    throw new Error("Pdf not found");
  }

  return result;
};

const getFile = async (cur_user: JwtPayload, id: string) => {
  const result = await fileModel.findOne({ user: cur_user._id, _id: id });

  if (!result) {
    throw new Error("File not found");
  }

  return result;
};

const getRecentFiles = async (cur_user: JwtPayload) => {
  const result = await fileModel
    .find({ user: cur_user._id })
    .sort({ updatedAt: -1 })
    .limit(5);

  if (!result || result.length === 0) {
    throw new Error("No recent files found");
  }

  return result;
};

export const fileServices = {
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
};
