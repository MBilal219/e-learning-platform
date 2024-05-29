import { Request, Response, NextFunction } from "express";
import { AsyncErrors } from "./AsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../connection/redis";

// authenticated user
export const isAuthenticated = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies.access_token as string;
    try {
      if (!access_token) {
        return next(
          new ErrorHandler("Please login to access this resource", 401)
        );
      }

      const decoded = jwt.verify(
        access_token,
        process.env.ACCESS_TOKEN as string
      ) as JwtPayload;

      if (!decoded) {
        new ErrorHandler("Access token is not valid", 401);
      }

      const user = await redis.get(decoded.id);
      if (!user) {
        new ErrorHandler("User not found", 400);
      }

      req.user = JSON.parse(user as string);
      next();
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

// validate user role
export const authorizedRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler("You are not allowed to access this recource", 403)
      );
    }
    next();
  };
};
