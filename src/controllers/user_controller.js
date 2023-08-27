import { PrismaClient } from "@prisma/client";
import generateToken from "../utils/generateToken.js";
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

        if (password !== hashed_password) {
          res.status(400);
          next("Password doesn't match");
        } else {
          const token = generateToken(result.id);

          res.json({
            token: token,
            isPublisher: result.isPublisher,
            message: "Login successful",
          });
        }
      }
    } catch (err) {
      next(err.message);
    }
  }
};

const register = async (req, res, next) => {
  let filesv = null;
  if (req.file !== undefined) {
    const fileBuffer = req.file.buffer;
    filesv = fileBuffer.toString("base64");
  }
  const { name, email, password, bio, phone, address, isPublisher, company } =
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
        const result = await prisma.user.create({
          data: {
            name: name,
            email: email,
            bio: bio,
            password: password,
            phone: phone,
            address: address,
            isPublisher: isPublisher,
            company: company,
            image: filesv ?? null,
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
    const allUsers = await prisma.user.findMany();
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
  const { name, email, password, bio, image } = req.body;
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
        image: image,
      },
    });
    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    next(err.message);
  }
};

export { getAllUser, getUserProfile, login, register, updateUserProfile };
