import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    password: { type: String },
    profileImg: { type: String },
    userName: { type: String },
    otp: { type: String },
    otpExpiry: { type: String },
    otpVerified: { type: Boolean },
    googleId: { type: String },
    storageUsed: { type: Number, default: 0 },
    storageLimit: { type: Number, default: 15 * 1024 * 1024 * 1024 },
    privateFolderPass: { type: String },
  },
  { timestamps: true }
);

const user = model("user", userSchema);
export default user;
