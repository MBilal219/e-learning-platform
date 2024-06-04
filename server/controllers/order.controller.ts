import path from "path";
import ejs from "ejs";
import { AsyncErrors } from "../middleware/AsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";

// create order
export const createOrder = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info }: IOrder = req.body;
      const user = await userModel.findById(req.user?._id);
      const isCourseExistsforUser = user?.courses.some(
        (course: any) => course._id.toString() === courseId
      );
      if (isCourseExistsforUser) {
        return next(
          new ErrorHandler("You hav already purchased this course", 400)
        );
      }
      const course = await courseModel.findById(courseId);
      const data: any = {
        courseId: course?._id,
        userId: user?._id,
      };
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);