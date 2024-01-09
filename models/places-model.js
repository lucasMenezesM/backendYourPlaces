import mongoose, { Schema } from "mongoose";

const placeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  image: { type: String, required: true },
  coordinates: {
    lat: { type: String, required: true },
    lng: { type: String, required: true },
  },
  user_id: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
});

export default mongoose.model("Place", placeSchema);
