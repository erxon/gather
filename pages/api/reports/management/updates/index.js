import { createUpdate } from "@/lib/controllers/report-management/updatesController";
import auth from "@/middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use(async (req, res, next) => {
    const user = await req.user;
    if (user && user.status === "verified") {
      next();
    } else {
      res.status(400).json({
        message: "user not authorized",
      });
    }
  })
  .post((req, res) => {
    createUpdate(req, res);
  });

export default handler;
