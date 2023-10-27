//report of an authenticated user
//report of an anonymous user
//the status of the report should be for verification first
//file upload
import dbConnect from "@/db/dbConnect";
import Report from "@/db/report";
import Notification from "@/db/notification";
import { pusher } from "@/utils/pusher";
import formidable from "formidable";
import fs from "fs";

export async function createReport(req, res, next) {
  const user = await req.user;
  const data = {
    ...req.body,
    account: user ? user._id : null,
    username: user ? user.username : null,
    reportedAt: new Date(),
  };

  try {
    let newReport = new Report(data);
    const result = await newReport.save();
    req.result = result;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

const pusherTrigger = (body) => {
  pusher.trigger("notification-authority", "new-report", {
    body: {
      type: "report-manage",
      channel: "notification-authority",
      body,
      createdAt: new Date(),
    },
  });
};

const saveNotificationToDatabase = async (res, body) => {
  try {
    await dbConnect();
    const newNotification = new Notification({
      type: "report-manage",
      channel: "notification-authority",
      event: "new-report",
      body: body,
      reportId: body.reportId,
      createdAt: new Date(),
    });

    await newNotification.save();
  } catch (error) {
    console.log(error);
    res.json(400).json(error);
  }
};

export async function triggerNotification(req, res) {
  try {
    const body = {
      type: "new-report",
      title: "New Report",
      reportId: req.result._id,
      firstName: req.result.firstName,
      middleName: req.result.middleName,
      lastName: req.result.lastName,
      reporter: req.result.username,
    };

    pusherTrigger(body);
    await saveNotificationToDatabase(res, body);

    return res
      .status(200)
      .json({ data: req.result, message: "New report is added" });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
}

export function getReports() {
  const data = dbConnect()
    .then(async () => {
      const getReports = await Report.find();
      return getReports;
    })
    .catch((err) => {
      return err;
    });

  return data;
}

export function getReportsByUsername(username) {
  const data = dbConnect()
    .then(async () => {
      const getReports = await Report.find({ username: username });

      return getReports;
    })
    .catch((err) => {
      return err;
    });

  return data;
}

export function getReportById(id) {
  const data = dbConnect()
    .then(async () => {
      const getReport = await Report.findById(id)
        .populate("updatedBy", "_id username type firstName lastName photo")
        .exec();

      return getReport;
    })
    .catch((err) => {
      return err;
    });

  return data;
}

export function updateReport(id, update, userId) {
  const data = dbConnect()
    .then(async () => {
      try {
        const updatedReport = await Report.findByIdAndUpdate(
          { _id: id },
          { ...update, updatedBy: userId, updatedAt: new Date() }
        );
        return updatedReport;
      } catch (err) {
        return err;
      }
    })
    .catch((err) => {
      return err;
    });

  return data;
}

export function deleteReport(id) {
  const data = dbConnect()
    .then(async () => {
      const deleteReport = await Report.findByIdAndRemove(id);
      return deleteReport;
    })
    .catch((err) => {
      return err;
    });
  return data;
}

export function findReportWithReporter(id) {
  const data = dbConnect()
    .then(async () => {
      const report = await Report.findById(id).populate("reporter").exec();
      return report;
    })
    .catch((err) => {
      return err;
    });
  return data;
}

export function getActiveReports() {
  const data = dbConnect()
    .then(async () => {
      const activeReports = await Report.find({ status: "active" });
      return activeReports;
    })
    .catch((err) => {
      return err;
    });
  return data;
}

export async function isAuthorized(req, res, next) {
  try {
    await dbConnect();

    const report = await Report.findById(req.body.id);
    const user = await req.user;

    if (report.account === user._id) {
      next();
    } else {
      res.status(400).json({ error: "unauthorized user." });
    }
  } catch (error) {
    res.status(400).json({ error: error, message: "something went wrong." });
  }
}

export async function reportsAssigned(req, res) {
  const { uid } = req.query;
  try {
    await dbConnect();

    const reports = await Report.find(
      { assignedTo: uid },
      "_id firstName lastName age gender lastSeen photo"
    );
    res.status(200).json(reports);
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
}

export async function searchReport(req, res) {
  try {
    await dbConnect();

    const report = await Report.find({ ...req.body });

    return res.status(200).json(report);
  } catch (error) {
    return res
      .status(400)
      .json({ error: error, message: "Something went wrong." });
  }
}

export function addDentalAndFingerprintRecord(req, res) {
  const { reportId } = req.query;
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, async (error, fields, files) => {
    if (error) {
      return res.status(400).json({
        error: "File could not be uploaded",
      });
    }

    const report = await Report.findById(reportId);

    if (files.file) {
      report.dentalAndFingerprint.data = fs.readFileSync(files.file.filepath);
      report.dentalAndFingerprint.contentType = files.file.mimetype;
    }

    try {
      let result = await report.save();
      res.json(result);
    } catch (err) {
      res.status(400).json({
        error: err,
      });
    }
  });
}

export async function displayFile(req, res) {
  const { reportId } = req.query;
  try {
    await dbConnect();

    const getReport = await Report.findById(reportId);
    res.setHeader("Content-Type", getReport.dentalAndFingerprint.contentType);
    return res.send(getReport.dentalAndFingerprint.data);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error, message: "Can't view file." });
  }
}

export async function archivedReports(req, res) {
  try {
    await dbConnect();

    const reports = await Report.find({ status: "archive" });

    return res.status(200).json(reports);
  } catch (error) {
    return res.status(400).json(error);
  }
}
