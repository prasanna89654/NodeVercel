import express from "express";
import { protect } from "../middleware/authorization.js";
import {
  createFavorite,
  getAllFavorites,
  getMostFavorites,
} from "../controllers/favorites_controller.js";

const router = express.Router();

router.post("/createFavorite", protect, createFavorite);

router.get("/getAllFavorites", protect, getAllFavorites);

router.get("/getMostFavorites", protect, getMostFavorites);

export default router;
