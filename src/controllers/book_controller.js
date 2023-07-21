import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createBook = async (req, res) => {
  let filesv = null;
  if (req.file !== undefined) {
    const fileBuffer = req.file.buffer;
    filesv = fileBuffer.toString("base64");
  }
  // console.log("entered");
  const { title, price, description, genre, authorId, publisherId,language,length,releasedAt} = req.body;

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
        language: language,
        length: length,
        releasedAt: releasedAt,
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

const getAllBooks = async (req, res) => {
  const allBooks = await prisma.book.findMany({
    include: {
      Author: {
        select: {
          name: true,
        },
      },
      publisher: {
        select: {
          name: true,
        },
      },
    },
  });
  res.json(allBooks);
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.delete({
      where: {
        id: id,
      },
    });
    res.json({
      "message": "Book deleted successfully"
    });
  } catch (err) {
    res.json({
      sucess: false,
      message: err.message,
    });
  }
}
export { createBook, getAllBooks , deleteBook};
