import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createOrder = async (req, res, next) => {
  const { total, books } = req.body;
  try {
    const order = await prisma.order.create({
      data: {
        status: "Pending",
        total: total,
        user: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    books.forEach(async (book) => {
      await prisma.orderItem.create({
        data: {
          user: {
            connect: {
              id: req.user.id,
            },
          },
          order: {
            connect: {
              id: order.id,
            },
          },
          book: {
            connect: {
              id: book.bookId,
            },
          },
          quantity: book.quantity,
          price: book.price,
        },
      });
    });
    res.json({
      message: "Order Created",
    });
  } catch (err) {
    next(err.message);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const allOrders = await prisma.order.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        orderItem: true,
      },
    });
    res.json(allOrders);
  } catch (err) {
    next(err.message);
  }
};

export { createOrder, getAllOrders };
