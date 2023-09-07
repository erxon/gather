import nextConnect from "next-connect";
import { getLogs } from "@/lib/controllers/reportLogController";
import auth from "@/middleware/auth";
import { isAuthority } from "@/utils/api-helpers/authorize";

const handler = nextConnect();

handler
  .use(auth)
  .use( async (req, res, next) => {
    const user = await req.user
    if (user) {
      next()
    } else {
      res.status(400).json({error: "unauthorized"})
    }
  })
  .get((req, res) => {
    getLogs(req, res);
  })

export default handler;
