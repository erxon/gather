import nextConnect from "next-connect";
import { addReporter, getReporters } from "@/lib/controllers/reporterController";
const handler = nextConnect();

handler.post((req, res) => {
    const data = req.body;
    addReporter(data).then((response) => {
        if(response && response.errors) {
            res.status(400).json({error: 'Something went wrong'})
        }
        res.status(200).json({data: response, message: "successfully added"});
    }).catch(err => {
        res.json(err);
    })
}).get((req, res) => {
    getReporters().then((data) => {
        res.status(200).json({data: data})
    }).catch(err => {
        res.status(400).json(err);
    })
})

export default handler;