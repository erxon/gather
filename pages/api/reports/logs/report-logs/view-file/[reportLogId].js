import { displayFile } from "@/lib/controllers/reportLogController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get((req, res) => {
  displayFile(req, res);
});

export default handler;
