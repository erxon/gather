import nextConnect from "next-connect";
import auth from "@/middleware/auth";

const handler = nextConnect();

handler.use(auth).get(async (req, res) => {
  try {
    const user = await req.user;
    if (user) {
      res.json({ authenticated: true });
    } else {
      res.json({ authenticated: false });
    }
  } catch (err) {
    res.json(err)
  }
});

export default handler;
