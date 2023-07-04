import { findPhotoWithReportId } from "@/lib/controllers/photoController";
import nextConnect from "next-connect";

const handler = nextConnect()

handler.get((req, res) => {
    findPhotoWithReportId(req, res)
})

export default handler;