import { Request, Response } from "express";
import { userServices } from "./user.service";
import { userValidation } from "./user.validation";

const registerUser = async (req: Request, res: Response) => {
  try {
    const registerUserInfo = userValidation.parse(req?.body);
    const result = await userServices.registerUser(registerUserInfo);
    res.json({
      success: true,
      message: "User registered in successfully",
      data: result,
    });
  } catch (err: any) {
    res.json({
      success: false,
      message: err?.message,
      stack: err?.stack,
    });
  }
};

export const userControllers = {
  registerUser,
};
