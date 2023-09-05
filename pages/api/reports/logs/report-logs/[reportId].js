import nextConnect from "next-connect";
import { getLogs } from "@/lib/controllers/reportLogController";
import auth from "@/middleware/auth";
import { isAuthority } from "@/utils/api-helpers/authorize";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    isAuthority(req, res, next)
  })
  .get((req, res) => {
    getLogs(req, res);
  })

export default handler;
