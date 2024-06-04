import express from "express";
import { authorizedRole, isAuthenticated } from "../middleware/auth";
import {
  getnotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller";

const notificationRouter = express.Router();

notificationRouter.get(
  "/get-all-notifications",
  isAuthenticated,
  authorizedRole("admin"),
  getnotifications
);

notificationRouter.put(
  "/update-notifiction/:id",
  isAuthenticated,
  authorizedRole("admin"),
  updateNotificationStatus
);

export default notificationRouter;
