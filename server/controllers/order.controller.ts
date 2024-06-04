import path from "path";
import ejs from "ejs";
import { AsyncErrors } from "../middleware/AsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { IOrder } from "../models/order.model";
import userModel from "../models/user.model";
import courseModel from "../models/course.model";
import { newOrder } from "../services/order.service";
import sendMail from "../utils/SendMail";
import NotificationModel from "../models/notification.model";

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

      if (!course) {
        return next(new ErrorHandler("Course not found", 404));
      }

      const data: any = {
        courseId: course?._id,
        userId: user?._id,
        payment_info,
      };

      const maildata = {
        order: {
          _id: course._id && course._id.toString().slice(0, 6),
          name: course?.name,
          price: course?.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      try {
        if (user) {
          await sendMail({
            email: user.email,
            data: maildata,
            subject: "Order Confirmation",
            template: "order-confirmation.ejs",
          });
        }
      } catch (err: any) {
        return next(new ErrorHandler(err.message, 500));
      }
      user?.courses.push(course?._id as any);
      await user?.save();

      await NotificationModel.create({
        userId: user?._id,
        title: "New Order",
        message: `You have a new order from ${course?.name}`,
      });
      course.purchased !== undefined ? (course.purchased += 1) : 1;

      await course.save();
      newOrder(data, res, next);
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
