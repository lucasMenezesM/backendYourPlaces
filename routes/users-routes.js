import express from "express";
import * as usersRoutes from "../controllers/users-controllers.js";
import { signupValidation } from "../models/input-validations.js";
import fileUpload from "../middlewares/file-upload.js";
import multer from "multer";

const upload = multer({ dest: "./uploads/images" });

const router = express.Router();

// GET A LIST OF ALL USERS
router.get("/", usersRoutes.getUsers);

//SIGN UP A NEW USER
router.post(
  "/signup",
  fileUpload.single("image"),
  signupValidation,
  usersRoutes.signupUser
);

//LOGIN A USER
router.post("/login", usersRoutes.loginUser);

export default router;
