//This will return reports assigned to an authority
import { reportsAssigned } from "@/lib/controllers/reportController";
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
  .get((req, res) => {
    reportsAssigned(req, res);
  });

export default handler;
