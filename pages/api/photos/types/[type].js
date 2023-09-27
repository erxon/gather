import { getPhotosByType } from "@/lib/controllers/photoController";
import auth from "@/middleware/auth";
import { isAuthorized } from "@/utils/api-helpers/authorize";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use((req, res, next) => {
    isAuthorized(req, res, next);
  })
  .get((req, res) => {
    getPhotosByType(req, res);
  });

export default handler;
