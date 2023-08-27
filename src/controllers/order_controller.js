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
          publisherId: book.publisherId,
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
        OrderItem: true,
      },
    });
    res.json(allOrders);
  } catch (err) {
    next(err.message);
  }
};

const deleteOrder = async (req, res, next) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
    });

    await prisma.orderItem.deleteMany({
      where: {
        orderId: id,
      },
    });

    await prisma.order.delete({
      where: {
        id: id,
      },
    });
    res.json({
      message: "Order Deleted",
    });
  } catch (err) {}
};

const change = async (req, res, next) => {
  const { id } = req.params;
  try {
    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: "Confirmed",
      },
    });
    res.json({
      message: "Order Confirmed",
    });
  } catch (err) {
    next(err.message);
  }
};

export { createOrder, deleteOrder, getAllOrders };
