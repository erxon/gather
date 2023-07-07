import { getNotificationsForContacts } from "@/lib/controllers/notificationController";
import auth from "@/middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(auth).get((req, res) => {
  getNotificationsForContacts(req, res);
});

export default handler;
