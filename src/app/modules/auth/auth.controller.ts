import { NextFunction, Request, Response } from "express";
import { authServices } from "./auth.service";
import { authValidation } from "./auth.validation";

const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validateAuthInfo = authValidation.parse(req?.body);
    const result = await authServices.loginUser(validateAuthInfo);
    res.status(200).json({
      success: true,
      message: "checked",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const authControllers = {
  signin,
};
