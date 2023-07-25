import express from "express";
import { nullprotect, protect } from "../middleware/authorization.js";
import {
  createBook,
  getAllBooks,
  deleteBook,
  getBookById,
  getBooksByEnum,
} from "../controllers/book_controller.js";
import upload from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/createBook", protect, upload.upload.single("file"), createBook);
router.get("/getAllBooks", getAllBooks);
router.delete("/deleteBook/:id", protect, deleteBook);
router.get("/getBookById/:id", nullprotect, getBookById);
router.get("/getBooksByEnum/:genre", getBooksByEnum);

export default router;
