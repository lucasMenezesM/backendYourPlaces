import express from "express";
import * as placeControlers from "../controllers/places-controller.js";
import {
  createPlaceValidation,
  updatePlaceValidation,
} from "../models/input-validations.js";
import checkAuth from "../middlewares/check-auth.js";
import fileUpload from "../middlewares/file-upload.js";

const router = express.Router();

//GETTING PLACES FROM A PROVIDED USER ID
router.get("/user/:userId", placeControlers.getPlacesByUserId);

//GETTING A SPECIFIC PLACE FROM A PROVIDED PLACE ID
router.get("/:placeId", placeControlers.getPlaceById);

// Authentication
router.use(checkAuth);

//prettier-ignore
// CREATE A NEW PLACE
router.post("/", fileUpload.single("image"), createPlaceValidation, placeControlers.createNewPlace);

//UPDATE A PLACE
router.patch("/:placeId", updatePlaceValidation, placeControlers.updatePlace);

//DELETE A PLACE
router.delete("/:placeId", placeControlers.deletePlace);

export default router;
