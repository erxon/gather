import dbConnect from "@/db/dbConnect";
import Notification from "@/db/notification";
import Reporter from "@/db/reporter";
import { pusher } from "@/utils/pusher";

export async function triggerNotification(req, res, next) {
  const body = { ...req.body, title: "Report photo", type: "upload-photo" };
  try {
    pusher
      .trigger("notification-authority", "new-report", {
        body: { body, createdAt: Date.now(), type: "upload-photo" },
      })
      .then(() => {
        next();
      })
      .catch((error) => {
        res
          .status(400)
          .json({ error: error, message: "Something went wrong." });
      });
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
}

export async function saveNotification(req, res, next) {
  try {
    await dbConnect();

    const notification = Notification({
      channel: "notification-authority",
      event: "new-report",
      type: "upload-photo",
      body: {
        title: "Report photo",
        type: "upload-photo",
        ...req.body,
      },
      createdAt: Date.now(),
    });

    await notification.save();
    next();
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
}

export async function addReporter(req, res) {
  try {
    await dbConnect();
    const reporter = {
      ...req.body,
      createdAt: new Date(),
    };
    const newReporter = Reporter(reporter);
    const result = await newReporter.save();

    res
      .status(200)
      .json({ message: "Photo successfully uploaded", result: result });
  } catch (error) {
    res.status(400).json({ message: "Something went wrong", error: error });
  }
}
export function getReporters() {
  const data = dbConnect()
    .then(async () => {
      const reporter = await Reporter.find();
      return reporter;
    })
    .catch((err) => {
      return err;
    });
  return data;
}
export function getReporterById(id) {
  const data = dbConnect()
    .then(async () => {
      const reporter = await Reporter.findById(id);
      return reporter;
    })
    .catch((err) => {
      return err;
    });
  return data;
}
export function editReporter(id, update) {
  const data = dbConnect()
    .then(async () => {
      const reporter = await Reporter.findByIdAndUpdate(id, update);
      return reporter;
    })
    .catch((err) => {
      return err;
    });

  return data;
}
export function deleteReporter(id) {
  const data = dbConnect()
    .then(async () => {
      const reporter = await Reporter.findByIdAndRemove(id);
      return reporter;
    })
    .catch((err) => {
      return err;
    });
  return data;
}

export async function getReporterByUploadedPhoto(req, res) {
  const { photo } = req.query;
  try {
    await dbConnect();
    const reporter = await Reporter.findOne({ photoUploaded: photo });

    res.status(200).json(reporter);
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
}
