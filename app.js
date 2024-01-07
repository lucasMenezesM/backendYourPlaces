import express from "express";
import morgan from "morgan";

import HttpError from "./models/http-error.js";
import placesRoutes from "./routes/places-routes.js";

const PORT = 5000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/places", placesRoutes);

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

app.listen(PORT, () => console.log("BackEnd running on port " + PORT));
