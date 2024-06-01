import cloudinary from "cloudinary";
import { AsyncErrors } from "../middleware/AsyncErrors";
import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { createCourse } from "../services/course.service";

// upload courses

export const uploadCourse = AsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data=req.body;
        const thumbnail=data.thumbnail
        if(thumbnail){
            const cloud=await cloudinary.v2.uploader.upload(thumbnail,{
                folder:'courses'
            })
            data.thumbnail={
                public_id:cloud.public_id,
                url: cloud.url
            }
        }
        createCourse(data,res,next)
    } catch (err: any) {
      return next(new ErrorHandler(err.message, 500));
    }
  }
);
