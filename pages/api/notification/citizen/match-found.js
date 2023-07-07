import nextConnect from "next-connect";
import {
  notifyReporter,
  saveNotification,
} from "@/lib/controllers/faceRecognitionController";

const handler = nextConnect();

handler
  .post((req, res, next) => {
    notifyReporter(req, res, next);
  })
  .post((req, res, next) => {
    saveNotification(req, res, next);
  });

export default handler;
