import nextConnect from "next-connect";
import {
  notifyReporter,
  saveNotification,
  verifyMatch,
} from "@/lib/controllers/faceRecognitionController";

const handler = nextConnect();

handler
  .use((req, res, next) => {
    notifyReporter(req, res, next);
  })
  .use((req, res, next) => {
    saveNotification(req, res, next);
  })

export default handler;
