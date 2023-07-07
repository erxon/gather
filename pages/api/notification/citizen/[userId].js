import {
  getNotificationsByChannel,
  getNotifications,
} from "@/lib/controllers/notificationController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
  const { userId } = req.query;
  try {
    const activeReportsNotifications = await getNotifications(
      "notification-citizen",
      "active-report"
    );
    const userDirectedNotifications = await getNotificationsByChannel(
      `notification-citizen-${userId}`
    );
    const result = [...activeReportsNotifications,...userDirectedNotifications]
    res
      .status(200)
      .json(result);
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
});

export default handler;
