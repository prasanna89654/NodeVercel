import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createOrder = async (req, res, next) => {
  const { total, payment , books } = req.body;
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
      orderBy:{
        createdAt:'desc'
      },
      include: {
        user:{
          select:{  
            name:true,
        }},
        OrderItem: {
        select: {
          quantity: true,
          price: true,
          status  : true,
          book: {
            select: {
              title: true,
            }}}
        }
      },
    });
    res.json(allOrders);
  } catch (err) {
    next(err.message);
  }
};

const makePayment= async (req, res, next) => {
  const { id } = req.query;
  try {
    
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include:{
        OrderItem:true
      }
    });

    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        isPayment: true
      }
    })
    
    order.OrderItem.forEach(async (item) => {
      const accounts = await prisma.account.findFirst({
        where: {
          publisherId: item.publisherId,
        }
      })
     
      await prisma.account.update({
        where: {
          publisherId: item.publisherId,
        },
        data: {
          totalCash: accounts.totalCash + item.price * 0.85,
          deductedCash:accounts.deductedCash+ item.price * 0.15,
        }
       })
})


    const users = await prisma.user.findFirst({
      where: {
      isAdmin: true
      }

    })

    const admins = await prisma.adminAccount.findFirst({
      where: {
        uid: users.id
      }
    })

    const total = order.total -100

    await prisma.adminAccount.update({ 
      where: {
        uid: users.id
      },
      data:{
        totalCash: admins.totalCash +  total * 0.15,
      }
  })

 

    res.json({
      message: "Order Created",
    });
  }
  catch (err) {
    next(err.message);
  }
}


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

export { createOrder, deleteOrder, getAllOrders, makePayment };
