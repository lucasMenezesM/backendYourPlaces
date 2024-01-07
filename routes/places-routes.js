import express from "express";
import * as placeControlers from "../controllers/places-controller.js";

const router = express.Router();

//GETTING PLACES FROM A PROVIDED USER ID
router.get("/user/:userId", placeControlers.getPlaceByUserId);

//GETTING A SPECIFIC PLACE FROM A PROVIDED PLACE ID
router.get("/:placeId", placeControlers.getPlaceById);

// CREATE A NEW PLACE
router.post("/", placeControlers.createNewPlace);
export default router;
