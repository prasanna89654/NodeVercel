import { PrismaClient } from "@prisma/client";
import Genre from "../utils/constants.js";
const prisma = new PrismaClient();
const createFavorite = async (req, res, next) => {
  const { bookId } = req.body;
  try {
    const getBook = await prisma.favorite.findFirst({
      where: {
        bookId: bookId,
        userId: req.user.id,
      },
    });

    if (getBook === null) {
      await prisma.favorite.create({
        data: {
          bookId: bookId,
          userId: req.user.id,
        },
      });

      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          isFavorite: true,
        },
      });

      res.json({
        message: "Added to Favorite",
      });
    } else {
      await prisma.favorite.delete({
        where: {
          id: getBook.id,
        },
      });

      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          isFavorite: false,
        },
      });
      res.json({
        message: "Removed From Favorite",
      });
    }
  } catch (err) {
    next(err.message);
  }
};

const getAllFavorites = async (req, res, next) => {
  try {
    const allFavorites = await prisma.favorite.findMany({
      where: {
        userId: req.user.id,
      },
      select: {
        id: true,

        book: {
          select: {
            id: true,
            title: true,
            image: true,
            genre: true,
            Author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    allFavorites.forEach((favorite) => {
      favorite.book.genre = Genre.indexOf(favorite.book.genre);
    });
    res.json(allFavorites);
  } catch (err) {
    next(err.message);
  }
};

const getMostFavorites = async (req, res, next) => {
  try {
    const mostFavorites = await prisma.favorite.groupBy({
      by: ["bookId"],
      _count: {
        bookId: true,
      },

      orderBy: {
        _count: {
          bookId: "desc",
        },
      },
    });
    res.json(mostFavorites);
  } catch (err) {
    next(err.message);
  }
};

export { createFavorite, getAllFavorites, getMostFavorites };
