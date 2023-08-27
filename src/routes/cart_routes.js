import express from "express";
import {
  addToCart,
  deleteCart,
  getAllCart,
  updateCart,
} from "../controllers/cart_controller.js";
import { protect } from "../middleware/authorization.js";

const router = express.Router();

router.get("/getAllCart", protect, getAllCart);

router.post("/addToCart", protect, addToCart);

router.put("/updateCart/:id/:bookId", protect, updateCart);

router.delete("/deleteCart/:id", protect, deleteCart);

export default router;
