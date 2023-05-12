import nextConnect from "next-connect";
import { getChannel } from "@/lib/controllers/contactController";
import auth from "@/middleware/auth";
const handler = nextConnect();

handler.use(auth).get(async (req, res) => {
  const user = await req.user;
  const { contactId } = req.query;

  try {
    const channel = await getChannel(user._id, contactId);
    res.json(channel);
  } catch (err) {
    res.json(err);
  }
});

export default handler;
