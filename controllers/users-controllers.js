import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

import HttpError from "../models/http-error.js";

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

// GET USERS
const getUsers = (req, res) => {
  res.status(200).json(DUMMY_USERS);
};

// SIGN UP A NEW USER
const signupUser = (req, res, next) => {
  const errors = validationResult(req).errors;
  if (errors.length > 0) return next(new HttpError(errors[0].msg, 400));

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) return next(new HttpError("User is already registered", 422));

  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) return next(new Error());

    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hash,
    };

    DUMMY_USERS.push(newUser);
    res
      .status(201)
      .json({ message: `User ${name} created successfully`, DUMMY_USERS });
  });
};

// LOGIN A USER
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser) return next(new HttpError("Loggin failed", 401));

  bcrypt.compare(password, identifiedUser.password, function (err, result) {
    if (!result || err) return next(new HttpError("Loggin failed", 401));

    res.status(200).json({ message: "user logged in" });
  });
};

export { getUsers, signupUser, loginUser };
