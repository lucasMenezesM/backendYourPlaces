import HttpError from "../models/http-error.js";
import axios from "axios";

export default async function getCoordByAddress(address) {
  const location = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${address}&format=jsonv2`
  );
  console.log(location.data);

  if (location.data.length === 0) {
    throw new HttpError(
      "Could not find any place with the specified address",
      404
    );
  }

  return { lat: location.data[0].lat, lng: location.data[0].lon };
}
