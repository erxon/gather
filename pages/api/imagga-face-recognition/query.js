import {
  findMatches,
  saveMatchesToDB,
} from "@/lib/controllers/ImaggafaceRecognitionController";
import auth from "@/middleware/auth";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use((req, res, next) => {
    findMatches(req, res, next);
  })
  .post((req, res) => {
    saveMatchesToDB(req, res);
  });

export default handler;
