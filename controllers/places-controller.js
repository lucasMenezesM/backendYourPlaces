import HttpError from "../models/http-error.js";
import { v4 as uuid } from "uuid";
import { validationResult } from "express-validator";

let DUMMY_PLACES = [
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
  {
    id: "p3",
    title: "Copa Cabana",
    description: "A beautiful beach in Rio de Janeiro",
    location: {
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
    location: {
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
    location: {
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
    location: {
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
    location: {
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
    location: {
      lat: -22.9515693,
      lgt: -43.2703127,
    },
    address:
      "Estr. da Cascatinha, 850 - Alto da Boa Vista, Rio de Janeiro - RJ",
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
const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;
  const places = DUMMY_PLACES.filter((place) => place.user_id === userId);

  if (places.length === 0) {
    return next(
      new HttpError("Could not find any place for the provided user id", 404)
    );
  }

  return res.status(200).send(places);
};

// CREATE A NEW PLACE
const createNewPlace = (req, res, next) => {
  // validation
  const result = validationResult(req).errors;
  if (result.length > 0) return next(new HttpError(result[0].msg, 400));

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

  res.status(201).json(createdPlace);
};

//UPDATE A PLACE
const updatePlace = (req, res, next) => {
  // validation
  const result = validationResult(req).errors;
  if (result.length > 0) return next(new HttpError(result[0].msg, 400));

  const placeId = req.params.placeId;
  const { title, description } = req.body;

  const updatedPlace = {
    ...DUMMY_PLACES.find((place) => place.id === placeId),
  };
  const placeIndex = DUMMY_PLACES.findIndex((place) => place.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = updatedPlace;
  res.json(DUMMY_PLACES);
};

//DELETE A PLACE
const deletePlace = (req, res) => {
  const { placeId } = req.params;
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
  res.status(200).json({ message: "Place deleted", DUMMY_PLACES });
};

export {
  getPlaceById,
  getPlacesByUserId,
  createNewPlace,
  updatePlace,
  deletePlace,
};
