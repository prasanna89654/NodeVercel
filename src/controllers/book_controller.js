import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createBook = async (req, res) => {
  let filesv = null;
  if (req.file !== undefined) {
    const fileBuffer = req.file.buffer;
    filesv = fileBuffer.toString("base64");
  }
  // console.log("entered");
  const { title, price, description, genre, authorId, publisherId } = req.body;

  try {
    const book = await prisma.book.create({
      data: {
        title: title,
        price: price,
        description: description,
        image: filesv ?? null,

        genre: genre,
        Author: {
          connect: {
            id: authorId,
          },
        },
        publisher: {
          connect: {
            id: publisherId,
          },
        },
      },
    });
    res.json(book);
  } catch (err) {
    res.json({
      sucess: false,
      message: err.message,
    });
  }
};

export { createBook };
