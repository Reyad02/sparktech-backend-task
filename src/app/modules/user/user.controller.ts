import { NextFunction, Request, Response } from "express";
import { userServices } from "./user.service";
import {
  emailValidation,
  otpValidation,
  userValidation,
} from "./user.validation";

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const registerUserInfo = userValidation.parse(req?.body);
    const result = await userServices.registerUser(registerUserInfo);
    res.status(201).json({
      success: true,
      message: "User registered in successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const registerUserWithGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.registerUserWithGoogle(req.body);
    res.status(201).json({
      success: true,
      message: "User registered in successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const requestReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = emailValidation.parse(req?.body);
    const result = await userServices.requestPasswordReset(userEmail?.email);
    res.status(200).json({ success: true, message: "OTP sent", data: result });
  } catch (err: any) {
    next(err);
  }
};

const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userOtp = otpValidation.parse({ otp: req.body.otp });
    const userEmail = emailValidation.parse({ email: req.body.email });

    const result = await userServices.verifyOtp(userEmail.email, userOtp.otp);
    res
      .status(200)
      .json({ success: true, message: "OTP verified", data: result });
  } catch (err: any) {
    next(err);
  }
};
const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = emailValidation.parse({ email: req.body.email });
    const result = await userServices.resetPassword(
      userEmail.email,
      req.body?.newPassword
    );
    res
      .status(200)
      .json({ success: true, message: "password successfully", data: result });
  } catch (err: any) {
    next(err);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userServices.update(
      req.user,
      req?.body?.userName,
      req?.file
    );
    res.status(200).json({
      success: true,
      message: "Info updated in successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.changePassword(
      req.body.currentPassword,
      req.body.newPassword,
      req.user
    );
    res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteAccount = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await userServices.deleteAccount(req.user);
    res.status(200).json({
      success: true,
      message: "Delete account successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const userControllers = {
  registerUser,
  requestReset,
  verifyOtp,
  resetPassword,
  registerUserWithGoogle,
  update,
  changePassword,
  deleteAccount,
};
