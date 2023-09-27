import multer from "multer";
// const cloudinary = Cloudinary.config({
//   cloud_name: "duywmtg1a",
//   api_key: "435642427716696",
//   api_secret: "y6chNk_cFJXvuRXmwgGSipPTa4Y",
// });

const errorHandler = (error, req, res, next) => {
  res
    .status(res.statusCode === 401 ? res.statusCode : 500)
    .json({ sucess: false, message: error });
};

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});


export default { errorHandler, upload };
