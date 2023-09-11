import { attachDocument } from "@/lib/controllers/reportLogController";
import auth from "@/middleware/auth";
import nextConnect from "next-connect";


const handler = nextConnect();

handler
  .use(auth)
  .use(async (req, res, next) => {
    const user = await req.user;
    if (user) {
      next();
    } else {
      res.status(400).json({ error: "unauthorized" });
    }
  })
  .post((req, res) => {
    attachDocument(req, res);
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
