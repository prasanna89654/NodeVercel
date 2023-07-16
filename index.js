import { PrismaClient } from "@prisma/client";
import multer from "multer";
import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
const prisma = new PrismaClient();
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

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

app.post("/createBook", upload.single("file"), async (req, res) => {
  let filesv = null;
  if (req.file !== undefined) {
    const fileBuffer = req.file.buffer;
    filesv = fileBuffer.toString("base64");
  }
  // console.log("entered");
  const { title, price, description, author, genre } = req.body;

  try {
    const book = await prisma.book.create({
      data: {
        title: title,
        price: price,
        description: description,
        image: filesv ?? null,
        author: author,
        genre: genre,
      },
    });
    res.json(book);
  } catch (err) {
    res.json({
      sucess: false,
      message: err.message,
    });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, (err, res) => {
  if (err) {
    console.log(err);
    return res.status(500).send(err.message);
  } else {
    console.log("[INFO] Server Running on port:", port);
  }
});
