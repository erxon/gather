import nextConnect from "next-connect";
import { createReport, getReports } from "@/lib/controllers/reportController";

const handler = nextConnect();

handler.post((req, res) => {
    const data = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        lastSeen: req.body.lastSeen,
        gender: req.body.gender,
        age: req.body.age,
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