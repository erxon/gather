import nextConnect from "next-connect";
import { findUserById } from "@/lib/db";

const handler = nextConnect();

handler.get((req, res) => {
    const {uid} = req.query;
    findUserById(req, uid).then((data) => {
        if (data && data.errors) {
            res.status(400).json({message: 'Cannot retrieve user'})
        }
        res.json(data)
    }).catch(err => {
        res.status(400).json({message: 'Something wrong happened'})
    })
})

export default handler;