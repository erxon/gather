import nextConnect from "next-connect";
import { pusher } from "@/utils/pusher";
import { saveNotification } from "@/lib/controllers/notificationController";
const handler = nextConnect();

handler
  .use((req, res, next) => {
    //trigger a add to contact request notification to the receiving user
    const body = req.body;
    pusher
      .trigger(`notification-${body.userId}`, 'contact-requested', { body })
      .then((data) => {
        next();
      })
      .catch((err) => {
        res.json(err);
      });
  })
  .post(async (req, res) => {
    try{
        const data = await saveNotification({
            body: {
                message: req.body.message,
                userId: req.body.userId
            },
            channel: `notification-${req.body.userId}`,
            event: 'contact-requested'
        })
        res.json(data)
    } catch(err){
        res.json(err)
    }
  });

export default handler;
