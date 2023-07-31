import { PrismaClient } from "@prisma/client";
import Genre from "../utils/constants.js";

const prisma = new PrismaClient();
const createReading = async (req, res, next) => {
  const { bookId } = req.body;
  try {
    const getBook = await prisma.reading.findFirst({
      where: {
        bookId: bookId,
        userId: req.user.id,
      },
    });

    if (getBook === null) {
      await prisma.reading.create({
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
          isReading: true,
        },
      });

      res.json({
        message: "Added to Reading",
      });
    } else {
      await prisma.reading.delete({
        where: {
          id: getBook.id,
        },
      });

      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          isReading: false,
        },
      });
      res.json({
        message: "Removed From Reading",
      });
    }
  } catch (err) {
    next(err.message);
  }
};






const getAllReading = async (req, res, next) => {
  try {
    const allReading = await prisma.reading.findMany({
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
    allReading.forEach((reading) => {
      reading.book.genre = Genre.indexOf(reading.book.genre);
    });
    res.json(allReading);
  } catch (err) {
    next(err.message);
  }
};



export { createReading, getAllReading };
