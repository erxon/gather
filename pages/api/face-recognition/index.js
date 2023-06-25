import nextConnect from "next-connect";
import { getMatches, readMatches, storeMatches } from "@/lib/controllers/faceRecognitionController";
import auth from "@/middleware/auth";
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
  .use((req, res, next) => {
    getMatches(req, res, next);
  })
  .use((req, res, next) => {
    readMatches(req, res, next);
  })
  .post((req, res) => {
    storeMatches(req, res);
  })
  
export default handler;
