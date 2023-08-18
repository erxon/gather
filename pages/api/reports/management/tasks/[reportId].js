import nextConnect from "next-connect";
import auth from "@/middleware/auth";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";
import { isAuthorized } from "@/lib/controllers/reportController";
import {
  createTask,
  getTasks,
} from "@/lib/controllers/report-management/tasksController";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    isVerified(req, res, next);
  })
  .use((req, res, next) => {
    isAuthority(req, res, next);
  })
  .get((req, res) => {
    getTasks(req, res);
  })
  .post((req, res) => {
    createTask(req, res);
  });

export default handler;
