import config from "../config";
import { IUser } from "../modules/user/user.interface";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export const createToken = (userInfo: Partial<IUser>) => {
  return jwt.sign(
    { email: userInfo.email, _id: userInfo._id },
    config.jwt_secret as string,
    { expiresIn: config.jwt_expiration } as SignOptions
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt_secret as string) as JwtPayload;
};
