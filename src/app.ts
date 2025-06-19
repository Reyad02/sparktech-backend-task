import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./app/routes";
import { errorHandler } from "./app/middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(
  errorHandler as (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
);

export default app;
