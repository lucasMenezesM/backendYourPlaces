import HttpError from "../models/http-error.js";
import { v4 as uuid } from "uuid";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "aldeia da folha",
    description: "a aldeia liderada pelo hokage naruto uzumaki da folha",
    location: {
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
    location: {
      lat: -12.5953411,
      lgt: -71.4770275,
    },
    address:
      "Sítio Aldeia da Folha Soído (Zona Rural, Domingos Martins - ES, 29260-000",
    user_id: "u2",
  },
];

// GET A PLACE BY ITS ID
const getPlaceById = (req, res, next) => {
  const id = req.params.placeId;
  const place = DUMMY_PLACES.find((place) => place.id === id);

  if (!place) {
    return next(
      new HttpError("Could not find a place for the provided place id", 404)
    );
  }

  res.status(200).json({ place: place });
};

// GET PLACES BY A SPECIFIC USER ID
const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const places = DUMMY_PLACES.filter((place) => place.user_id === userId);

  if (places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id", 404)
    );
  }

  return res.status(200).send(places);
};

// CREATE A NEW PLACE
const createNewPlace = (req, res, next) => {
  const { title, address, description, location, user_id } = req.body;

  const createdPlace = {
    id: uuid(),
    title,
    description,
    address,
    location,
    user_id,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(202).json(createdPlace);
};

export { getPlaceById, getPlaceByUserId, createNewPlace };
