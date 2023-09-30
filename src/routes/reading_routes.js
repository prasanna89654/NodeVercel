import express from "express";
import {
  createReading,
  getAllReading,
  
} from "../controllers/reading_controller.js";
import { protect } from "../middleware/authorization.js";


const router = express.Router();

router.post("/createReading", protect, createReading);

router.get("/getAllReading", protect,getAllReading);

export default router;
