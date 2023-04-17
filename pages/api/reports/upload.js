import nextConnect from "next-connect";
import { addReporter } from "@/lib/controllers/reporterController";
import { createReport } from "@/lib/controllers/reportController";

const handler = nextConnect();


handler.post((req, res) => {
    const report = {
        reporter: "",
        photo: req.body.photo,
        firstName: req.body.mpFirstName,
        lastName: req.body.mpLastName,
        age: req.body.mpAge,
        gender: req.body.mpGender,
        lastSeen: req.body.mpLastSeen,
        status: 'pending',
        reportedAt: new Date()
    }
    const reporter = {
        firstName: req.body.rFirstName,
        lastName: req.body.rLastName,
        relationToMissing: req.body.rRelationToMissing,
        contactNumber: req.body.rContactNumber,
        email: req.body.rEmail
    }
    addReporter(reporter).then((response) => {
        report.reporter = response._id,
        createReport(report).then((response) => {
            if (response && response.errors){
                res.status(400).json({error: 'something went wrong'})
            }
            res.status(200).json({data: response, message: 'successfully saved'})
        })
    })
})


export default handler;