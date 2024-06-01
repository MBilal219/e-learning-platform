import { Response } from "express";
import { AsyncErrors } from "../middleware/AsyncErrors";
import courseModel from "../models/course.model";

export const createCourse = AsyncErrors(async (data: any, res: Response) => {
  const course = await courseModel.create(data);
  res.status(201).json({ success: true, course });
});
