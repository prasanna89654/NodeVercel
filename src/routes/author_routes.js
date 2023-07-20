import express from "express";
import { createAuthor, getAllAuthors } from "../controllers/author_controller.js";

const router = express.Router();

router.post("/createAuthor", createAuthor);
router.get("/getAllAuthors", getAllAuthors);



export default router;
