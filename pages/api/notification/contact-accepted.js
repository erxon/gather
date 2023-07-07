import nextConnect from "next-connect";
import { pusher } from "@/utils/pusher";
import {
  getNotifications,
  saveNotification,
  removeAll,
} from "@/lib/controllers/notificationController";
import auth from "@/middleware/auth";
const handler = nextConnect();

handler
  .use(auth)
  .get(async (req, res) => {
    try {
      const user = await req.user;
      try {
        let result = await getNotifications(
          `contact-${user._id}`,
          "request-accepted"
        );
        res.json(result);
      } catch (error) {
        res.json(error);
      }
    } catch (error) {
      res.json(error);
    }
  })
  .post(async (req, res, next) => {
    try {
      const result = await saveNotification({
        body: {
          eventName: "request-accepted",
          title: "Request Accepted",
          message: req.body.message,
          from: req.body.userId,
          to: req.body.sendTo,
          photo: req.body.photo,
        },
        channel: `contact-${req.body.sendTo}`,
        event: "request-accepted",
      });
      req.notification = result;
      next();
    } catch (error) {
      res.json(error);
    }
  })
  .post((req, res) => {
    const body = req.notification;
    console.log(req.body.sendTo)
    pusher
      .trigger(`contact-${req.body.sendTo}`, "request-accepted", {
        body,
      })
      .then(() => {
        return res.status(200).json({message: "okay"})
      })
      .catch((error) => {
        res.json(error);
      });
  })
  .delete(async (req, res) => {
    try {
      const result = await removeAll(req.body.channel, req.body.event);
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  });

export default handler;
