import ReportLog from "@/db/reportLog";
import dbConnect from "@/db/dbConnect";
import formidable from "formidable";
import fs from "fs";

const createLog = async (req, res) => {
  try {
    await dbConnect();

    const newLog = new ReportLog({
      reportId: req.body.reportId,
      editor: req.currentUser._id,
      note: {
        content: req.body.noteContent,
        viewer: req.body.noteViewer,
      },
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
      .sort({ createdAt: -1 })
      .populate("editor", "username firstName lastName photo")
      .exec();

    res.status(200).json({ logs: getReportLogs });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong" });
  }
};

const deleteLog = async () => {};

const bulkDeleteLogs = async () => {};

const updateLog = async () => {};

const attachDocument = (req, res) => {
  const { reportLogId } = req.query;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "File could not be uploaded",
      });
    }
    const reportLog = await ReportLog.findById(reportLogId);
    console.log(files);
    if (files.file) {
      reportLog.attachedDocument.data = fs.readFileSync(files.file.filepath);
      reportLog.attachedDocument.contentType = files.file.mimetype;
    }
    try {
      let result = await reportLog.save();
      res.json(result);
    } catch (err) {
      res.status(400).json({
        error: err,
      });
    }
  });
};

const displayFile = async (req, res) => {
  const { reportLogId } = req.query;
  try {
    await dbConnect();

    const getReportLog = await ReportLog.findById(reportLogId);
    res.setHeader("Content-Type", getReportLog.attachedDocument.contentType);
    return res.send(getReportLog.attachedDocument.data);

  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error, message: "Can't view file." });
  }
};

export {
  createLog,
  getLogs,
  deleteLog,
  bulkDeleteLogs,
  updateLog,
  attachDocument,
  displayFile,
};
