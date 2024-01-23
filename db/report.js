import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "Reporter" },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "under verification", "active", "close", "archive"],
  },
  result: {
    type: String,
    default: "undefined",
    enum: ["undefined", "found", "not found"],
  },
  state: {
    type: String,
    default: "undefined",
    enum: ["undefined", "deceased", "alive"],
  },
  found: Boolean,
  username: { type: String, ref: "User" },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  photo: {
    type: String,
  },
  photoId: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" },
  referencePhotos: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  middleName: { type: String },
  qualifier: String,
  aliases: [String],
  smt: [String],
  currentHairColor: String,
  eyeColor: String,
  prostheticsAndImplants: [String],
  bloodType: String,
  medications: [String],
  accessories: [String],
  lastKnownClothing: String,
  birthDefects: [String],
  dentalAndFingerprint: {
    data: Buffer,
    contentType: String,
  },
  details: String,
  condition: String,
  reportedAt: Date,
  updatedAt: Date,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastSeen: {
    type: String,
  },
  lastSeenDateTime: Date,
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"]
  },
  features: [String],
  email: String,
  contactNumber: String,
  socialMediaAccounts: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Photo" },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  editors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  attachedDocument: { data: Buffer, contentType: String },
  location: {
    type: Map,
    of: Number,
  },
  completed: { type: Boolean, default: false },
});

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
