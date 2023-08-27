import express from "express";
import {
  createFavorite,
  getAllFavorites,
  getMostFavorites,
} from "../controllers/favorites_controller.js";
import { protect } from "../middleware/authorization.js";

const router = express.Router();

router.post("/createFavorite", protect, createFavorite);

router.get("/getAllFavorites", protect, getAllFavorites);

router.get("/getMostFavorites", protect, getMostFavorites);

router.get("/getMostFavorites", getMostFavorites);

export default router;
