import Pusher from "pusher";
import PusherJS from "pusher-js";

const pusherJS = new PusherJS(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER,
});

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
});

export { pusherJS, pusher };
