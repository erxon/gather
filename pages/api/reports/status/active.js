import nextConnect from "next-connect";
import { getActiveReports } from "@/lib/controllers/reportController";

const handler = nextConnect();

handler.get(async (req, res) => {
     try{
        const reports = await getActiveReports()
        res.json({activeReports: reports})
    } catch (err){
        res.json({error: err})
    }
})

export default handler;
