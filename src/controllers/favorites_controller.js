import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createFavorite = async (req, res, next) => {
  const { bookId } = req.body;
  try {
    const favorite = await prisma.favorite.create({
      data: {
        bookId: bookId,
        userId: req.user.id,
      },
    });
    res.json({
      message: "Added to Favorite",
    });
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
        book: {
          include: {
            Author: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    res.json(allFavorites);
  } catch (err) {
    next(err.message);
  }
};

const removeFromFavorite = async (req, res, next) => {
  const { id } = req.params;
  try {
    const favorite = await prisma.favorite.delete({
      where: {
        id: id,
      },
    });
    res.json({
      message: "Removed From Favorite",
    });
  } catch (err) {
    next(err.message);
  }
};

export { createFavorite, getAllFavorites, removeFromFavorite };
