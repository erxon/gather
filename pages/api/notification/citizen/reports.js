import {
  saveNotification,
  getNotifications,
} from "@/lib/controllers/notificationController";
import nextConnect from "next-connect";
import { pusher } from "@/utils/pusher";

const handler = nextConnect();

handler
  .post(async (req, res, next) => {
    console.log(req.body);
    try {
      const data = await saveNotification({
        body: {
          status: req.body.status,
          reporter: req.body.reporter,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          lastSeen: req.body.lastSeen,
          reportId: req.body.reportId,
        },
        createdAt: Date.now(),
        type: "report-manage",
        channel: "notification-citizen",
        event: "active-report",
      });
      req.notification = data;
      next();
    } catch (err) {
      res.json(err);
    }
  })
  .post((req, res) => {
    const body = req.notification;

    pusher
      .trigger("notification-citizen", "active-report", {
        body,
      })
      .then(() => {
        res.status(200).json({ message: "okay" });
      })
      .catch((err) => {
        res.json(err);
      });
  });

export default handler;
