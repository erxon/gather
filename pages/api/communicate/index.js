import nextConnect from "next-connect";
import {
  createChannel,
  deleteChannel,
  getChannel,
} from "@/lib/controllers/contactController";
const handler = nextConnect();

handler
  .post(async (req, res) => {
    const { currentUser, newContact } = req.body;
    try {
      await createChannel(currentUser, newContact);
      res.json({ message: "channel created" });
    } catch (err) {
      res.json(err);
    }
  })
  .get(async (req, res) => {
    const { currentUser, contact } = req.body;

    try {
      const channel = await getChannel(currentUser, contact);
      res.json(channel);
    } catch (err) {
      res.json(err);
    }
  })
  .delete(async (req, res) => {
    const { channelId } = req.body;

    try {
      const result = await deleteChannel(channelId);
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  });

export default handler;
