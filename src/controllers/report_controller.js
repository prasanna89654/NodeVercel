import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPublisherAccount = async (req, res, next) => {
  try {
    const account = await prisma.account.findUnique({
      where: {
        publisherId: req.user.id,
      },
    });
    res.json(account);
  }
  catch(err){
    next(err.message);
  }
}

const getAdminAccount = async (req, res, next) => {
  try {
    const account = await prisma.adminAccount.findUnique({
      where: {
        uid: req.user.id,
      },
      
    });
    res.json(account);
  }
  catch(err){
    next(err.message);
  }
}

const getDashboardData = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
 
    const [existingRecord, yesterdayRecord, account, products, totalUsers, todayNewOrders, yesNewOrders, todayNewUsers, yesterdayNewUsers] = await Promise.all([
      prisma.report.findFirst({
        where: {
          date: {
            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
          },
        },
      }),
      prisma.report.findFirst({
        where: {
          date: {
            gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
            lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1),
          },
        },
      }),
      prisma.adminAccount.findUnique({
        where: {
          uid: req.user.id,
        },
      }),
      prisma.book.findMany(),
      prisma.user.findMany(),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
          },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
            lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1),
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()),
            lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1),
          },
        },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
            lt: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1),
          },
        },
      }),

    ]);
    
      const hitCountToday = existingRecord ? existingRecord.userCount : 0;
      const hitCountYesterday = yesterdayRecord ? yesterdayRecord.userCount : 0;
      const percentageChange = hitCountYesterday !==0 ?((hitCountToday - hitCountYesterday) / hitCountYesterday) * 100: null;
      const orderChange = yesNewOrders !==0 ?((todayNewOrders - yesNewOrders) / yesNewOrders) * 100: null;
      const userChange = yesterdayNewUsers !==0 ?((todayNewUsers - yesterdayNewUsers) / yesterdayNewUsers) * 100: null;

     

      res.json({
        todayVisit: {
         count: existingRecord ? existingRecord.userCount : 0,
         percent: percentageChange === null ? null : percentageChange.toFixed(2),
        },
        totalSales: account.totalCash,
        totalProducts: products.length,
        totalUsers: totalUsers.length,
        newOrders: {
          count: todayNewOrders,
          percent: orderChange === null ? null : orderChange.toFixed(2),
        },
        newUsers: {
          count: todayNewUsers,
          percent: userChange === null ? null : userChange.toFixed(2),
        },
      }) 
   


   
  } catch (err) {
    next(err.message);
  }
}



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

const searchBook = async (req, res, next) => {
  try{
    const {title} = req.query;
    const books = await prisma.book.findMany({
      where:{
        title:{
          contains:title,
          mode:"insensitive"
        }
       
      },
      select:{
        id: true,
        title: true,
        price: true,
        image: true,

      }
    })
    res.json(books);

  }catch(err){
    next(err.message);
  }
}

export { getAdminReport, getAllOrders, getPublisherOrders, getPublisherReport, searchBook , getPublisherAccount, getAdminAccount, getDashboardData};
