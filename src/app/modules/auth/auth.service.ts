import { createToken } from "../../utils/tokenRelatedItems";
import user from "../user/user.model";
import { IAuth } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (loginInfo: IAuth) => {
  const isUserExist = await user.findOne({ email: loginInfo?.email });
  if (!isUserExist) {
    throw new Error("User doesn't exist");
  }

  const isPassMatch = await bcrypt.compare(
    loginInfo.password,
    isUserExist.password
  );

  if (!isPassMatch) {
    throw new Error("Password didn't match");
  }

  const token = createToken(isUserExist);
  return token;
};

export const authServices = {
  loginUser,
};
