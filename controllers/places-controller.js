import { validationResult } from "express-validator";
import fs from "fs";
import mongoose from "mongoose";

import getCoordByAddress from "../util/location.js";
import HttpError from "../models/http-error.js";
import Place from "../models/places-model.js";
import User from "../models/users-model.js";

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "aldeia da folha",
    description: "a aldeia liderada pelo hokage naruto uzumaki da folha",
    coordinates: {
      lat: -12.5953411,
      lgt: -71.4770275,
    },
    address:
      "Sítio Aldeia da Folha Soído (Zona Rural, Domingos Martins - ES, 29260-000",
    user_id: "u1",
  },
  {
    id: "p2",
    title: "vila da folha 2",
    description: "a aldeia liderada pelo hokage naruto uzumaki da folha",
    coordinates: {
      lat: -12.5953411,
      lgt: -71.4770275,
    },
    address:
      "Sítio Aldeia da Folha Soído (Zona Rural, Domingos Martins - ES, 29260-000",
    user_id: "u2",
  },
  {
    id: "p3",
    title: "Copa Cabana",
    description: "A beautiful beach in Rio de Janeiro",
    coordinates: {
      lat: -12.5953411,
      lgt: -71.4770275,
    },
    address: "Av. Atlântica, 1702 - Copacabana, Rio de Janeiro - RJ, 22021-001",
    user_id: "u1",
  },
  {
    id: "p4",
    title: "Sugarloaf Mountain",
    description: "Iconic peak in Rio de Janeiro with breathtaking views",
    coordinates: {
      lat: -22.9518741,
      lgt: -43.1633923,
    },
    address: "Praia Vermelha, Rio de Janeiro - RJ, 22290-270",
    user_id: "u2",
  },
  {
    id: "p5",
    title: "Christ the Redeemer",
    description: "Famous statue overlooking Rio de Janeiro",
    coordinates: {
      lat: -22.9518142,
      lgt: -43.2105269,
    },
    address: "Parque Nacional da Tijuca, Rio de Janeiro - RJ, 22241-125",
    user_id: "u1",
  },
  {
    id: "p6",
    title: "Ipanema Beach",
    description: "Famous beach known for its vibrant atmosphere",
    coordinates: {
      lat: -22.9852433,
      lgt: -43.2013727,
    },
    address: "Av. Vieira Souto, Ipanema, Rio de Janeiro - RJ, 22420-002",
    user_id: "u2",
  },
  {
    id: "p7",
    title: "Maracanã Stadium",
    description: "Iconic football stadium in Rio de Janeiro",
    coordinates: {
      lat: -22.912825,
      lgt: -43.2301435,
    },
    address:
      "Av. Pres. Castelo Branco, Portão 3 - Maracanã, Rio de Janeiro - RJ",
    user_id: "u1",
  },
  {
    id: "p8",
    title: "Tijuca Forest",
    description: "Largest urban rainforest in the world",
    coordinates: {
      lat: -22.9515693,
      lgt: -43.2703127,
    },
    address:
      "Estr. da Cascatinha, 850 - Alto da Boa Vista, Rio de Janeiro - RJ",
    user_id: "u2",
  },
];

// GET A PLACE BY ITS ID
const getPlaceById = async (req, res, next) => {
  const id = req.params.placeId;
  let place;

  try {
    place = await Place.findById(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find a place", 500)
    );
  }

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided place id", 404)
    );
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// GET PLACES BY A SPECIFIC USER ID
const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;
  let places;
  try {
    places = await Place.find({ user_id: userId });
    console.log(places);
  } catch (err) {
    return next(
      new HttpError("Something went wrong could not find a place", 500)
    );
  }

  return res
    .status(200)
    .json({ places: places.map((place) => place.toObject({ getters: true })) });
};

// CREATE A NEW PLACE
const createNewPlace = async (req, res, next) => {
  console.log(req.file);
  console.log(req.body);
  // validation
  const result = validationResult(req).errors;
  if (result.length > 0) return next(new HttpError(result[0].msg, 400));

  const { title, address, description, user_id } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordByAddress(address);
  } catch (err) {
    return next(err);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    coordinates,
    image: req.file.path,
    user_id,
  });
  let user;
  try {
    user = await User.findById(user_id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not create a place", 500)
    );
  }

  if (!user) return next(new HttpError("User id not found", 404));

  console.log(user);
  console.log(createdPlace);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    return next(new HttpError("Could not create a place. Try again", 500));
  }

  res.status(201).json(createdPlace.toObject({ getters: true }));
};

//UPDATE A PLACE
const updatePlace = async (req, res, next) => {
  // validation
  const result = validationResult(req).errors;
  if (result.length > 0) return next(new HttpError(result[0].msg, 400));

  const placeId = req.params.placeId;
  const { title, description } = req.body;

  let updatedPlace;
  try {
    updatedPlace = await Place.findById(placeId);
  } catch (error) {
    return next(new HttpError("Something went wrong, place not found", 500));
  }

  if (!updatedPlace)
    return next(new HttpError("Something went wrong, place not found", 500));

  console.log(req.userData, updatedPlace.user_id.toString());

  if (updatedPlace.user_id.toString() !== req.userData.userId)
    return next(new HttpError("You cannot edit this place", 401));

  updatedPlace.title = title;
  updatedPlace.description = description;

  try {
    await updatedPlace.save();
  } catch (err) {
    return next(new HttpError("Creating place failed", 500));
  }

  res.json(updatedPlace.toObject({ getters: true }));
};

//DELETE A PLACE
const deletePlace = async (req, res, next) => {
  const { placeId } = req.params;

  let deletedPlace;
  try {
    deletedPlace = await Place.findById(placeId).populate("user_id");
  } catch (err) {
    return next(
      new HttpError("Something went wront,could not delete this item", 500)
    );
  }

  if (!deletedPlace)
    return next(new HttpError("Could not find this place", 404));

  console.log(deletedPlace.user_id.id, req.userData.userId);
  if (deletedPlace.user_id.id !== req.userData.userId)
    return next(new HttpError("you cannot delete this place", 401));

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await deletedPlace.deleteOne({ session: session });
    deletedPlace.user_id.places.pull(deletedPlace);
    await deletedPlace.user_id.save({ session: session });

    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Could not delete this place, try again", 500));
  }

  fs.unlink(deletedPlace.image, (err) => {
    console.log(err);
  });

  res.status(200).json({ message: "Place deleted" });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createNewPlace,
  updatePlace,
  deletePlace,
};
