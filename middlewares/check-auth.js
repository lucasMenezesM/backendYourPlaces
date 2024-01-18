import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";

config();

export default function checkAuth(req, res, next) {
  console.log("Headers: ", req.headers);
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) return next(new HttpError("Authentication Failed!", 401));

    const decodedToken = jwt.verify(token, process.env.secretKey);

    req.userData = { userId: decodedToken.userId };

    next();
  } catch (err) {
    console.log(err);
    next(new HttpError("Authentication Failed", 401));
  }
}
