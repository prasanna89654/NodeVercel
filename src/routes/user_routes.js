import express from "express";
import { protect } from "../middleware/authorization.js";
import { login, register, getAllUser } from "../controllers/user_controller.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/getAllUsers", getAllUser);

export default router;
