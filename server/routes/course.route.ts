import express from "express";
import { uploadCourse } from "../controllers/course.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizedRole("admin"),
  uploadCourse
);

export default courseRouter;
