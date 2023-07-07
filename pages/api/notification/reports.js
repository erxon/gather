import { removeNotification } from "@/lib/controllers/notificationController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.delete(async (req, res) => {
  try {
    await removeNotification(req.body.id);
    res.status(200).json({message: "Deleted"})
  } catch (error) {
    res.status(400).json({ error: error, message: "Something went wrong." });
  }
});

export default handler;
