import express from "express";
import { createAuthor } from "../controllers/author_controller.js";

const router = express.Router();

router.post("/createAuthor", createAuthor);

export default router;