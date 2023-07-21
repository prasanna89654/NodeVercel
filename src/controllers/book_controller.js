import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createBook = async (req, res, next) => {
  let filesv = null;
  if (req.file !== undefined) {
    const fileBuffer = req.file.buffer;
    filesv = fileBuffer.toString("base64");
  }

  const {
    title,
    price,
    description,
    genre,
    authorId,
    language,
    length,
    releasedAt,
  } = req.body;

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
            id: req.user.id,
          },
        },
        language: language,
        length: length,
        releasedAt: releasedAt,
      },
    });
    res.json(book);
  } catch (err) {
    next(err.message);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err.message);
  }
};

const getBookById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.findUnique({
      where: {
        id: id,
      },
    });
    if (book === null) {
      next("Book not found");
    } else {
      res.json(book);
    }
  } catch (err) {
    next(err.message);
  }
};

const deleteBook = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.delete({
      where: {
        id: id,
      },
    });
    res.json("Book Deleted");
    res.json({
      "message": "Book deleted successfully"
    });
  } catch (err) {
    next(err.message);
  }
};

const getBooksByEnum = async (req, res, next) => {
  const { genre } = req.params;
  try {
    const books = await prisma.book.findMany({
      where: {
        genre: genre,
      },
    });
    res.json(books);
  } catch (err) {
    next(err.message);
  }
};

export { createBook, getAllBooks, deleteBook, getBookById, getBooksByEnum };
