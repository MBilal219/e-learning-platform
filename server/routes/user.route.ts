import express from "express";
import { activatrUser, registerUser } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/activate-user", activatrUser);

export default userRouter;
