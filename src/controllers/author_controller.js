import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createAuthor = async (req, res, next) => {
  const { name, dob, bio, address, description } = req.body;


  try {
    const author = await prisma.author.create({
      data: {
        name: name,
        bio: bio,
        dob: dob,
        address: address,
        description: description,
      },
    });
    res.json(author);
  } catch (err) {
    next(err.message);
  }
};

const getAllAuthors = async (req, res, next) => {
  try {
    const allAuthors = await prisma.author.findMany();
    res.json(allAuthors);
  } catch (err) {
    next(err.message);
  }
};

const getAllBooksByAuthor = async (req, res, next) => {
  const { id } = req.params;
  try {
    const allBooksByAuthor = await prisma.book.findMany({
      where: {
        authorId: id,
      },
    });
    res.json(allBooksByAuthor);
  } catch (err) {
    next(err.message);
  }
};

export { createAuthor, getAllAuthors, getAllBooksByAuthor };
