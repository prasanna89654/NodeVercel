import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const addToCart = async (req, res, next) => {
  const { bookId } = req.body;
  try {
    const getBook = await prisma.cart.findFirst({
      where: {
        bookId: bookId,
        userId: req.user.id,
      },
    });

    if (getBook === null) {
      const book = await prisma.book.findFirst({
        where: {
          id: bookId,
        },
      });

      await prisma.cart.create({
        data: {
          bookId: bookId,
          userId: req.user.id,
          publisherId: book.publisherId,
        },
      });

      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          isCart: true,
        },
      });

      res.json({
        message: "Added to Cart",
      });
    } else {
      await prisma.cart.delete({
        where: {
          id: getBook.id,
        },
      });

      await prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          isCart: false,
        },
      });
      res.json({
        message: "Removed From Cart",
      });
    }
  } catch (err) {
    next(err.message);
  }
};

const getAllCart = async (req, res, next) => {
  const id = req.user.id;
  try {
    const allCart = await prisma.cart.findMany({
      where: {
        userId: id,
      },
      include: {
        book: {
          select: {
            title: true,
            price: true,
            image: true,
          },
        },
      },
    });
    res.json(allCart);
  } catch (err) {
    next(err.message);
  }
};

const updateCart = async (req, res, next) => {
  const { id, bookId } = req.params;
  const { quantity } = req.body;
  try {
    const book = await prisma.book.findFirst({
      where: {
        id: bookId,
      },
    });

    await prisma.cart.update({
      where: {
        id: id,
      },
      data: {
        quantity: quantity,
        totalPrice: parseInt(quantity) * parseInt(book.price.split(" ")[1]),
      },
    });
    res.json({
      message: "Cart Updated",
    });
  } catch (err) {
    next(err.message);
  }
};

const deleteCart = async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteCart = await prisma.cart.delete({
      where: {
        id: id,
      },
    });
    res.json({
      message: "Removed From Cart",
    });
  } catch (err) {
    next(err.message);
  }
};

export { addToCart, deleteCart, getAllCart, updateCart };
