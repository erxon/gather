import { getCount } from "@/lib/controllers/notificationController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get((req, res) => {
    getCount(req, res)
})

export default handler;