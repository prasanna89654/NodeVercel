import express from "express";
import { protect } from "../middleware/authorization.js";
import {
  login,
  register,
  getAllUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user_controller.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/getAllUsers", getAllUser);

router.get("/getUserProfile", protect, getUserProfile);

router.put("/updateUserProfile", protect, updateUserProfile);

export default router;
