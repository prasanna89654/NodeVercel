import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      if (result === null) {
        res.status(401);
        next("Not authorized");
      } else {
        req.user = result;
      }

      next();
    } catch (error) {
      next(error.message);
    }
  }
  if (!token) {
    res.status(401);
    next("Not authorized, no token");
  }
};

const nullprotect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });
      req.user = result;
      next();
    } catch (error) {
      next(error.message);
    }
  }
  if (!token) {
    req.token = null;
    next();
  }
};

export { nullprotect, protect };
