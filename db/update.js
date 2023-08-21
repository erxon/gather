import mongoose from "mongoose";

const updateSchema = new mongoose.Schema({
  text: String,
  video: String,
  image: String,
  createdAt: Date,
  updatedAt: Date,
});

const Update = mongoose.models.Update || mongoose.model("Update", updateSchema);

export default Update;
