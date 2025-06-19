import { Request, Response, NextFunction } from "express";
import { CustomError } from "../error/CustomError";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error | CustomError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: formattedErrors,
    });
  }

  const statusCode = (err instanceof CustomError && err.statusCode) || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: err.stack ,
  });
};
