import express from "express";
import {sendMail, verifyotp, sendMsg, verifyMsg} from "../controllers/auth_controller.js";

const router = express.Router();
router.post("/sendMail", sendMail);
router.post("/verifyOTP", verifyotp);
router.post("/sendMsg", sendMsg);
router.post("/verifyMsg", verifyMsg);

export default router;