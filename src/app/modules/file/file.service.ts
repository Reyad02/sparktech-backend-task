import fileModel from "./file.model";
import { IFile } from "./file.interface";
import { JwtPayload } from "jsonwebtoken";
import path from "path";
import { formatFileSize } from "../../utils/fileSizeFormate";
import folder from "../folder/folder.model";
import user from "../user/user.model";
import mongoose from "mongoose";

const upload = async (fileInfo: IFile, file: any, cur_user: JwtPayload) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userData = await user.findById(cur_user._id).session(session);
    if (!userData) {
      throw new Error("User not found");
    }

    const newFileSize = file.size;
    const totalAfterUpload = userData.storageUsed + newFileSize;
    const storageLimit = userData?.storageLimit ?? 15 * 1024 * 1024 * 1024;

    if (totalAfterUpload > storageLimit) {
      throw new Error("Storage limit exceeded. You have reached 15 GB usage.");
    }

    let detectedType: string | null = null;
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

    const result = await fileModel.create(
      [
        {
          name: file.originalname,
          folder: fileInfo.folder,
          user: cur_user._id,
          size: newFileSize,
          type: detectedType,
        },
      ],
      { session }
    );

    await user.updateOne(
      { _id: userData._id },
      { $inc: { storageUsed: newFileSize } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return result[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
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

const getNotesInfo = async (cur_user: JwtPayload) => {
  const isNotesExist = await fileModel.find({
    user: cur_user._id,
    type: "note",
  });
  const totalSizeInBytes = isNotesExist.reduce(
    (acc, singleFile) => acc + singleFile.size,
    0
  );

  return {
    count: isNotesExist.length,
    totalSize: formatFileSize(totalSizeInBytes),
  };
};

const getPdfsInfo = async (cur_user: JwtPayload) => {
  const isPdfsExist = await fileModel.find({
    user: cur_user._id,
    type: "pdf",
  });
  const totalSizeInBytes = isPdfsExist.reduce(
    (acc, singleFile) => acc + singleFile.size,
    0
  );

  return {
    count: isPdfsExist.length,
    totalSize: formatFileSize(totalSizeInBytes),
  };
};

const getImagesInfo = async (cur_user: JwtPayload) => {
  const isimagessExist = await fileModel.find({
    user: cur_user._id,
    type: "image",
  });

  const totalSizeInBytes = isimagessExist.reduce(
    (acc, singleFile) => acc + singleFile.size,
    0
  );

  return {
    count: isimagessExist.length,
    totalSize: formatFileSize(totalSizeInBytes),
  };
};

const getSummary = async (cur_user: JwtPayload) => {
  const files = await fileModel.find({
    user: cur_user._id,
  });

  const totalSizeInBytes = files.reduce(
    (acc, singleFile) => acc + singleFile.size,
    0
  );

  return {
    count: files.length,
    totalSize: formatFileSize(totalSizeInBytes),
  };
};

const getFilesByDate = async (
  cur_user: JwtPayload,
  date: string | undefined
) => {
  if (!date) {
    throw new Error("Date required");
  }
  const modifiedDate = new Date(date);
  if (isNaN(modifiedDate.getTime())) {
    throw new Error("Invalid date");
  }

  const startOfDay = new Date(modifiedDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(modifiedDate.setHours(23, 59, 59, 999));

  const files = await fileModel.find({
    user: cur_user._id,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  const folders = await folder.find({
    user: cur_user._id,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  return { files, folders };
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
  getNotesInfo,
  getPdfsInfo,
  getImagesInfo,
  getSummary,
  getFilesByDate,
};
