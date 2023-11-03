import nextConnect from "next-connect";
import { reportsSummary } from "@/lib/controllers/dataSummaryController";

const handler = nextConnect();

handler.get((req, res) => {
    reportsSummary(req, res)
})

export default handler;