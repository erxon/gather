import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reportId: {type: mongoose.Schema.Types.ObjectId, ref: "Report"},
  text: String,
  video: String,
  image: String,
  createdAt: Date,
  updatedAt: Date,
});

const Update = mongoose.models.Update || mongoose.model("Update", updateSchema);

export default Update;
