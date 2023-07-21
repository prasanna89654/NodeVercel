import express from "express";
import { protect } from "../middleware/authorization.js";
import {
  createFavorite,
  getAllFavorites,
  removeFromFavorite,
} from "../controllers/favorites_controller.js";

const router = express.Router();

router.post("/createFavorite", protect, createFavorite);

router.get("/getAllFavorites", protect, getAllFavorites);

router.delete("/removeFromFavorite/:id", protect, removeFromFavorite);

export default router;
