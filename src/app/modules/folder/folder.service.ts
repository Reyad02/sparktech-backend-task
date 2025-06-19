import { Types } from "mongoose";
import { IFOlder } from "./folder.interface";
import folder from "./folder.model";
import { JwtPayload } from "jsonwebtoken";

const createFolder = async (folderInfo: IFOlder, user: JwtPayload) => {
  const { name } = folderInfo;

  const result = await folder.create({
    name,
    user: new Types.ObjectId(user._id),
  });
  return result;
};

const getAllFolders = async (user: JwtPayload) => {
  const result = await folder.find({ user: user._id });

  if (!result) {
    throw new Error("Folders not found");
  }

  return result;
};

const getFoldersByDate = async (
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

  const files = await folder.find({
    user: cur_user._id,
    createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  return files;
};

export const folderServices = {
  createFolder,
  getAllFolders,
  getFoldersByDate,
};
