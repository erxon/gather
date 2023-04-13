import nextConnect from "next-connect";
import { createReport, getReports } from "@/lib/controllers/reportController";

const handler = nextConnect();

handler.post((req, res) => {
    const data = {
        ...req.body,
        reportedAt: new Date()
    }

    createReport(data).then((response) => {
        res.status(200).json({message: 'successfully uploaded'})
    }).catch(err => {
        res.json({error: err})
    })

}).get((req, res) => {
    //get all reports
    getReports().then((data) => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
})

export default handler;