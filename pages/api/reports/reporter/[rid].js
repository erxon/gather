import nextConnect from 'next-connect';
import { findReportWithReporter } from '@/lib/controllers/reportController';
const handler = nextConnect();

handler.get((req, res) => {
    const {rid} = req.query
    findReportWithReporter(rid).then((response) => {
        if(response && response.errors){
            res.status(400).json({err})
        } else {
            res.status(200).json({data: response})
        }
    })
})

export default handler;