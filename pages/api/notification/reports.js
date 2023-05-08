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
      const data = await getNotifications('new-report');
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
  .use((req, res, next) => {
    const body = req.body;

    pusher
      .trigger("notification", "new-report", {
        body,
      })
      .then(() => {
        next();
      })
      .catch((err) => {
        res.json(err);
      });
  })
  .post(async (req, res) => {
    console.log(req.body);
    try {
      const data = await saveNotification({
        body: {
          reporter: req.body.reporter,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          lastSeen: req.body.lastSeen,
          reportId: req.body.reportId
        },
        channel: "notification",
        event: "new-report",
      });
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

export default handler;