import nextConnect from "next-connect";
import { findUserById } from "@/lib/db";
import auth from "@/middleware/auth";

const handler = nextConnect();

handler.use(auth).get(async (req, res) => {
    const user = await req.user;
    findUserById(user._id).then((data) => {
        if (data && data.errors) {
            res.status(400).json({message: 'Cannot retrieve user'})
        }
        res.json(data.contacts)
    }).catch(err => {
        res.status(400).json({message: 'Something wrong happened'})
    })
})

export default handler;