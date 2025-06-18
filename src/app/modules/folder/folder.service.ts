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
};

export const folderServices = {
  createFolder,
};
