import nc from 'next-connect';
import dbConnect from '@/db/dbConnect';
import Report from '@/db/report';

const apiRoute = nc({
    onError: (err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end("Something broke!");
      },
    onNoMatch: (req, res) => {
        res.status(404).end("Page is not found");
    },
}).get(async (req, res) => {
    try{
        await dbConnect();
        try{
            let reports = await Report.find({});
            res.status(200).json(reports);
        } catch (err) {
            res.status(400).json({error: err});
        }

    } catch (err) {
        res.status(400).json({error: err});
    }
}).post(async (req, res) => {
    try{
        await dbConnect();
        let data = req.body;
        const newReport = new Report(data);
        try{
            await newReport.save()
            res.status(200).json({message: 'Report uploaded'})
        } catch (err) {
            res.status(400).json({message: err});
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
});

export default apiRoute;