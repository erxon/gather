import Pusher from "pusher";
import PusherJS from "pusher-js";

const pusherJS = new PusherJS(process.env.NEXT_PUBLIC_PUSHER_KEY, {
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  secret: process.env.NEXT_PUBLIC_PUSHER_SECRET,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

export { pusherJS, pusher };
