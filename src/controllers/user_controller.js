import { PrismaClient } from "@prisma/client";
import generateToken from "../utils/generateToken.js";
const prisma = new PrismaClient();
import Cloudinary from "cloudinary";

import datauri from "datauri/parser.js";
import path from "path";

Cloudinary.config({
  cloud_name: "duywmtg1a",
  api_key: "435642427716696",
  api_secret: "y6chNk_cFJXvuRXmwgGSipPTa4Y",
});
const duri = new datauri();
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
            isAdmin: result.isAdmin,
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
  const { name, email, password, phone, bio, address, isPublisher, company, image } =
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
            image: filesv ?? image??null,
          },
        });

        if(isPublisher){
          await prisma.account.create({
            data:{
              user: {
                connect: {
                  id: result.id,
                },
              },
              totalCash: 0,
              deductedCash:0,

            }
          })
        }

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
  let filesv = null;
  if (req.file !== undefined) {
    try {
      const file64 = duri.format(
        path.extname(req.file.originalname).toString(),
        req.file.buffer
      ).content;

      const uploads = await Cloudinary.v2.uploader.upload(file64, {
        folder: "bookstore",
      });
      filesv = uploads.secure_url;
    } catch (err) {
      next(err.message);
    }
  }
  const { name, email, password, bio } = req.body;
  try { const user = await prisma.user.update({
      where: {
        id: req.user.id,
      },
      data: {
        name: name,
        email: email,
        password: password,
        bio: bio,
        image: filesv,
      },
    });
    res.json({
      message: "User updated successfully",
    });
  } catch (err) {
    next(err.message);
  }
};

const deleteUser = async (req, res, next) => {
  const { id } = req.query;
  try {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    next(err.message);
  }
}



export { getAllUser, getUserProfile, login, register, updateUserProfile, deleteUser };
