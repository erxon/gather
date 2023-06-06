import mongoose from "mongoose";

const reporterSchema = mongoose.Schema({
  photoUploaded: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" },
  username: { type: String, ref: "User" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  relationToMissing: String,
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  socialMediaAccount: [String],
  createdAt: Date,
  updatedAt: Date,
});

const Reporter =
  mongoose.models.Reporter || mongoose.model("Reporter", reporterSchema);

export default Reporter;
