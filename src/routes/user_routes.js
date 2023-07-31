import express from "express";
import { protect } from "../middleware/authorization.js";
import {
  login,
  register,
  getAllUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/user_controller.js";
import upload from "../middleware/errorMiddleware.js";


const router = express.Router();

router.post("/login", login);

router.post("/register", upload.upload.single("file"), register);

router.get("/getAllUsers", getAllUser);

router.get("/getUserProfile", protect, getUserProfile);

router.put("/updateUserProfile", protect, updateUserProfile);

export default router;
