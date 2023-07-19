import mongoose from "mongoose";

const faceRecognitionSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  faceIDs: [String],
});

const FaceRecognition =
  mongoose.models.FaceRecognition ||
  mongoose.model("FaceRecognition", faceRecognitionSchema);

export default FaceRecognition;
