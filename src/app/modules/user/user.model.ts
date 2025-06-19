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
  },
  { timestamps: true }
);

const user = model("user", userSchema);
export default user;
