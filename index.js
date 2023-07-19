import { PrismaClient } from "@prisma/client";
import errorHandler from "./src/middleware/errorMiddleware.js";
import userRoutes from "./src/routes/user_routes.js";
import bookRoutes from "./src/routes/book_routes.js";
import authorRoutes from "./src/routes/author_routes.js";
import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
const prisma = new PrismaClient();
app.use(express.json());
app.use("/user", userRoutes);
app.use("/book", bookRoutes);
app.use("/author", authorRoutes);
app.get("/", (req, res) => {
  res.send("Express JS on Vercel");
});

app.get("/ping", (req, res) => {
  res.send("pong 🏓");
});

app.get("/name", (req, res) => {
  res.send("My name is Prasanna Poudel");
});

//get user data
app.get("/getAllUser", async (req, res) => {
  const allUsers = await prisma.user.findMany();
  res.json(allUsers);
});

app.get("/getAllBooks", async (req, res) => {
  const allBooks = await prisma.book.findMany();
  res.json(allBooks);
});

app.get("/getAllAuthors", async (req, res) => {
  const allAuthors = await prisma.author.findMany();
  res.json(allAuthors);
});

const port = process.env.PORT || 8080;
app.use(errorHandler.errorHandler);
app.listen(port, (err, res) => {
  console.log("[INFO] Server Running on port:", port);
});
