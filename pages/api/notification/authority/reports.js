//trigger a message to new-report event
import nextConnect from "next-connect";
import {
  saveNotification,
  getNotifications,
  removeNotification,
} from "@/lib/controllers/notificationController";
import { pusher } from "@/utils/pusher";

const handler = nextConnect();

handler
  .get(async (req, res) => {
    try {
      const data = await getNotifications('notification-authority', 'new-report');
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  })
  .delete(async (req, res) => {
    try {
      const data = await removeNotification(req.body.id);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  })
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
          reportId: req.body.reportId
        },
        createdAt: Date.now(),
        type: "report-manage",
        channel: "notification-authority",
        event: "new-report",
      });
      req.notification = data
      next()
    } catch (err) {
      res.json(err);
    }
  })
  .post((req, res) => {
    const body = req.notification;

    pusher
      .trigger("notification-authority", "new-report", {
        body
      })
      .then(() => {
        res.status(200).json({message: "okay"})
      })
      .catch((err) => {
        res.json(err);
      });
  })
  

export default handler;
