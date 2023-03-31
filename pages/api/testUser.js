import nc from 'next-connect';
import dbConnect from '@/db/dbConnect';
import User from '@/db/user';

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
            let users = await User.find({});
            res.status(200).json(users);
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
        const newUser = new User(data);
        try{
            await newUser.save()
            res.status(200).json({message: 'User registered'})
        } catch (err) {
            res.status(400).json({message: err});
        }
    } catch (err) {
        res.status(400).json({error: err});
    }
});

export default apiRoute;