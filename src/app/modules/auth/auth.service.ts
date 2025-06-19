import { CustomError } from "../../error/CustomError";
import { createToken } from "../../utils/tokenRelatedItems";
import user from "../user/user.model";
import { IAuth } from "./auth.interface";
import bcrypt from "bcrypt";

const loginUser = async (loginInfo: IAuth) => {
  const isUserExist = await user.findOne({ email: loginInfo?.email });
  if (!isUserExist) {
    throw new CustomError("User not found", 404);
  }

  const isPassMatch = await bcrypt.compare(
    loginInfo.password,
    isUserExist.password
  );

  if (!isPassMatch) {
    throw new CustomError("Password didn't match", 401);
  }

  const token = createToken(isUserExist);
  return token;
};

export const authServices = {
  loginUser,
};
