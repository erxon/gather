import { findMatches } from "@/lib/controllers/ImaggafaceRecognitionController";
import auth from "@/middleware/auth";
import { isAuthority, isVerified } from "@/utils/api-helpers/authorize";
import nextConnect from "next-connect";

const handler = nextConnect();

handler
  .use(auth)
  .use(async (req, res, next) => {
    const user = await req.user;
    if (!user) {
      res.status(400).json({ error: "unauthorized" });
    } else {
      next();
    }
  })
  .use((req, res, next) => isVerified(req, res, next))
  .use((req, res, next) => isAuthority(req, res, next))
  .post((req, res) => {
    findMatches(req, res);
  });

export default handler;
