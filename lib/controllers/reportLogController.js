import ReportLog from "@/db/reportLog";
import dbConnect from "@/db/dbConnect";

const createLog = async (req, res) => {
  try {
    await dbConnect();

    const newLog = new ReportLog({
      reportId: req.body.reportId,
      editor: req.currentUser._id,
      oldState: req.body.oldState,
      changes: req.body.changes,
      createdAt: new Date(),
    });

    const savedNewLog = await newLog.save();

    res
      .status(200)
      .json({ message: "Log created successfully.", log: savedNewLog });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong.", error: error });
  }
};

const getLogs = async (req, res) => {
  const { reportId } = req.query;

  try {
    await dbConnect();

    const getReportLogs = await ReportLog.find({ reportId: reportId })
    .populate("editor", "username firstName lastName photo")
    .exec();

    res.status(200).json({logs: getReportLogs})
  } catch (error) {
    res.status(400).json({error: error, message: "Something went wrong"})
  }
};

const deleteLog = async () => {};

const bulkDeleteLogs = async () => {};

const updateLog = async () => {};

export { createLog, getLogs, deleteLog, bulkDeleteLogs, updateLog };
