import { NextFunction, Request, Response } from 'express';
import User from '../modules/user/user.model';
import { JwtPayload } from 'jsonwebtoken';
import { verifyToken } from '../utils/tokenRelatedItems';


const auththentication = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error('You can not see this page');
      }
      const decodedToken = verifyToken(token);
      if (!decodedToken) {
        throw new Error('You can not see this page');
      }
      const { email, _id } = decodedToken;

      const existUser = User.findOne({ email: email });
      if (!existUser) {
        throw new Error('You can not see this page');
      }

      req.user = decodedToken as JwtPayload;
      next();
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        message: err.message || 'Failed to get verify user',
        success: false,
        error: err,
        stack: err?.stack,
      });
    }
  };
};

export default auththentication;