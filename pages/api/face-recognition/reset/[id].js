import { resetMatches } from "@/lib/controllers/faceRecognitionController";
import auth from "@/middleware/auth";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    isAuthority(req, res, next);
  })
  .use((req, res, next) => {
    isVerified(req, res, next);
  })
  .delete((req, res) => {
    resetMatches(req, res);
  });

export default handler;