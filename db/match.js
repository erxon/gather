import mongoose from "mongoose";

const searchResultsSchema = new mongoose.Schema({
  photoId: String,
  result: [],
  createdAt: Date,
  updatedAt: Date,
});

const Match = mongoose.models.Match || mongoose.model("Match", searchResultsSchema);

export default Match;
