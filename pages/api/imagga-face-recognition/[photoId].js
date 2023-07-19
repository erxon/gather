import {
  generateMultipleFaceID,
  saveToDB,
} from "@/lib/controllers/ImaggafaceRecognitionController";
import auth from "@/middleware/auth";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use((req, res, next) => {
    generateMultipleFaceID(req, res, next);
  })
  .get((req, res) => {
    saveToDB(req, res);
  });

export default handler;
