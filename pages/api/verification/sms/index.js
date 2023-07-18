import { verifyPhoneNumber } from "@/lib/controllers/verificationController";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post((req, res) => {
  verifyPhoneNumber(req, res);
});

export default handler;
