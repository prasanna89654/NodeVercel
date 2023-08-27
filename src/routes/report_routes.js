import express from "express";
import {
  getAdminReport,
  getAllOrders,
  getPublisherOrders,
  getPublisherReport,
} from "../controllers/report_controller.js";
import { protect } from "../middleware/authorization.js";

const router = express.Router();

router.get("/getPublisherOrders", protect, getPublisherOrders);

router.get("/getAllOrders", getAllOrders);

router.get("/getPublisherReport", protect, getPublisherReport);

router.get("/getAdminReport", protect, getAdminReport);

export default router;
