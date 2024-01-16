import express from "express";
import fs from "fs";
import path from "path";
import morgan from "morgan";
import mongoose from "mongoose";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import cors from "cors";
config();

import HttpError from "./models/http-error.js";
import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";

const PORT = 5000;
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use("/uploads/images", express.static(__dirname + "/uploads/images"));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );

//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
//   next();
// });

// ROUTES
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res) => {
  throw new HttpError("Could not find this route.", 404);
});

app.use((error, req, res, next) => {
  if (req.file)
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });

  if (res.headerSent) return next(error);

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
