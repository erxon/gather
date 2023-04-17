import nextConnect from "next-connect";
import { updateReport } from "@/lib/controllers/reportController";
import { useRouter } from "next/router";

const handler = nextConnect();

handler.put((req, res) => {
    const {rid} = req.query;

    const {username, account} = req.body;

    updateReport(rid, {
        username: username, 
        account: account
    }).then((data) => {
        res.status(200).json({data: data, message: 'successfully updated'});
    });
});

export default handler;