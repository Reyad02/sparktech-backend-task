import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { authValidation } from "./auth.validation";

const signin = async (req: Request, res: Response) => {
  try {
    const validateAuthInfo = authValidation.parse(req?.body);
    const result = await authServices.loginUser(validateAuthInfo);
    res.json({
      success: true,
      message: "checked",
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

export const authControllers = {
  signin
};
