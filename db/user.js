import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  photo: {
    data: Buffer,
    contentType: String,
  },
  validPhoto: String,
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  contactNumber: String,
  socialMediaAccounts: {
    facebook: String,
    twitter: String,
    instagram: String,
  },
  type: { type: String, enum: ["authority", "citizen"] },
  about: String,
  contacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  firstName: String,
  lastName: String,
  MiddleName: String,
  createdAt: Date,
  updatedAt: Date,
  salt: String,
  hash: String,
  status: { type: String, enum: ["unverified", "verified"] },
  contactRequests: []
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
