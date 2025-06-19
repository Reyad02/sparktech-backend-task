import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "../../utils/tokenRelatedItems";
import { IUser } from "./user.interface";
import user from "./user.model";
import { generateOtp } from "./user.utils";
import bcrypt from "bcrypt";
import { sendImageToCloudinary } from "../../utils/uploadFile";
import fs from "fs/promises";
import { CustomError } from "../../error/CustomError";

const registerUser = async (userInfo: IUser) => {
  const isUserExist = await user.findOne({ email: userInfo?.email });
  if (isUserExist) {
    throw new CustomError("User already exists", 409);
  }

  const passHash = await bcrypt.hash(
    userInfo.password,
    Number(config.saltRounds)
  );
  userInfo.password = passHash;

  const result = await user.create(userInfo);
  const token = createToken(result);

  return token;
};

const registerUserWithGoogle = async (userInfo: any) => {
  const { email, name, googleId, profileImg } = userInfo;

  const isUserExist = await user.findOne({ email });
  if (isUserExist) {
    throw new CustomError("User already exists", 409);
  }

  const result = await user.create({ email, name, googleId, profileImg });
  const token = createToken(result);

  return token;
};

const requestPasswordReset = async (email: string) => {
  const isUserExist = await user.findOne({ email });
  if (!isUserExist) throw new CustomError("User not found", 404);
  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 50 * 60000);

  const result = await user.findOneAndUpdate(
    { email },
    { $set: { otp: otp.toString(), otpExpiry } },
    { new: true }
  );

  return {otp};
};

const verifyOtp = async (email: string, otp: string) => {
  const isUserExist = await user.findOne({ email });

  if (
    !isUserExist ||
    !isUserExist.otp ||
    isUserExist.otp !== otp ||
    !isUserExist.otpExpiry ||
    new Date() > isUserExist.otpExpiry
  ) {
    throw new CustomError("Invalid or expired OTP", 401);
  }

  await user.findOneAndUpdate(
    { email },
    { $set: { otpVerified: true } },
    { new: true }
  );

  return true;
};

const resetPassword = async (email: string, newPassword: string) => {
  const isUserExist = await user.findOne({ email });
  if (!isUserExist) throw new CustomError("User not found", 404);

  if (!isUserExist.otpVerified) {
    throw new CustomError("OTP not verified. Cannot reset password.", 403);
  }
  const hashed = await bcrypt.hash(newPassword, Number(config.saltRounds));

  const result = await user.findOneAndUpdate(
    { email },
    { $set: { password: hashed, otp: "", otpExpiry: "", otpVerified: false } },
    { new: true }
  );
  return result;
};

const update = async (
  cur_user: JwtPayload,
  userName?: string,
  file?: Express.Multer.File
) => {
  const isUserExist = await user.findById(cur_user._id);
  if (!isUserExist) {
    throw new CustomError("User not found", 404);
  }

  if (!userName && !file) {
    throw new CustomError("No data provided to update", 400);
  }

  const data: Partial<{ userName: string; profileImg: string }> = {};

  if (userName) {
    data.userName = userName;
  }

  if (file) {
    const imagePath = file.path;
    const imageName = file.originalname;

    const { secure_url } = await sendImageToCloudinary(imagePath, imageName);
    data.profileImg = secure_url;

    await fs.unlink(imagePath);
  }

  const updatedUser = await user.findByIdAndUpdate(cur_user._id, data, {
    new: true,
  });

  return updatedUser;
};

const changePassword = async (
  currentPassword: string,
  newPassword: string,
  cur_user: JwtPayload
) => {
  const isUserExist = await user.findById(cur_user._id);
  if (!isUserExist) {
    throw new CustomError("User doesn't exist", 404);
  }

  const isPasswordMatch = await bcrypt.compare(
    currentPassword,
    isUserExist.password
  );
  if (!isPasswordMatch) {
    throw new CustomError("Current password is incorrect", 401);
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.saltRounds)
  );
  const updatedUser = await user.findByIdAndUpdate(
    cur_user._id,
    { password: hashedPassword },
    {
      new: true,
    }
  );

  return {
    message: "Password changed successfully",
  };
};

const deleteAccount = async (cur_user: JwtPayload) => {
  const isUserExist = await user.findById(cur_user._id);
  if (!isUserExist) {
    throw new CustomError("User not found", 404);
  }

  // Delete related user data (e.g., files)
  // await fileModel.deleteMany({ user: cur_user._id });

  // Currently, I'm not deleting related data to avoid potential inconsistencies.

  await user.findByIdAndDelete(cur_user._id);

  return {
    message: "Account deleted successfully",
  };
};

export const userServices = {
  registerUser,
  requestPasswordReset,
  verifyOtp,
  resetPassword,
  registerUserWithGoogle,
  update,
  changePassword,
  deleteAccount,
};
