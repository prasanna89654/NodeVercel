import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createAuthor = async (req, res) => {
  const { name, dob, address, description } = req.body;

  try {
    const author = await prisma.author.create({
      data: {
        name: name,
        dob: dob,
        address: address,
        description: description,
      },
    });
    res.json(author);
  } catch (err) {
    res.json({
      sucess: false,
      message: err.message,
    });
  }
};

export { createAuthor };
