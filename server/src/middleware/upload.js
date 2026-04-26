import multer from "multer";
import path from "path";



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/kyc');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  }
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  }
  else {
    cb(new Error("Not Valid Format,Please Uplaod JPEG OR PNG Only"));
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: fileFilter

});
export default upload;
