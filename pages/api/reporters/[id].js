import nextConnect from "next-connect";
import { getReporterById, editReporter, deleteReporter } from "@/lib/controllers/reporterController";
const handler = nextConnect();

handler.get((req, res) => {
    const {id} = req.query;
    getReporterById(id).then((data) => {
        res.json({data: data});
    }).catch(err => {
        res.json(err);
    })
}).put((req, res) => {
    const {id} = req.query;
    const update = {...req.body, updatedAt: new Date()}
    editReporter(id, update).then((data) => {
        res.json({data: data, update: update, message: 'successfully updated'})
    }).catch(err => {
        res.json(err);
    })
}).delete((req, res) => {
    const {id} = req.query;
    deleteReporter(id).then((data) => {
        res.json({data: data, message: 'successfully deleted'})
    }).catch(err => {
        res.json(err)
    })
})

export default handler;