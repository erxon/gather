import { getDataSummary } from "@/lib/controllers/dataSummaryController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get((req, res) => {
  getDataSummary(req, res);
});

export default handler;
