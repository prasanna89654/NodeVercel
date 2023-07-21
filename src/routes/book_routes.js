import express from "express";
import { createBook, getAllBooks , deleteBook} from "../controllers/book_controller.js";
import upload from "../middleware/errorMiddleware.js";

const router = express.Router();

router.post("/createBook", upload.upload.single("file"), createBook);
router.get("/getAllBooks", getAllBooks);
router.delete("/deleteBook/:id", deleteBook);
export default router;
