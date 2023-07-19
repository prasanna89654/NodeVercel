import generateToken from "../utils/generateToken.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.send({
      message: "Please provide an email and password",
    });
  } else {
    const result = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (result === null) {
      res.status(400);
      next("User not found");
    } else {
      const hashed_password = result.password;

      if (password !== hashed_password) {
        res.status(400);
        next("Password doesn't match");
      } else {
        const token = generateToken(result.id);

        res.json({
          token: token,
          isPublisher: result.isPublisher,
        });
      }
    }
  }
};

const register = async (req, res, next) => {
  const { name, email, password, phone, address, isPublisher, company } =
    req.body;
  const emailResult = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  const usernameResult = await prisma.user.findUnique({
    where: {
      name: name,
    },
  });

  if (emailResult === null && usernameResult === null) {
    try {
      const result = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
          phone: phone,
          address: address,
          isPublisher: isPublisher,
          company: company,
        },
      });
      res.json({
        message: "User created successfully",
      });
    } catch (err) {
      res.status(400);
      next(err.message);
    }
  } else {
    res.status(400);
    next("Email or username already exists");
  }
};

export { login, register };
