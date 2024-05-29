import express from "express";
import {
  activatrUser,
  loginUser,
  registerUser,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate-user", activatrUser);
userRouter.post("/login", loginUser);

export default userRouter;
