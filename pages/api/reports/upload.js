import nextConnect from "next-connect";
import {
  addReporter,
  triggerNotification,
  saveNotification
} from "@/lib/controllers/reporterController";

const handler = nextConnect();

handler
  .post((req, res, next) => {
    triggerNotification(req, res, next);
  })
  .post((req, res, next) => {
    saveNotification(req, res, next);
  })
  .post((req, res) => {
    addReporter(req, res);
  });

export default handler;
