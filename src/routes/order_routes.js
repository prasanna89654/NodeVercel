import express from "express";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
} from "../controllers/order_controller.js";
import { protect } from "../middleware/authorization.js";

const router = express.Router();

router.post("/createOrder", protect, createOrder);

router.get("/getAllOrders", protect, getAllOrders);

router.delete("/deleteOrder/:id", protect, deleteOrder);

export default router;
