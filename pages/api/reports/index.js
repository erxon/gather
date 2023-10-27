import nextConnect from "next-connect";
import { createReport, getReports, triggerNotification } from "@/lib/controllers/reportController";
import { newReport } from "@/lib/controllers/smsNotification";
import auth from "@/middleware/auth";

const handler = nextConnect();

handler
  .use(auth)
  .post((req, res, next) => {
    createReport(req, res, next)
  })
  .post((req, res) => {
    //trigger notification
    triggerNotification(req, res)
  })
  .get((req, res) => {
    //get all reports
    getReports()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(err);
      });
  });

export default handler;
