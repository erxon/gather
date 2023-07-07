import nextConnect from "next-connect";
import { pusher } from "@/utils/pusher";
import {
  saveNotification,
  removeNotification,
  getNotifications,
} from "@/lib/controllers/notificationController";

import auth from "@/middleware/auth";
const handler = nextConnect();

handler
  .use(auth)
  .get(async (req, res) => {
    const user = await req.user;
    try {
      const data = await getNotifications(
        `contact-${user._id}`,
        "contact-requested"
      );
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  })
  .use(async (req, res, next) => {
    try {
      const data = await saveNotification({
        body: {
          eventName: "contact-requested",
          title: "Contact Request",
          message: req.body.message,
          userId: req.body.userId,
          from: req.body.from,
          photo: req.body.photo,
        },
        channel: `contact-${req.body.userId}`,
        event: "contact-requested",
      });
      req.contactReq = data;
      next();
    } catch (err) {
      res.json(err);
    }
  })
  .post((req, res) => {
    //trigger a add to contact request notification to the receiving user
    const body = req.contactReq;
    pusher
      .trigger(`contact-${req.body.userId}`, "contact-requested", {body})
      .then(() => {
        res.end
      })
      .catch((err) => {
        res.json(err);
      });
  })
  .delete(async (req, res) => {
    try {
      const data = await removeNotification(req.body.id);
      res.json(data);
    } catch (err) {
      res.json(err);
    }
  });

export default handler;
