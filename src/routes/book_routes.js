import express from "express";
import { createBook } from "../controllers/book_controller.js";
import upload from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/createBook", upload.upload.single("file"), createBook);
export default router;
