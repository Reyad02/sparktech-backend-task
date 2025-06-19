import { Types } from "mongoose";

export interface IUser {
  _id?: Types.ObjectId;
  email: string;
  password: string;
  profileImg?: string;
  userName: string;
  otp?: string;
  otpExpiry?: Date;
  otpVerified?: boolean;
  googleId?: string;
  storageUsed?: number;
  storageLimit?: number;
  privateFolderPass?: string;
}
