//Model for Photos
import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  publicId: String,
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  fileName: String,
  mpName: String,
});

const Photo = mongoose.models.Photo || mongoose.model("Photo", photoSchema);

export default Photo;
