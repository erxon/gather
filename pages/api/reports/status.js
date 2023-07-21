import { saveNotification } from "@/lib/controllers/notificationController";
import { updateReport } from "@/lib/controllers/reportController";
import { newActiveReport } from "@/lib/controllers/smsNotification";
import auth from "@/middleware/auth";
import { pusher } from "@/utils/pusher";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    //Uncomment this to enable messaging notifications
    //if req.body.status === "active", send messages to verified citizens
    // if (req.body.status === "active") {
    //   return newActiveReport(req, res, next);
    // }
    next();
  })
  .put(async (req, res) => {
    try {
      const result = await updateReport(req.body.id, {
        status: req.body.status,
      });
      const notificationContent = {
        body: {
          title: "New active report",
          firstName: result.firstName,
          lastName: result.lastName,
          lastSeen: result.lastSeen,
          reporter: result.reporter,
          reportId: result._id,
          photo: result.photoUploaded,
          type: "status-change",
        },
        type: "status-change",
        channel: "notification",
        event: "status-change",
      };
      if (req.body.status === "active") {
        const body = { ...notificationContent, createdAt: Date.now() };
        pusher
          .trigger(
            ["notification-citizen", "notification-authority"],
            "status-change",
            { body }
          )
          .then(async () => {
            const result = await saveNotification(notificationContent);
            res.status(200).json(result);
          });
      } else {
        res.status(200).json({ message: "okay" });
      }
    } catch (error) {
      res.status(400).json({ error: error, message: "Something went wrong." });
    }
  });

export default handler;
