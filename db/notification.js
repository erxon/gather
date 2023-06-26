import mongoose from "mongoose";

//channel, event, createdAt, name of the reporter, last seen, id of the report

const notificationSchema = new mongoose.Schema({
  channel: String,
  event: String,
  type: String,
  body: {
    type: Map,
    of: String
  },
  createdAt: Date,
  reportId: mongoose.Schema.Types.ObjectId
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
