import {
  remove,
  getReport,
  update,
} from "@/lib/controllers/report-management/tasksController";
import auth from "@/middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    getReport(req, res, next);
  })
  .get((req, res) => {})
  .put((req, res) => {
    update(req, res);
  })
  .delete((req, res) => {
    remove(req, res);
  });

export default handler;
