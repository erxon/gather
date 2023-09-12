import auth from "@/middleware/auth";
import nextConnect from "next-connect";
import { searchReport } from "@/lib/controllers/reportController";
import { isAuthorized } from "@/utils/api-helpers/authorize";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    isAuthorized(req, res, next);
  })
  .post((req, res) => {
    //controller
    searchReport(req, res);
  });

export default handler;
