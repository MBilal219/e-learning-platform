import { Request } from "express";
import { IUSER } from "../models/user.model";
declare global {
  namespace Express {
    interface Request {
      user?: IUSER;
    }
  }
}
