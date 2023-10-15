import nextConnect from "next-connect";
import { getReporterByFoundReportCode } from "@/lib/controllers/reporterController";

const handler = nextConnect();

handler.get((req, res) => {
  getReporterByFoundReportCode(req, res);
});

export default handler;
