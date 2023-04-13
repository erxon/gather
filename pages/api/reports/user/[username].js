import { getReports, getReportsByUsername } from "@/lib/controllers/reportController";
import nextConnect from "next-connect";

const handler = nextConnect();


handler.get((req, res) => {
    const { username } = req.query;
    getReportsByUsername(username).then((data) => {
        res.status(200).json({data: data})
    }).catch ((err)=> {
        res.status(400).json(err)
    });
});

export default handler;