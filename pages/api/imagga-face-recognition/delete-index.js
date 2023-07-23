import {
  removeIndex,
} from "@/lib/controllers/ImaggafaceRecognitionController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.delete((req, res) => {
  removeIndex(req, res);
});

export default handler;
