import { findUserByUsername } from "@/lib/controllers/userController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.get((req, res) => {
    findUserByUsername(req, res)
})

export default handler;