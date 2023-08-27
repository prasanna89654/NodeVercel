import { PrismaClient } from "@prisma/client";
import Cloudinary from "cloudinary";
import datauri from "datauri/parser.js";
import path from "path";

// import cloudinary from "../middleware/errorMiddleware.js";
import Genre from "../utils/constants.js";
const prisma = new PrismaClient();
const duri = new datauri();
Cloudinary.config({
  cloud_name: "duywmtg1a",
  api_key: "435642427716696",
  api_secret: "y6chNk_cFJXvuRXmwgGSipPTa4Y",
});

const createBook = async (req, res, next) => {
  let filesv = null;
  if (req.file !== undefined) {
    try {
      const file64 = duri.format(
        path.extname(req.file.originalname).toString(),
        req.file.buffer
      ).content;

      const uploads = await Cloudinary.v2.uploader.upload(file64, {
        folder: "bookstore",
      });
      filesv = uploads.secure_url;
    } catch (err) {
      next(err.message);
    }
  }

  const {
    title,
    price,
    bio,
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
        bio: bio,
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
      select: {
        id: true,
        title: true,
        price: true,
        image: true,
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
    if (req.token === null) {
      const book = await prisma.book.findUnique({
        where: {
          id: id,
        },
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
      if (book === null) {
        next("Book not found");
      } else {
        book.genre = Genre.indexOf(book.genre);
        book.isReading = false;
        book.isFavorite = false;
        book.isCart = false;
        res.json(book);
      }
    } else {
      if (req.user !== null) {
        const getFavorite = await prisma.favorite.findFirst({
          where: {
            bookId: id,
            userId: req.user.id,
          },
        });

        const getCart = await prisma.cart.findFirst({
          where: {
            bookId: id,
            userId: req.user.id,
          },
        });
        const getReading = await prisma.reading.findFirst({
          where: {
            bookId: id,
            userId: req.user.id,
          },
        });

        const book = await prisma.book.findUnique({
          where: {
            id: id,
          },
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
        if (book === null) {
          next("Book not found");
        } else {
          book.genre = Genre.indexOf(book.genre);
          book.isFavorite = getFavorite !== null ? true : false;
          book.isCart = getCart !== null ? true : false;
          book.isReading = getReading !== null ? true : false;
          res.json(book);
        }
      } else {
        res.status(401);
        next("Not authorized");
      }
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
      message: "Book deleted successfully",
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
        genre: Genre[parseInt(genre)],
      },
      select: {
        id: true,
        title: true,
        price: true,
        image: true,
        Author: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(books);
  } catch (err) {
    next(err.message);
  }
};

const deleteFromCloudinary = async (req, res, next) => {
  // const { id } = req.params;
  try {
    const ok = await Cloudinary.v2.uploader.destroy(
      "bookstore/xd2pvamiyvhsavwnbqcc"
    );
    res.json(ok);
  } catch (err) {
    next(err.message);
  }
};

export {
  createBook,
  deleteBook,
  deleteFromCloudinary,
  getAllBooks,
  getBookById,
  getBooksByEnum,
};
