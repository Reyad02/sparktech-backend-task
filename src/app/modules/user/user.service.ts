import { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import { createToken } from "../../utils/tokenRelatedItems";
import { IUser } from "./user.interface";
import user from "./user.model";
import { generateOtp } from "./user.utils";
import bcrypt from "bcrypt";
import { sendImageToCloudinary } from "../../utils/uploadFile";
import fs from "fs/promises";

const registerUser = async (userInfo: IUser) => {
  const isUserExist = await user.findOne({ email: userInfo?.email });
  if (isUserExist) {
    throw new Error("User already exist");
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
    throw new Error("User already exist");
  }

  const result = await user.create({ email, name, googleId, profileImg });
  const token = createToken(result);

  return token;
};

const requestPasswordReset = async (email: string) => {
  const isUserExist = await user.findOne({ email });
  if (!isUserExist) throw new Error("User not found");

  const otp = generateOtp();
  const otpExpiry = new Date(Date.now() + 50 * 60000);

  const result = await user.findOneAndUpdate(
    { email },
    { $set: { otp: otp.toString(), otpExpiry } },
    { new: true }
  );

  return result;
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
    throw new Error("Invalid or expired OTP");
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
  if (!isUserExist) throw new Error("User not found");

  if (!isUserExist.otpVerified) {
    throw new Error("OTP not verified. Cannot reset password.");
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
    throw new Error("User doesn't exist");
  }

  if (!userName && !file) {
    throw new Error("No data provided to update");
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
    throw new Error("User doesn't exist");
  }

  const isPasswordMatch = await bcrypt.compare(
    currentPassword,
    isUserExist.password
  );
  if (!isPasswordMatch) {
    throw new Error("Current password is incorrect");
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
    throw new Error("User not found");
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
  deleteAccount
};
