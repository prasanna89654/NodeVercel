import express from "express";
import {sendMail, verifyotp} from "../controllers/auth_controller.js";

const router = express.Router();
router.post("/sendMail", sendMail);
router.post("/verifyOTP", verifyotp);

export default router;