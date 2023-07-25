import express from "express";
import { protect } from "../middleware/authorization.js";
import { createOrder, getAllOrders } from "../controllers/order_controller.js";

const router = express.Router();

router.post("/createOrder", protect, createOrder);

router.get("/getAllOrders", protect, getAllOrders);

export default router;
