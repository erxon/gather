import auth from "@/middleware/auth";
import { pusher } from "@/utils/pusher";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(auth).post(async (req, res) => {
  const socketId = req.body.socket_id;
  const user = await req.user;

  const authResponse = pusher.authenticateUser(socketId, {
    id: user._id,
    user_info: {
      username: user.username,
      email: user.email,
    },
  });
  res.send(authResponse);
});
