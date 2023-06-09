import nextConnect from "next-connect";
import { findMatches, storeMatches } from "@/lib/controllers/faceRecognitionController";
import auth from "@/middleware/auth";
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
    findMatches(req, res, next);
  })
  .get((req, res) => {
    storeMatches(req, res);
  })
  
export default handler;
