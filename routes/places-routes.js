import express from "express";
import * as placeControlers from "../controllers/places-controller.js";
import {
  createPlaceValidation,
  updatePlaceValidation,
} from "../models/input-validations.js";
import checkAuth from "../middlewares/check-auth.js";
import fileUpload from "../middlewares/file-upload.js";
import requireAuth from "../middlewares/authMiddleware.js";
import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/users-model.js";

import { config } from "dotenv";
config();

const router = express.Router();

//GETTING PLACES FROM A PROVIDED USER ID
router.get("/user/:userId", placeControlers.getPlacesByUserId);

//GETTING A SPECIFIC PLACE FROM A PROVIDED PLACE ID
router.get("/:placeId", placeControlers.getPlaceById);

// Authentication
// router.use(checkAuth);:

//prettier-ignore
// CREATE A NEW PLACE
router.post("/", requireAuth, fileUpload.single("image"), createPlaceValidation, placeControlers.createNewPlace);

//prettier-ignore
//UPDATE A PLACE
router.patch("/:placeId",requireAuth, updatePlaceValidation, placeControlers.updatePlace);

//DELETE A PLACE
router.delete("/:placeId", requireAuth, placeControlers.deletePlace);

export default router;
