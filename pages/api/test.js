import nc from 'next-connect';
import dbConnect from '@/db/dbConnect';

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
        res.status(200).json({message: 'Successfully connected to DB'});
    } catch (err) {
        res.status(400).json({message: err});
    }
});

export default apiRoute;