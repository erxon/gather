import mongoose from "mongoose";

const foundMatchSchema = new mongoose.Schema({
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" },
  matches: [
    {
      reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
    },
  ],
  createdAt: Date,
  updatedAt: Date,
});

const Match = mongoose.models.Match || mongoose.model('Match', foundMatchSchema)

export default Match