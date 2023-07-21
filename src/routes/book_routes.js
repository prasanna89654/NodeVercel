import express from "express";
import {
  createBook,
  getAllBooks,
  deleteBook,
  getBookById,
} from "../controllers/book_controller.js";
import upload from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/createBook", upload.upload.single("file"), createBook);
router.get("/getAllBooks", getAllBooks);
router.delete("/deleteBook/:id", deleteBook);
router.get("/getBookById/:id", getBookById);

export default router;
