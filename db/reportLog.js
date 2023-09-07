import mongoose from "mongoose";

const reportLogSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: "Report" },
  editor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  note: {
    content: String,
    viewer: {
      type: String,
      enum: ["all", "authority", "citizen", "assigned", "reporter"],
    },
  },
  oldState: String,
  changes: String,
  createdAt: Date,
  updatedAt: Date,
});

const ReportLog =
  mongoose.models.ReportLog || mongoose.model("ReportLog", reportLogSchema);

export default ReportLog;
