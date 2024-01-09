import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import { config } from "dotenv";
config();

import HttpError from "./models/http-error.js";
import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";

const PORT = 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// ROUTES
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error has occurred" });
});

mongoose
  .connect(process.env.DBUrl)
  .then(() => {
    console.log("DataBase connected");
    app.listen(PORT, () => console.log("BackEnd running on port " + PORT));
  })
  .catch((err) => console.log(err.message));
