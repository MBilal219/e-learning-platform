require("dotenv").config();

import { Response } from "express";
import { IUSER } from "../models/user.model";
import { redis } from "../connection/redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

export const sendToken = (user: IUSER, statusCode: number, res: Response) => {
  const accessToken = user.authAccessToken();
  const refreshToken = user.authRefreshToken();

  // upload session to redis after login
  redis.set(user._id as any, JSON.stringify(user) as any);

  // parse evns to integrate with fallback values
  const accessTokenExpire = parseInt(process.env.EXP_ACCESS_TOKEN || "300", 10);
  const refreshTokenExpire = parseInt(
    process.env.EXP_REFRESH_TOKEN || "1200",
    10
  );

  //  options for cookies
  const accessTokenOption: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpire * 1000),
    maxAge: accessTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  const refreshTokenOption: ITokenOptions = {
    expires: new Date(Date.now() + refreshTokenExpire * 1000),
    maxAge: refreshTokenExpire * 1000,
    httpOnly: true,
    sameSite: "lax",
  };

  //   only set secure true in production for the token object
  if (process.env.NODE_ENV === "production") {
    accessTokenOption.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOption);
  res.cookie("refresh_token", refreshToken, refreshTokenOption);
  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
