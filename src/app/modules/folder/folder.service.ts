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

export const folderServices = {
  createFolder,
  getAllFolders,
};
