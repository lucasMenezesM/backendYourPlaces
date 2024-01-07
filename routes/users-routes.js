import express from "express";
import * as usersRoutes from "../controllers/users-controllers.js";

const router = express.Router();

// GET A LIST OF ALL USERS
router.get("/", usersRoutes.getUsers);

//SIGN UP A NEW USER
router.post("/signup", usersRoutes.signupUser);

//LOGIN A USER
router.post("/login", usersRoutes.loginUser);

export default router;
