require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import { AsyncErrors } from "../middleware/AsyncErrors";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import sendMail from "../utils/SendMail";
// register user

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registerUser = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, avatar }: IRegistrationBody = req.body;
      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist)
        return next(new ErrorHandler("Email already exist", 400));

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const { activationCode, token } = handleCreateActivationToken(user);
      const data = { user: { name: user.name }, activationCode };
      try {
        await sendMail({
          email: user.email,
          subject: "Activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          success: true,
          message: `Please check your email: ${user.email} to activate your account!`,
          token,
        });
      } catch (err: any) {
        return next(new ErrorHandler(err.message, 400));
      }
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const handleCreateActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};
