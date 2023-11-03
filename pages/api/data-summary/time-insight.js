import { timeInsight } from "@/lib/controllers/dataSummaryController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get((req, res) => {
  timeInsight(req, res);
});

export default handler;
