import { getArchives } from "@/lib/controllers/archiveController";
import auth from "@/middleware/auth";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.use(auth).get((req, res) => {
  getArchives(req, res);
});

export default handler;
