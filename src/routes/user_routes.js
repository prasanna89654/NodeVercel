import express from "express";
import { protect } from "../middleware/authorization.js";
import { login, register } from "../controllers/user_controller.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

export default router;
