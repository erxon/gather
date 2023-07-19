import mongoose from "mongoose";

const searcResultsSchema = new mongoose.Schema({
  photoId: String,
  result: [],
  createdAt: Date,
  updatedAt: Date,
});

const Match =
  mongoose.models.Match || mongoose.model("Match", searcResultsSchema);

export default Match;
