import auth from "@/middleware/auth";
import nextConnect from "next-connect";
import { updateMatches } from "@/lib/controllers/faceRecognitionController";
import { checkStatus, checkType } from "@/utils/api-helpers/authorize";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    checkType(req, res, next);
  })
  .use((req, res, next) => {
    checkStatus(req, res, next);
  })
  .put((req, res) => {
    updateMatches(req, res);
  });

export default handler;
