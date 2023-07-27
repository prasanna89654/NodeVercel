import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createBook = async (req, res, next) => {
  let filesv = null;
  if (req.file !== undefined) {
    const fileBuffer = req.file.buffer;
    filesv = fileBuffer.toString("base64");
  }

  const {
    title,
    price,
    description,
    genre,
    authorId,
    language,
    length,
    releasedAt,
  } = req.body;

  try {
    const book = await prisma.book.create({
      data: {
        title: title,
        price: price,
        description: description,
        image: filesv ?? null,
        genre: genre,
        Author: {
          connect: {
            id: authorId,
          },
        },
        publisher: {
          connect: {
            id: req.user.id,
          },
        },
        language: language,
        length: length,
        releasedAt: releasedAt,
      },
    });
    res.json(book);
  } catch (err) {
    next(err.message);
  }
};

const getAllBooks = async (req, res, next) => {
  try {
    const allBooks = await prisma.book.findMany({
      include: {
        Author: {
          select: {
            name: true,
          },
        },
        publisher: {
          select: {
            name: true,
          },
        },
      },
    });
    allBooks.forEach((book) => {
      book.genre = Genre.indexOf(book.genre);
    });
    res.json(allBooks);
  } catch (err) {
    next(err.message);
  }
};

const getBookById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (req.token === null) {
      const book = await prisma.book.findUnique({
        where: {
          id: id,
        },
        include: {
          Author: {
            select: {
              name: true,
            },
          },

          publisher: {
            select: {
              name: true,
            },
          },
        },
      });
      if (book === null) {
        next("Book not found");
      } else {
        book.genre = Genre.indexOf(book.genre);
        book.isFavorite = false;
        book.isCart = false;
        res.json(book);
      }
    } else {
      if (req.user !== null) {
        const getFavorite = await prisma.favorite.findFirst({
          where: {
            bookId: id,
            userId: req.user.id,
          },
        });

        const getCart = await prisma.cart.findFirst({
          where: {
            bookId: id,
            userId: req.user.id,
          },
        });

        const book = await prisma.book.findUnique({
          where: {
            id: id,
          },
          include: {
            Author: {
              select: {
                name: true,
              },
            },

            publisher: {
              select: {
                name: true,
              },
            },
          },
        });
        if (book === null) {
          next("Book not found");
        } else {
          book.genre = Genre.indexOf(book.genre);
          book.isFavorite = getFavorite !== null ? true : false;
          book.isCart = getCart !== null ? true : false;
          res.json(book);
        }
      } else {
        res.status(401);
        next("Not authorized");
      }
    }
  } catch (err) {
    next(err.message);
  }
};

const deleteBook = async (req, res, next) => {
  const { id } = req.params;
  try {
    const book = await prisma.book.delete({
      where: {
        id: id,
      },
    });
    res.json("Book Deleted");
    res.json({
      message: "Book deleted successfully",
    });
  } catch (err) {
    next(err.message);
  }
};

const getBooksByEnum = async (req, res, next) => {
  const { genre } = req.params;
  try {
    const books = await prisma.book.findMany({
      where: {
        genre: Genre[parseInt(genre)],
      },
      select: {
        id: true,
        title: true,
        price: true,
        image: true,
        Author: {
          select: {
            name: true,
          },
        },
      },
    });
    res.json(books);
  } catch (err) {
    next(err.message);
  }
};

export { createBook, getAllBooks, deleteBook, getBookById, getBooksByEnum };

const Genre = [
  "Literary_Fiction",
  "Contemporary_Romance",
  "Crime_Thriller",
  "Science_Fiction",
  "Biography_or_Memoir",
  "History_or_Geography",
  "Young_Adult_Fiction",
  "Childrens_Books",
  "Fantasy",
  "Horror",
  "Science_or_Technology",
  "Self_Help_or_Psychology",
  "Humour",
  "Food_or_Cookery",
  "Art_or_Photography",
  "Sports_or_Leisure",
  "Travel",
  "Religion_or_Spirituality",
  "Politics_or_Current_Affairs",
  "Popular_Science",
  "Business_or_Economics",
  "Health_or_Wellbeing",
  "Parenting_or_Family",
  "Education_or_Reference",
  "Poetry_or_Plays",
  "Comics_or_Graphic_Novels",
  "Music_or_Film",
  "Romance",
];
