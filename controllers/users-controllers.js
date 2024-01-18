import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

import User from "../models/users-model.js";
import HttpError from "../models/http-error.js";

config();

const saltRounds = 10;

let DUMMY_USERS = [
  {
    id: "u1",
    name: "Naruto Uzumaki",
    email: "narutouzumaki@konoha.com",
    password: "naruto123",
  },
  {
    id: "u2",
    name: "Sasuke Uchiha",
    email: "sasukeuchiha@konoha.com",
    password: "sasuke123",
  },
  {
    id: "u3",
    name: "Sakura Haruno",
    email: "sakuraharuno@konoha.com",
    password: "sakura123",
  },
  {
    id: "u4",
    name: "Kakashi Hatake",
    email: "kakashihatake@konoha.com",
    password: "kakashi123",
  },
  {
    id: "u5",
    name: "Hinata Hyuga",
    email: "hinatahyuga@konoha.com",
    password: "hinata123",
  },
  {
    id: "u6",
    name: "Shikamaru Nara",
    email: "shikamarunara@konoha.com",
    password: "shikamaru123",
  },
];

//* GET ALL USERS
const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Fetching users data failed", 500));
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

//* SIGN UP A NEW USER
const signupUser = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  const errors = validationResult(req).errors;
  if (errors.length > 0) return next(new HttpError(errors[0].msg, 400));

  const { name, email, password } = req.body;

  let hasUser;
  try {
    hasUser = await User.findOne({ email: email });
  } catch (err) {
    next(new HttpError("Something went wrong, could not sign up user", 500));
  }

  if (hasUser)
    return next(
      new HttpError("User is already registered, could not sign up", 422)
    );

  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err)
      return next(
        new HttpError("Something went wrong, could not sign up user", 500)
      );

    const newUser = new User({
      name,
      email,
      password: hash,
      image: req.file.path,
      places: [],
    });

    try {
      await newUser.save();
    } catch (error) {
      return next(
        new HttpError("Something went wrong, could not sign up user", 500)
      );
    }

    let token;
    try {
      token = jwt.sign(
        { userId: newUser.id, email: newUser.email },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return next(
        new HttpError("Something went wrong, could not sign up user", 500)
      );
    }

    res
      .status(201)
      .json({ userId: newUser.id, message: "User created.", token: token });
  });
};

//* LOGIN A USER
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;
  try {
    identifiedUser = await User.findOne({ email: email });
  } catch (error) {
    next(new HttpError("Something went wrong, could not login", 500));
  }
  if (!identifiedUser)
    return next(
      new HttpError("Loggin failed, password or email migth be incorrect", 401)
    );

  // prettier-ignore
  bcrypt.compare(password, identifiedUser.password, function (err, result) {
    if (!result || err)
      return next(new HttpError("Loggin failed, password or email migth be incorrect", 401));

    let token;
    try {
      token = jwt.sign(
        { userId: identifiedUser.id, email: identifiedUser.email },
        process.env.secretKey,
        { expiresIn: "1h" }
      );
    } catch (err) {
      return next(
        new HttpError("Something went wrong, could not loggin user", 500)
      );
    }

    res.status(200).json({message: "User Logged in", token: token, userId: identifiedUser.id});
  });
};

export { getUsers, signupUser, loginUser };
