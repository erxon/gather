import mongoose from "mongoose";

//channel, event, createdAt, name of the reporter, last seen, id of the report

const notificationSchema = new mongoose.Schema({
  channel: String,
  event: String,
  firstName: String,
  lastName: String,
  reporter: String,
  lastSeen: String,
  createdAt: Date,
  reportId: mongoose.Schema.Types.ObjectId
});

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
