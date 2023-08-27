import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPublisherOrders = async (req, res, next) => {
  try {
    const allOrders = await prisma.orderItem.findMany({
      where: {
        publisherId: req.user.id,
      },
    });
    res.json(allOrders);
  } catch (err) {
    next(err.message);
  }
};

const getAllOrders = async (req, res, next) => {
  try {
    const allOrders = await prisma.order.findMany({
      include: {
        OrderItem: true,
      },
    });
    res.json(allOrders);
  } catch (err) {
    next(err.message);
  }
};

const getPublisherReport = async (req, res, next) => {
  try {
    const allOrders = await prisma.orderItem.findMany({
      where: {
        publisherId: req.user.id,
      },
    });
    res.json({
      totalOrders: allOrders.length,
      totalSales: allOrders.reduce((acc, curr) => acc + curr.price, 0),
      totalDeduction: allOrders.reduce(
        (acc, curr) => acc + (20 * curr.price) / 100,
        0
      ),
      totalIncome: allOrders.reduce(
        (acc, curr) => acc + (80 * curr.price) / 100,
        0
      ),
    });
  } catch (err) {
    next(err.message);
  }
};

const getAdminReport = async (req, res, next) => {
  try {
    const allOrders = await prisma.orderItem.findMany({});
    res.json(allOrders);
  } catch (err) {
    next(err.message);
  }
};

export { getAdminReport, getAllOrders, getPublisherOrders, getPublisherReport };
