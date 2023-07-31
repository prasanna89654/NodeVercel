import express from "express";
import { nullprotect, protect } from "../middleware/authorization.js";
import {
  createFavorite,
  getAllFavorites,
  getMostFavorites,
} from "../controllers/favorites_controller.js";

const router = express.Router();

router.post("/createFavorite", protect, createFavorite);

router.get("/getAllFavorites", nullprotect, getAllFavorites);

router.get("/getMostFavorites", protect, getMostFavorites);

router.get("/getMostFavorites", getMostFavorites);

export default router;
