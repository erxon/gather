import auth from "@/middleware/auth";
import nextConnect from "next-connect";
import { updateMatches } from "@/lib/controllers/faceRecognitionController";
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
  .put((req, res) => {
    updateMatches(req, res);
  });

export default handler;
