import {
  indexFaceIDs,
  trainFaceRecognition,
} from "@/lib/controllers/ImaggafaceRecognitionController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(async (req, res, next) => {
    indexFaceIDs(req, res, next);
  })
  .put((req, res) => {
    trainFaceRecognition(req, res);
  });

export default handler;
