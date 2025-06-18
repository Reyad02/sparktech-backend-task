import user from "../user/user.model";
import { IAuth } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (loginInfo: IAuth) => {
  const isUserExist = await user.findOne({ email: loginInfo?.email });
  if (!isUserExist) {
    throw Error("User doesn't exist");
  }

  const isPassMatch = await bcrypt.compare(
    loginInfo.password,
    isUserExist.password
  );

  if (!isPassMatch) {
    throw Error("Password didn't match");
  }

  return isUserExist;
};

export const authServices = {
  loginUser,
};
