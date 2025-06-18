import { IUser } from "./user.interface";
import user from "./user.model";

const registerUser = async (userInfo: IUser) => {
  const isUserExist = await user.findOne({ email: userInfo?.email });
  if (isUserExist) {
    throw Error("User already exist");
  }

  const result = await user.create(userInfo);
  return result;
};

export const userServices = {
  registerUser,
};