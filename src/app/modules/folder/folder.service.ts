import mongoose, { Types } from "mongoose";
import { IFOlder } from "./folder.interface";
import folder from "./folder.model";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../config";
import user from "../user/user.model";
import fileModel from "../file/file.model";
import { CustomError } from "../../error/CustomError";

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
    throw new CustomError("Folders not found", 404);
  }

  return result;
};

const getPrivateFolderItems = async (
  userPayload: JwtPayload,
  folderId: string,
  privateFolderPass: string
) => {
  const userDoc = await user.findById(userPayload._id);
  if (!userDoc || !userDoc.privateFolderPass) {
    throw new CustomError("User not found or password not set", 403);
  }

  const folderDoc = await folder.findOne({
    _id: folderId,
    user: userPayload._id,
    isSecure: true,
  });

  if (!folderDoc) {
    throw new CustomError("Folder is not secure or doesn't exist", 404);
  }

  const isPasswordMatched = await bcrypt.compare(
    privateFolderPass,
    userDoc.privateFolderPass
  );

  if (!isPasswordMatched) {
    throw new CustomError("Password didn't match", 401);
  }

  const files = await fileModel.find({
    user: userPayload._id,
    folder: folderId,
  });

  return files;
};

const setSecureFolder = async (
  userPayload: JwtPayload,
  folderId: string,
  privateFolderPass: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const isFolderExist = await folder
      .findOne({
        _id: folderId,
        user: userPayload._id,
      })
      .session(session);

    if (!isFolderExist) {
      throw new CustomError("Folders not found", 404);
    }

    const passHash = await bcrypt.hash(
      privateFolderPass,
      Number(config.saltRounds)
    );

    await user.findByIdAndUpdate(
      userPayload._id,
      { privateFolderPass: passHash },
      { session }
    );

    await folder.findByIdAndUpdate(folderId, { isSecure: true }, { session });

    await session.commitTransaction();
    session.endSession();

    return { success: true, message: "Folder secured successfully" };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

export const folderServices = {
  createFolder,
  getAllFolders,
  setSecureFolder,
  getPrivateFolderItems,
};
