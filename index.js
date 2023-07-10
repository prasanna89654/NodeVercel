import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const prisma = new PrismaClient();

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
app.get("/user", async (req, res) => {
  const user = await prisma.user.findMany();
  res.send(user);
});

//get all genre
app.get("/getallgenre", async (req, res) => {
  const genre = await prisma.genre;
  res.send(genre);
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
