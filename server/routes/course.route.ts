import express from "express";
import {
  addAnswer,
  addQuestions,
  addReplyToReview,
  addReview,
  editCourse,
  getAllCourse,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { authorizedRole, isAuthenticated } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.get("/courses", getAllCourse);
courseRouter.get("/courses/:id", getSingleCourse);
courseRouter.get("/course-content/:id", isAuthenticated, getCourseByUser);

courseRouter.post(
  "/create-course",
  isAuthenticated,
  authorizedRole("admin"),
  uploadCourse
);

courseRouter.put("/add-question", isAuthenticated, addQuestions);
courseRouter.put("/add-answer", isAuthenticated, addAnswer);
courseRouter.put("/add-review/:id", isAuthenticated, addReview);
courseRouter.put(
  "/add-review-reply",
  isAuthenticated,
  authorizedRole("admin"),
  addReplyToReview
);
courseRouter.put(
  "/edit-course/:id",
  isAuthenticated,
  authorizedRole("admin"),
  editCourse
);

export default courseRouter;
