import nextConnect from "next-connect";
import { pusher } from "@/utils/pusher";
import {
  getNotifications,
  saveNotification,
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
          `notification-accepted-${user._id}`,
          "request-accepted"
        );
        res.json(result)
      } catch (error) {
        res.json(error);
      }
    } catch (error) {
      res.json(error);
    }
  })
  .use((req, res, next) => {
    const body = req.body;
    console.log(body);
    pusher
      .trigger(`notification-accepted-${body.contactId}`, "request-accepted", {
        body,
      })
      .then(() => {
        next();
      })
      .catch((error) => {
        res.json(error);
      });
  })
  .post(async (req, res) => {
    try {
      const result = await saveNotification({
        body: {
          message: req.body.message,
          from: req.body.userId,
          to: req.body.contactId,
          photo: req.body.photo,
        },
        channel: `notification-accepted-${req.body.contactId}`,
        event: "request-accepted",
      });
      res.json(result);
    } catch (error) {
      res.json(error);
    }
  });

export default handler;
