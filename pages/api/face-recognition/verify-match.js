import nextConnect from "next-connect";
import {
  saveNotification,
  notifyReporter,
  verifyMatch,
} from "@/lib/controllers/faceRecognitionController";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    isAuthority(req, res, next);
  })
  .use((req, res, next) => {
    isVerified(req, res, next);
  })
  .use((req, res, next) => {
    notifyReporter(req, res, next);
  })
  .use((req, res, next) => {
    saveNotification(req, res, next);
  })
  .put((req, res) => {
    verifyMatch(req, res);
  });

export default handler;
