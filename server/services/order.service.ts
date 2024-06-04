import { NextFunction, Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import OrderModel from "../models/order.model";

// create new order
export const newOrder = AsyncErrors(
  async (data: any, res: Response, next: NextFunction) => {
    const order = await OrderModel.create(data);
    res.status(201).json({
      success: true,
      order,
    });
  }
);
