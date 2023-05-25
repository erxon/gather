import { findUserById } from "@/lib/db";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get(async (req, res) => {
    const { uid }= req.query
    try {
        const user = await findUserById(uid)
        return res.json({user: user})
    } catch (err){
        return res.status(400).json({error: err})
    }
})

export default handler;