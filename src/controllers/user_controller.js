import generateToken from "../utils/generateToken.js";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcrypt"
const prisma = new PrismaClient();

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    res.send({
      message: "Please provide an email and password",
    });
  } else {
    try {
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
        // compares the password and throws boolean 
        if ((await compare(password, hashed_password)) === false) {
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
    } catch (err) {
      next(err.message);
    }
  }
};

const register = async (req, res, next) => {
  const { name, email, password, phone, address, isPublisher, company } =
    req.body;

  try {
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
        // encrypts the password
        const hashedPassword = await hash(password, 10)
        const result = await prisma.user.create({
          data: {
            name: name,
            email: email,
            password: hashedPassword,
            phone: phone,
            address: address,
            isPublisher: isPublisher,
            // company: company, // company field is not specified in the schema file.
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
  } catch (err) {
    next(err.message);
  }
};

const getAllUser = async (req, res, next) => {
  try {
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, address: true, isPublisher: true, phone: true },
    });
    res.json(allUsers);
  } catch (err) {
    next(err.message);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
    });
    res.json(user);
  } catch (err) {
    next(err.message);
  }
};

const updateUserProfile = async (req, res, next) => {
  const { name, email, password, bio } = req.body;
  try {
    const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: name,
        email: email,
        password: password,
        bio: bio,
      },
    });
    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    next(err.message);
  }
};

export { login, register, getAllUser, getUserProfile, updateUserProfile };
