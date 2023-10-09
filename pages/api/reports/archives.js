import { archivedReports } from "@/lib/controllers/reportController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get((req, res) => {
  archivedReports(req, res);
});

export default handler;
