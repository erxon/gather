import mongoose from "mongoose";

const foundMatchSchema = new mongoose.Schema({
  photoId: String,
  matches: [],
  status: String,
  createdAt: Date,
  updatedAt: Date,
});

const Match = mongoose.models.Match || mongoose.model('Match', foundMatchSchema)

export default Match