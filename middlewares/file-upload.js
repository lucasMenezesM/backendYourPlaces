import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limits: { fileSize: 500000 },
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, "./uploads/images");
    },
    filename: (req, file, callback) => {
      const extension = MIME_TYPE_MAP[file.mimetype];
      callback(null, uuidv4() + "." + extension);
    },
  }),
  fileFilter: (req, file, callback) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    const error = isValid
      ? null
      : new Error("Invalid mime type. Allowed types: jpg, jpeg, png");
    callback(error, isValid);
  },
});

export default fileUpload;
