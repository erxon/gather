import nextConnect from "next-connect";
import { createLog } from "@/lib/controllers/reportLogController";
import auth from "@/middleware/auth";

const handler = nextConnect();

handler
  .use(auth)
  .use(async (req, res, next) => {
    const user = await req.user;
    if (user && user.type === "authority") {
      req.currentUser = user;
      next();
    } else {
      res.status(400).json({ error: "unauthorized user" });
    }
  })
  .post((req, res) => {
    createLog(req, res);
  });

export default handler;
