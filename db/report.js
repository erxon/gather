import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: "Reporter" },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "under verification", "active", "close", "archived"],
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
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true,
  },
  middleName: { type: String, require: true },
  qualifier: String,
  aliases: [String],
  smt: [String],
  currentHairColor: String,
  eyeColor: String,
  prostheticsAndImplants: String,
  bloodType: String,
  medications: String,
  clothingAndAccessories: String,
  birthDefects: String,
  dentalAndFingerprint: String,
  details: String,
  condition: String,
  reportedAt: Date,
  updatedAt: Date,
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastSeen: {
    type: String,
  },
  age: {
    type: String,
  },
  gender: {
    type: String,
  },
  features: [String],
  email: String,
  contactNumber: String,
  socialMediaAccounts: {
    facebook: String,
    twitter: String,
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  editors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  attachedDocument: { data: Buffer, contentType: String },
});

const Report = mongoose.models.Report || mongoose.model("Report", reportSchema);

export default Report;
