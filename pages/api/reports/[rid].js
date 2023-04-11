import auth from "@/middleware/auth";
import nextConnect from "next-connect";
import { getReportById, updateReport, deleteReport } from "@/lib/controllers/reportController";

const handler = nextConnect();

handler.use(auth).get((req, res) => {
    const { rid } = req.query;

    getReportById(rid).then((data) => {
        res.json(data)
    }).catch(err => {
        res.json(err)
    })
}).use((req, res, next) => {
    const user = req.user;
    user.then((data) => {
      if (!data) {
        res.status(401).send('unauthenticated')
      } else {
        next()
      }
    });
}).use((req, res, next) => {
    const user = req.user
    user.then((data) => {
        if(data.type === "Authority"){
            next()
        } else {
            res.status(400).send('unauthorized')
        }
    })

}).put((req, res) => {
    //edit report
    const {rid} = req.query
    const update = req.body;
    updateReport(rid, update).then((data) => {
        res.json({
            data: data, 
            update: update,  
            message: 'updated successfully'
        })
    }).catch(err => {
        res.json({err})
    })
}).delete((req, res) => {
    const {rid} = req.query
    deleteReport(rid).then((data) => {
        res.json({data: data, message: 'successfully deleted'})
    }).catch(err => {
        res.json(err)
    })
})

export default handler;