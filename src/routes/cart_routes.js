import express from "express";
import { protect } from "../middleware/authorization.js";
import { getAllCart, addToCart } from "../controllers/cart_controller.js";

const router = express.Router();

router.get("/getAllCart", protect, getAllCart);

router.post("/addToCart", protect, addToCart);

export default router;
