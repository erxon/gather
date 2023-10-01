import {
  getMatches,
  pastMatches,
} from "@/lib/controllers/faceRecognitionController";
import nextConnect from "next-connect";
import auth from "@/middleware/auth";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";

const handler = nextConnect();

handler
  .get((req, res, next) => {
    getMatches(req, res, next);
  })
  .get((req, res) => {
    pastMatches(req, res);
  });

export default handler;
