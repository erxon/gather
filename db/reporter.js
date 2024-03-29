import mongoose from "mongoose";

const reporterSchema = new mongoose.Schema({
  photoUploaded: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" },
  location: String,
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
  position: {
    type: Map,
    of: Number,
  },
  reportMatchFound: Boolean,
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  possibleMatch: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  code: String,
  createdAt: Date,
  updatedAt: Date,
});

const Reporter =
  mongoose.models.Reporter || mongoose.model("Reporter", reporterSchema);

export default Reporter;
