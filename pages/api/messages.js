import Pusher from "pusher";
import nextConnect from "next-connect";

const handler = nextConnect();

const pusher = new Pusher({
  appId: "1580630",
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap1",
  useTLS: true
});

handler.post(async (req, res) => {
    await pusher.trigger("chat", "message", {
        username: req.body.username,
        message: req.body.message
      });

    res.json({body: []});
});

export default handler;


