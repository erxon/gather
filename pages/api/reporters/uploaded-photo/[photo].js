import { getReporterByUploadedPhoto } from "@/lib/controllers/reporterController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get((req, res) => {
    getReporterByUploadedPhoto(req, res)
});

export default handler;
