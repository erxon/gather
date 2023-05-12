import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  conversation: [
    {
      from: String,
      message: String,
      createdAt: Date,
    },
  ],
});

const Channel =
  mongoose.models.Channel || mongoose.model("Channel", channelSchema);

export default Channel;
