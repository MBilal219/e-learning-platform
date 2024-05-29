// get user by id

import { Response } from "express";
import userModel from "../models/user.model";
import { redis } from "../connection/redis";

export const getUserbyId = async (id: string, res: Response) => {
  //   const user = await userModel.findById(id);
  const userJson = await redis.get(id);
  const user = JSON.parse(userJson as string);
  res.status(210).json({
    success: true,
    user,
  });
};
