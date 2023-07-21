import express from "express";
import {
  createAuthor,
  getAllAuthors,
  getAllBooksByAuthor,
} from "../controllers/author_controller.js";

const router = express.Router();

router.post("/createAuthor", createAuthor);

router.get("/getAllAuthors", getAllAuthors);

router.get("/getAllBooksByAuthor/:id", getAllBooksByAuthor);

export default router;
