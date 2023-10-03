import express from "express";
import { protect } from "../middleware/authorization.js";
import {
  login,
  register,
  getAllUser,
  getUserProfile,
  updateUserProfile,
  deleteUser
} from "../controllers/user_controller.js";
import upload from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", upload.upload.single("file"), register);

router.get("/getAllUsers", getAllUser);

router.get("/getUserProfile", protect, getUserProfile);

router.delete("/deleteUser",deleteUser);

router.put("/updateUserProfile", protect, upload.upload.single("file"), updateUserProfile);

export default router;
