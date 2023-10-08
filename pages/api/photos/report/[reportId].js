import { addReferenceImage, findPhotoWithReportId } from "@/lib/controllers/photoController";
import nextConnect from "next-connect";

const handler = nextConnect()

handler.get((req, res) => {
    findPhotoWithReportId(req, res)
}).put((req, res) => {
    //Add a controller that will add image to the report
    addReferenceImage(req, res)
})

export default handler;