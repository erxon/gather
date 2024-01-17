import nextConnect from "next-connect";
import { pusher } from "@/utils/pusher";
import { saveConversation } from "@/lib/controllers/contactController";
const handler = nextConnect();

handler.post((req, res, next) => {
  //channelId, from, message
  const body = {
    message: req.body.message,
    from: req.body.from,
    createdAt: req.body.date
  };

  pusher
    .trigger(req.body.channelId, "chat", { body })
    .then(() => {
      next();
    })
    .catch((error) => {
      res.json(error);
    });
}).post(async (req, res) => {
    const {channelId, message, from } = req.body;
    try{
        await saveConversation(channelId, message, from)
        res.json({message: 'conversation saved'})
    } catch (err){
        res.json(err)
    }
});

export default handler;
